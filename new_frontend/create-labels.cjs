const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
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

/**
 * Load or request or authorization to call APIs.
 */
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

/**
 * Gmail color palette - these are the ONLY allowed colors
 * Reference: https://developers.google.com/gmail/api/guides/labels#label_colors
 */
const GMAIL_COLOR_PALETTE = {
  // Reds
  RED_DARK: { backgroundColor: '#ac2b16', textColor: '#ffffff' },
  RED: { backgroundColor: '#e07798', textColor: '#ffffff' },
  RED_LIGHT: { backgroundColor: '#fb4c2f', textColor: '#ffffff' },
  
  // Oranges
  ORANGE_DARK: { backgroundColor: '#b65775', textColor: '#ffffff' },
  ORANGE: { backgroundColor: '#ff6d00', textColor: '#ffffff' },
  ORANGE_LIGHT: { backgroundColor: '#ffad47', textColor: '#ffffff' },
  
  // Yellows
  YELLOW_DARK: { backgroundColor: '#fad165', textColor: '#000000' },
  YELLOW: { backgroundColor: '#fdffb6', textColor: '#000000' },
  YELLOW_LIGHT: { backgroundColor: '#fef1d1', textColor: '#000000' },
  
  // Greens
  GREEN_DARK: { backgroundColor: '#0b8043', textColor: '#ffffff' },
  GREEN: { backgroundColor: '#149e60', textColor: '#ffffff' },
  GREEN_LIGHT: { backgroundColor: '#16a766', textColor: '#ffffff' },
  
  // Cyans
  CYAN_DARK: { backgroundColor: '#285bac', textColor: '#ffffff' },
  CYAN: { backgroundColor: '#43d692', textColor: '#ffffff' },
  CYAN_LIGHT: { backgroundColor: '#4a86e8', textColor: '#ffffff' },
  
  // Blues
  BLUE_DARK: { backgroundColor: '#3c78d8', textColor: '#ffffff' },
  BLUE: { backgroundColor: '#6d9eeb', textColor: '#ffffff' },
  BLUE_LIGHT: { backgroundColor: '#a4c2f4', textColor: '#000000' },
  
  // Purples
  PURPLE_DARK: { backgroundColor: '#8e63ce', textColor: '#ffffff' },
  PURPLE: { backgroundColor: '#a479e2', textColor: '#ffffff' },
  PURPLE_LIGHT: { backgroundColor: '#b99aff', textColor: '#ffffff' },
  
  // Pinks
  PINK_DARK: { backgroundColor: '#c6a4cf', textColor: '#000000' },
  PINK: { backgroundColor: '#e07798', textColor: '#ffffff' },
  PINK_LIGHT: { backgroundColor: '#f691b3', textColor: '#ffffff' },
  
  // Grays
  GRAY_DARK: { backgroundColor: '#666666', textColor: '#ffffff' },
  GRAY: { backgroundColor: '#999999', textColor: '#ffffff' },
  GRAY_LIGHT: { backgroundColor: '#cccccc', textColor: '#000000' }
};

async function createLabels() {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  // Define labels with Gmail-approved colors
  const labelsToCreate = [
    { 
      name: 'Công việc', 
      color: GMAIL_COLOR_PALETTE.BLUE
    },
    { 
      name: 'Cá nhân', 
      color: GMAIL_COLOR_PALETTE.GREEN
    },
    { 
      name: 'Tài chính', 
      color: GMAIL_COLOR_PALETTE.YELLOW_DARK
    },
    { 
      name: 'Người thân & Gia đình', 
      color: GMAIL_COLOR_PALETTE.ORANGE
    },
    { 
      name: 'Quan trọng', 
      color: GMAIL_COLOR_PALETTE.RED
    },
    { 
      name: 'Spam & Quảng cáo', 
      color: GMAIL_COLOR_PALETTE.PINK
    },
    { 
      name: 'Cần xác minh', 
      color: GMAIL_COLOR_PALETTE.PURPLE_LIGHT
    },
    { 
      name: '📋 Task for Agent 2', 
      color: GMAIL_COLOR_PALETTE.RED_DARK
    }
  ];

  console.log('🏷️  Creating Gmail labels with approved colors...\n');

  // Get existing labels
  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const existingLabels = labelsRes.data.labels || [];
  const existingLabelNames = existingLabels.map(l => l.name);

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const labelConfig of labelsToCreate) {
    try {
      if (existingLabelNames.includes(labelConfig.name)) {
        const existing = existingLabels.find(l => l.name === labelConfig.name);
        console.log(`⏭️  Skipping "${labelConfig.name}" (already exists with ID: ${existing.id})`);
        skipped++;
      } else {
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
        console.log(`   Color: ${labelConfig.color.backgroundColor} / ${labelConfig.color.textColor}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Failed to create "${labelConfig.name}":`, error.message);
      if (error.message.includes('color')) {
        console.error('   Note: This color might not be in Gmail\'s approved palette');
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (already exists): ${skipped}`);
  console.log(`   Total: ${labelsToCreate.length}`);
}

// Run the script
createLabels().catch(console.error);
