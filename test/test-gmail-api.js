/**
 * TEST GMAIL API - Hiển thị thông tin email
 * 
 * Chạy: node test-gmail-api.js
 * 
 * Lần đầu chạy sẽ mở browser để xác thực Gmail
 * Token sẽ được lưu vào file token.json
 */

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// Phạm vi truy cập Gmail
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

// File lưu token
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret_458311033949-n6v48o3r3tirlodf3noraj5fknngtneg.apps.googleusercontent.com.json');

/**
 * Đọc credentials đã lưu
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
 * Lưu credentials
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
 * Xác thực với Gmail
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
 * Decode base64url
 */
function decodeBase64(str) {
  try {
    const buff = Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    return buff.toString('utf-8');
  } catch (e) {
    return str;
  }
}

/**
 * Lấy nội dung email
 */
function getEmailBody(payload) {
  let body = '';
  
  if (payload.parts) {
    // Email có nhiều parts
    payload.parts.forEach(part => {
      if (part.mimeType === 'text/plain' && part.body.data) {
        body += decodeBase64(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body.data && !body) {
        body += decodeBase64(part.body.data);
      } else if (part.parts) {
        // Nested parts
        part.parts.forEach(subPart => {
          if (subPart.mimeType === 'text/plain' && subPart.body.data) {
            body += decodeBase64(subPart.body.data);
          }
        });
      }
    });
  } else if (payload.body.data) {
    body = decodeBase64(payload.body.data);
  }
  
  return body;
}

/**
 * Lấy giá trị header
 */
function getHeader(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

/**
 * DEMO 1: Lấy danh sách email mới nhất
 */
async function listEmails(auth) {
  console.log('\n📧 ========== DANH SÁCH EMAIL MỚI NHẤT ==========\n');
  
  const gmail = google.gmail({version: 'v1', auth});
  
  // Lấy 10 email mới nhất
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
  });

  const messages = res.data.messages || [];
  
  if (messages.length === 0) {
    console.log('Không có email nào.');
    return;
  }

  console.log(`Tìm thấy ${messages.length} email:\n`);

  // Lấy chi tiết từng email
  for (let i = 0; i < messages.length; i++) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: messages[i].id,
    });

    const headers = msg.data.payload.headers;
    const from = getHeader(headers, 'From');
    const subject = getHeader(headers, 'Subject');
    const date = getHeader(headers, 'Date');
    const body = getEmailBody(msg.data.payload);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📩 Email ${i + 1}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`👤 Từ:       ${from}`);
    console.log(`📌 Tiêu đề:  ${subject}`);
    console.log(`📅 Ngày:     ${date}`);
    console.log(`🔖 Labels:   ${msg.data.labelIds ? msg.data.labelIds.join(', ') : 'Không có'}`);
    console.log(`📝 Nội dung (100 ký tự đầu):`);
    console.log(body.substring(0, 200).replace(/\n/g, ' ') + '...');
    console.log('');
  }
}

/**
 * DEMO 2: Tìm kiếm email
 */
async function searchEmails(auth, query) {
  console.log(`\n🔍 ========== TÌM KIẾM: "${query}" ==========\n`);
  
  const gmail = google.gmail({version: 'v1', auth});
  
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 5,
  });

  const messages = res.data.messages || [];
  
  if (messages.length === 0) {
    console.log('Không tìm thấy email nào.');
    return;
  }

  console.log(`Tìm thấy ${messages.length} email:\n`);

  for (let i = 0; i < messages.length; i++) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: messages[i].id,
    });

    const headers = msg.data.payload.headers;
    const from = getHeader(headers, 'From');
    const subject = getHeader(headers, 'Subject');
    
    console.log(`${i + 1}. Từ: ${from}`);
    console.log(`   Tiêu đề: ${subject}\n`);
  }
}

/**
 * DEMO 3: Thống kê email
 */
async function getEmailStats(auth) {
  console.log('\n📊 ========== THỐNG KÊ EMAIL ==========\n');
  
  const gmail = google.gmail({version: 'v1', auth});
  
  // Lấy profile
  const profile = await gmail.users.getProfile({userId: 'me'});
  console.log(`📧 Email: ${profile.data.emailAddress}`);
  console.log(`📬 Tổng số email: ${profile.data.messagesTotal}`);
  console.log(`🧵 Tổng số threads: ${profile.data.threadsTotal}`);
  
  // Lấy labels
  const labels = await gmail.users.labels.list({userId: 'me'});
  console.log(`\n🏷️  Các nhãn (Labels):`);
  labels.data.labels.forEach(label => {
    console.log(`   - ${label.name} (${label.id})`);
  });
  
  // Đếm email chưa đọc
  const unreadRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 1,
  });
  console.log(`\n📭 Email chưa đọc: ${unreadRes.data.resultSizeEstimate || 0}`);
  
  // Đếm email đã gắn sao
  const starredRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:starred',
    maxResults: 1,
  });
  console.log(`⭐ Email đã gắn sao: ${starredRes.data.resultSizeEstimate || 0}`);
  
  // Đếm email quan trọng
  const importantRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:important',
    maxResults: 1,
  });
  console.log(`❗ Email quan trọng: ${importantRes.data.resultSizeEstimate || 0}`);
}

/**
 * DEMO 4: Lấy email theo label
 */
async function getEmailsByLabel(auth, labelName) {
  console.log(`\n📁 ========== EMAIL TRONG "${labelName}" ==========\n`);
  
  const gmail = google.gmail({version: 'v1', auth});
  
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: [labelName],
    maxResults: 5,
  });

  const messages = res.data.messages || [];
  
  if (messages.length === 0) {
    console.log(`Không có email trong ${labelName}.`);
    return;
  }

  console.log(`Tìm thấy ${messages.length} email:\n`);

  for (let i = 0; i < messages.length; i++) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: messages[i].id,
    });

    const headers = msg.data.payload.headers;
    const from = getHeader(headers, 'From');
    const subject = getHeader(headers, 'Subject');
    
    console.log(`${i + 1}. Từ: ${from}`);
    console.log(`   Tiêu đề: ${subject}\n`);
  }
}

/**
 * DEMO 5: Gửi email đơn giản
 */
async function sendEmail(auth, to, subject, message) {
  console.log(`\n📤 ========== GỬI EMAIL ==========\n`);
  
  const gmail = google.gmail({version: 'v1', auth});
  
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    '',
    message,
  ];
  const encodedMessage = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(`✅ Email đã được gửi!`);
  console.log(`📧 Đến: ${to}`);
  console.log(`📌 Tiêu đề: ${subject}`);
  console.log(`🆔 Message ID: ${res.data.id}`);
}

/**
 * MENU CHÍNH
 */
async function main() {
  console.log('\n🚀 ========== GMAIL API TEST ==========\n');
  console.log('Đang xác thực...\n');
  
  const auth = await authorize();
  
  console.log('✅ Xác thực thành công!\n');
  
  // DEMO 1: Liệt kê email
  await listEmails(auth);
  
  // DEMO 2: Tìm kiếm email
  await searchEmails(auth, 'is:unread');
  
  // DEMO 3: Thống kê
  await getEmailStats(auth);
  
  // DEMO 4: Email trong INBOX
  await getEmailsByLabel(auth, 'INBOX');
  
  // DEMO 5: Gửi email (COMMENT OUT - uncomment để test)
  // await sendEmail(
  //   auth, 
  //   'example@gmail.com', 
  //   'Test từ Gmail API', 
  //   'Đây là email test từ Gmail API!'
  // );
  
  console.log('\n✨ ========== HOÀN THÀNH! ==========\n');
  console.log('📝 Các chức năng Gmail API đã test:');
  console.log('   ✅ Xác thực OAuth2');
  console.log('   ✅ Lấy danh sách email');
  console.log('   ✅ Tìm kiếm email');
  console.log('   ✅ Thống kê email');
  console.log('   ✅ Lấy email theo label');
  console.log('   ✅ Gửi email (đã comment)');
  console.log('\n💡 Token đã được lưu vào token.json');
  console.log('   Lần sau chạy sẽ không cần xác thực lại!\n');
}

// Chạy
main().catch(console.error);
