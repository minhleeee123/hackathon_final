/**
 * TEST GMAIL API - Gắn Labels cho Email
 * 
 * Chạy: node test-gmail-labels.js
 */

const fs = require('fs').promises;
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels'
];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret_458311033949-n6v48o3r3tirlodf3noraj5fknngtneg.apps.googleusercontent.com.json');

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

function getHeader(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

/**
 * Tạo label mới nếu chưa tồn tại
 */
async function createLabelIfNotExists(gmail, labelName) {
  // Lấy tất cả labels hiện có
  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const labels = labelsRes.data.labels || [];
  
  // Kiểm tra label đã tồn tại chưa
  const existingLabel = labels.find(l => l.name === labelName);
  
  if (existingLabel) {
    console.log(`✅ Label "${labelName}" đã tồn tại (ID: ${existingLabel.id})`);
    return existingLabel.id;
  }
  
  // Tạo label mới
  console.log(`🆕 Tạo label mới: "${labelName}"`);
  const newLabel = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
      color: {
        backgroundColor: '#42d692', // Màu xanh lá
        textColor: '#ffffff'
      }
    }
  });
  
  console.log(`✅ Đã tạo label "${labelName}" (ID: ${newLabel.data.id})`);
  return newLabel.data.id;
}

/**
 * Gắn label cho email
 */
async function addLabelToEmail(gmail, messageId, labelId) {
  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      addLabelIds: [labelId]
    }
  });
}

/**
 * Tạo các labels phổ biến
 */
async function createCommonLabels(gmail) {
  console.log('\n🏷️  ========== TẠO CÁC LABELS PHỔ BIẾN ==========\n');
  
  const commonLabels = [
    'Công việc',
    'Gia đình',
    'Bạn bè',
    'Khẩn cấp',
    'Cần xử lý'
  ];
  
  const createdLabels = {};
  
  for (const labelName of commonLabels) {
    const labelsRes = await gmail.users.labels.list({ userId: 'me' });
    const labels = labelsRes.data.labels || [];
    const existingLabel = labels.find(l => l.name === labelName);
    
    if (existingLabel) {
      console.log(`✅ "${labelName}" đã tồn tại`);
      createdLabels[labelName] = existingLabel.id;
    } else {
      const newLabel = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: labelName,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show'
        }
      });
      console.log(`🆕 Đã tạo label "${labelName}"`);
      createdLabels[labelName] = newLabel.data.id;
    }
  }
  
  return createdLabels;
}

/**
 * Gắn label "Công việc" cho 10 email đầu tiên
 */
async function labelFirst10Emails(gmail, labelId) {
  console.log('\n📧 ========== GẮN LABEL CHO 10 EMAIL ĐẦU TIÊN ==========\n');
  
  // Lấy 10 email đầu tiên
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
  });

  const messages = res.data.messages || [];
  
  if (messages.length === 0) {
    console.log('Không có email nào.');
    return;
  }

  console.log(`Tìm thấy ${messages.length} email. Đang gắn label "Công việc"...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < messages.length; i++) {
    try {
      // Lấy thông tin email
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: messages[i].id,
      });

      const headers = msg.data.payload.headers;
      const from = getHeader(headers, 'From');
      const subject = getHeader(headers, 'Subject');
      
      // Gắn label
      await addLabelToEmail(gmail, messages[i].id, labelId);
      
      console.log(`✅ ${i + 1}. Đã gắn label`);
      console.log(`   Từ: ${from}`);
      console.log(`   Tiêu đề: ${subject}\n`);
      
      success++;
    } catch (error) {
      console.log(`❌ ${i + 1}. Lỗi: ${error.message}\n`);
      failed++;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Kết quả: ${success} thành công, ${failed} thất bại`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Hiển thị tất cả labels
 */
async function listAllLabels(gmail) {
  console.log('\n🏷️  ========== DANH SÁCH TẤT CẢ LABELS ==========\n');
  
  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const labels = labelsRes.data.labels || [];
  
  // Phân loại labels
  const systemLabels = labels.filter(l => l.type === 'system');
  const userLabels = labels.filter(l => l.type === 'user');
  
  console.log('📌 SYSTEM LABELS (Gmail mặc định):');
  systemLabels.forEach(label => {
    console.log(`   - ${label.name} (${label.id})`);
  });
  
  console.log(`\n🎨 USER LABELS (Người dùng tạo): ${userLabels.length} labels`);
  if (userLabels.length > 0) {
    userLabels.forEach(label => {
      console.log(`   - ${label.name} (${label.id})`);
    });
  } else {
    console.log('   (Chưa có label nào)');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 ========== GMAIL API - QUẢN LÝ LABELS ==========\n');
  console.log('Đang xác thực...\n');
  
  const auth = await authorize();
  console.log('✅ Xác thực thành công!\n');
  
  const gmail = google.gmail({version: 'v1', auth});
  
  // 1. Hiển thị tất cả labels hiện có
  await listAllLabels(gmail);
  
  // 2. Tạo các labels phổ biến
  const labels = await createCommonLabels(gmail);
  
  // 3. Gắn label "Công việc" cho 10 email đầu tiên
  await labelFirst10Emails(gmail, labels['Công việc']);
  
  // 4. Hiển thị lại danh sách labels
  await listAllLabels(gmail);
  
  console.log('\n✨ ========== HOÀN THÀNH! ==========\n');
  console.log('💡 Bạn có thể:');
  console.log('   - Vào Gmail web để xem các labels mới');
  console.log('   - Click vào label "Công việc" để xem 10 email đã gắn');
  console.log('   - Gắn labels khác thủ công hoặc viết code tự động\n');
}

main().catch(console.error);
