const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json());

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

let authClient = null;

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  if (authClient) return authClient;
  
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    authClient = client;
    return client;
  }
  
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  
  if (client.credentials) {
    await saveCredentials(client);
  }
  authClient = client;
  return client;
}

function mapGmailLabelToFolder(labels) {
  if (labels.includes('TRASH')) return 'trash';
  if (labels.includes('SPAM')) return 'spam';
  if (labels.includes('DRAFT')) return 'drafts';
  if (labels.includes('SENT')) return 'sent';
  if (labels.includes('STARRED')) return 'starred';
  return 'inbox';
}

function extractEmailAddress(header) {
  const match = header.match(/<(.+?)>/);
  return match ? match[1] : header;
}

function extractName(header) {
  const match = header.match(/^(.+?)\s*</);
  return match ? match[1].trim().replace(/"/g, '') : header;
}

function getHeader(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

function decodeBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return str;
  }
}

function getEmailBody(payload) {
  if (payload.body && payload.body.data) {
    return decodeBase64(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        return decodeBase64(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        const text = decodeBase64(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        return text.replace(/\n/g, '<br>');
      }
    }
  }
  
  return 'No content';
}

function getEmailSnippet(body) {
  const text = body.replace(/<[^>]*>/g, '');
  return text.substring(0, 150);
}

// API Routes

// Get all Gmail labels (system + user created)
app.get('/api/labels', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    const labelsRes = await gmail.users.labels.list({ userId: 'me' });
    const allLabels = labelsRes.data.labels || [];

    // Phân loại labels
    const systemLabels = allLabels.filter(l => l.type === 'system');
    const userLabels = allLabels.filter(l => l.type === 'user');

    res.json({
      labels: allLabels,
      systemLabels: systemLabels,
      userLabels: userLabels
    });
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/emails', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const maxResults = parseInt(req.query.maxResults) || 50;

    const listRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults,
    });

    const messages = listRes.data.messages || [];
    const emails = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });

      const headers = msg.data.payload.headers || [];
      const from = getHeader(headers, 'from');
      const to = getHeader(headers, 'to');
      const subject = getHeader(headers, 'subject');
      const date = getHeader(headers, 'date');
      const labelIds = msg.data.labelIds || [];

      const body = getEmailBody(msg.data.payload);
      const snippet = getEmailSnippet(body);

      const email = {
        id: msg.data.id,
        from: {
          name: extractName(from),
          email: extractEmailAddress(from),
        },
        to: to.split(',').map(e => e.trim()),
        subject: subject || '(No subject)',
        body: body,
        snippet: snippet,
        date: new Date(date).toISOString(),
        isRead: !labelIds.includes('UNREAD'),
        isStarred: labelIds.includes('STARRED'),
        labels: labelIds, // ← Trả về TẤT CẢ labelIds từ Gmail
        hasAttachments: msg.data.payload.parts?.some(
          part => part.filename && part.filename.length > 0
        ) || false,
        folder: mapGmailLabelToFolder(labelIds)
      };

      emails.push(email);
    }

    res.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emails/:id/star', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { star } = req.body;

    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      requestBody: {
        addLabelIds: star ? ['STARRED'] : [],
        removeLabelIds: star ? [] : ['STARRED']
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error starring email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emails/:id/read', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { read } = req.body;

    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      requestBody: {
        addLabelIds: read ? [] : ['UNREAD'],
        removeLabelIds: read ? ['UNREAD'] : []
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emails/:id/delete', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.trash({
      userId: 'me',
      id: req.params.id
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add label to email
app.post('/api/emails/:id/labels/add', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { labelIds } = req.body;

    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      requestBody: {
        addLabelIds: Array.isArray(labelIds) ? labelIds : [labelIds]
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding label:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove label from email
app.post('/api/emails/:id/labels/remove', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { labelIds } = req.body;

    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      requestBody: {
        removeLabelIds: Array.isArray(labelIds) ? labelIds : [labelIds]
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing label:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new label
app.post('/api/labels/create', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { name, color } = req.body;

    const newLabel = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: name,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        color: color || {
          backgroundColor: '#42d692',
          textColor: '#ffffff'
        }
      }
    });

    res.json({ success: true, label: newLabel.data });
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete label
app.delete('/api/labels/:labelId', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.labels.delete({
      userId: 'me',
      id: req.params.labelId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting label:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emails/send', async (req, res) => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    const { to, subject, body } = req.body;

    const message = [
      `To: ${to.join(', ')}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Gmail API server running on http://localhost:${PORT}`);
});
