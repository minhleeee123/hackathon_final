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

async function listAllLabels() {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  console.log('📋 Listing all Gmail labels:\n');

  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const labels = labelsRes.data.labels || [];

  console.log(`Total labels: ${labels.length}\n`);

  // Separate system and user labels
  const systemLabels = labels.filter(l => l.type === 'system');
  const userLabels = labels.filter(l => l.type === 'user');

  console.log('=== System Labels ===');
  systemLabels.forEach(label => {
    console.log(`  ${label.name} (${label.id})`);
  });

  console.log('\n=== User Labels ===');
  userLabels.forEach(label => {
    const colorInfo = label.color ? 
      `BG: ${label.color.backgroundColor}, Text: ${label.color.textColor}` : 
      'No color';
    console.log(`  "${label.name}" (${label.id})`);
    console.log(`    ${colorInfo}`);
  });
}

listAllLabels().catch(console.error);
