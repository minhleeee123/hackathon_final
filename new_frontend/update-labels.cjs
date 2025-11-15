const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
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
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

const GMAIL_COLORS = {
  RED: { backgroundColor: '#fb4c2f', textColor: '#ffffff' },
  ORANGE: { backgroundColor: '#ffad47', textColor: '#ffffff' },
  PINK: { backgroundColor: '#f691b3', textColor: '#ffffff' }
};

async function updateLabels() {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  console.log('🔧 Updating Gmail labels...\n');

  // Get existing labels
  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const existingLabels = labelsRes.data.labels || [];

  // Find labels that need updating
  const labelUpdates = [
    { name: 'Quan trọng', color: GMAIL_COLORS.RED, action: 'create' },
    { name: 'Người thân & Gia đình', color: GMAIL_COLORS.ORANGE, action: 'update' },
    { name: 'Bạn bè', color: GMAIL_COLORS.PINK, action: 'update' }
  ];

  for (const labelConfig of labelUpdates) {
    const existing = existingLabels.find(l => l.name === labelConfig.name);

    try {
      if (!existing && labelConfig.action === 'create') {
        // Create new label
        const newLabel = await gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelConfig.name,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
            color: labelConfig.color
          }
        });
        console.log(`✅ Created "${labelConfig.name}" (ID: ${newLabel.data.id})`);
        console.log(`   Color: ${labelConfig.color.backgroundColor}`);
      } else if (existing && labelConfig.action === 'update') {
        // Update existing label color
        await gmail.users.labels.update({
          userId: 'me',
          id: existing.id,
          requestBody: {
            name: labelConfig.name,
            color: labelConfig.color
          }
        });
        console.log(`✅ Updated "${labelConfig.name}" (ID: ${existing.id})`);
        console.log(`   Color: ${labelConfig.color.backgroundColor}`);
      } else if (existing) {
        console.log(`⏭️  Skipped "${labelConfig.name}" (already exists)`);
      }
    } catch (error) {
      console.error(`❌ Failed to ${labelConfig.action} "${labelConfig.name}":`, error.message);
    }
  }

  console.log('\n✨ Done!');
}

updateLabels().catch(console.error);
