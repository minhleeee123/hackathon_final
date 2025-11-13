// Script to remove all user labels from emails for testing
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function removeAllLabelsFromEmails() {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    console.log('Fetching user labels...');
    
    // Get all user labels
    const labelsRes = await gmail.users.labels.list({ userId: 'me' });
    const userLabels = labelsRes.data.labels.filter(l => l.type === 'user');
    const userLabelIds = userLabels.map(l => l.id);
    
    console.log(`Found ${userLabels.length} user labels:`);
    userLabels.forEach(l => console.log(`  - ${l.name} (${l.id})`));

    if (userLabelIds.length === 0) {
      console.log('No user labels to remove.');
      return;
    }

    console.log('\nFetching emails...');
    
    // Get recent emails (max 40)
    const emailsRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 40,
    });

    const messages = emailsRes.data.messages || [];
    console.log(`Found ${messages.length} emails`);

    if (messages.length === 0) {
      console.log('No emails found.');
      return;
    }

    console.log('\nRemoving labels from emails...');
    let processedCount = 0;
    let removedCount = 0;

    for (const message of messages) {
      try {
        // Get message details to check current labels
        const msgDetails = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['Subject']
        });

        const currentLabels = msgDetails.data.labelIds || [];
        const userLabelsOnEmail = currentLabels.filter(id => userLabelIds.includes(id));

        if (userLabelsOnEmail.length > 0) {
          // Remove user labels
          await gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
              removeLabelIds: userLabelsOnEmail
            }
          });

          const subject = msgDetails.data.payload.headers.find(h => h.name === 'Subject')?.value || '(No subject)';
          console.log(`  ✓ Removed ${userLabelsOnEmail.length} labels from: ${subject.substring(0, 50)}...`);
          removedCount++;
        }

        processedCount++;
        
        // Progress indicator
        if (processedCount % 10 === 0) {
          console.log(`  Progress: ${processedCount}/${messages.length} emails processed`);
        }

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`  ✗ Error processing message ${message.id}:`, error.message);
      }
    }

    console.log('\n✓ Done!');
    console.log(`  Total emails processed: ${processedCount}`);
    console.log(`  Emails with labels removed: ${removedCount}`);
    console.log(`  Emails without user labels: ${processedCount - removedCount}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
console.log('=== Remove All Email Labels Script ===\n');
removeAllLabelsFromEmails();
