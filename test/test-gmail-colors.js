/**
 * TEST GMAIL API - Đổi màu Labels
 * 
 * Chạy: node test-gmail-colors.js
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

/**
 * GMAIL CHỈ CHO PHÉP CÁC MÀU SAU:
 * Nguồn: https://developers.google.com/gmail/api/guides/labels#label_colors
 */
const GMAIL_COLORS = {
  // Background colors
  backgrounds: {
    '#000000': 'Đen',
    '#434343': 'Xám đậm',
    '#666666': 'Xám',
    '#999999': 'Xám nhạt',
    '#cccccc': 'Xám rất nhạt',
    '#efefef': 'Gần trắng',
    '#f3f3f3': 'Trắng xám',
    '#ffffff': 'Trắng',
    '#fb4c2f': 'Đỏ',
    '#ffad47': 'Cam',
    '#fad165': 'Vàng',
    '#16a766': 'Xanh lá',
    '#43d692': 'Xanh lá nhạt',
    '#4a86e8': 'Xanh dương',
    '#a479e2': 'Tím',
    '#f691b3': 'Hồng',
    '#f6c5be': 'Hồng nhạt',
    '#ffe6c7': 'Cam nhạt',
    '#fef1d1': 'Vàng nhạt',
    '#b9e4d0': 'Xanh lá rất nhạt',
    '#c6f3de': 'Xanh lá cực nhạt',
    '#c9daf8': 'Xanh dương nhạt',
    '#e4d7f5': 'Tím nhạt',
    '#fcdee8': 'Hồng rất nhạt',
    '#efa093': 'Đỏ nhạt',
    '#ffd6a2': 'Cam vàng',
    '#fce8b3': 'Vàng kem',
    '#89d3b2': 'Xanh ngọc',
    '#a0eac9': 'Xanh mint',
    '#a4c2f4': 'Xanh sky',
    '#d0bcf1': 'Lavender',
    '#fbc8d9': 'Hồng sen',
    '#e66550': 'Đỏ gạch',
    '#ffbc6b': 'Cam đào',
    '#fcda83': 'Vàng bơ',
    '#44b984': 'Xanh lục',
    '#68dfa9': 'Xanh emerald',
    '#6d9eeb': 'Xanh biển',
    '#b694e8': 'Tím violet',
    '#f7a7c0': 'Hồng đào',
    '#cc3a21': 'Đỏ thẫm',
    '#eaa041': 'Cam đậm',
    '#f2c960': 'Vàng đậm',
    '#149e60': 'Xanh lá đậm',
    '#3dc789': 'Xanh lục đậm',
    '#3c78d8': 'Xanh dương đậm',
    '#8e63ce': 'Tím đậm',
    '#e07798': 'Hồng đậm',
    '#ac2b16': 'Đỏ máu',
    '#cf8933': 'Nâu cam',
    '#d5ae49': 'Vàng cát',
    '#0b804b': 'Xanh rêu',
    '#2a9c68': 'Xanh cỏ',
    '#285bac': 'Xanh navy',
    '#653e9b': 'Tím đậm',
    '#b65775': 'Đỏ tía',
    '#822111': 'Đỏ sẫm',
    '#a46a21': 'Nâu',
    '#aa8831': 'Vàng nâu',
    '#076239': 'Xanh đậm',
    '#1a764d': 'Xanh rừng',
    '#1c4587': 'Xanh đen',
    '#41236d': 'Tím than',
    '#83334c': 'Đỏ nâu'
  },
  
  // Text colors (chỉ có 2 màu)
  textColors: {
    '#000000': 'Chữ đen',
    '#ffffff': 'Chữ trắng'
  }
};

/**
 * Hiển thị tất cả màu có sẵn
 */
function displayAvailableColors() {
  console.log('\n🎨 ========== MÀU CHỮ NỀN CÓ SẴN (Background Colors) ==========\n');
  
  const colors = Object.entries(GMAIL_COLORS.backgrounds);
  for (let i = 0; i < colors.length; i++) {
    const [hex, name] = colors[i];
    console.log(`${(i + 1).toString().padStart(2)}. ${hex.padEnd(10)} - ${name}`);
  }
  
  console.log('\n📝 ========== MÀU CHỮ (Text Colors) ==========\n');
  Object.entries(GMAIL_COLORS.textColors).forEach(([hex, name]) => {
    console.log(`   ${hex} - ${name}`);
  });
}

/**
 * Đổi màu label
 */
async function updateLabelColor(gmail, labelId, backgroundColor, textColor = '#ffffff') {
  await gmail.users.labels.update({
    userId: 'me',
    id: labelId,
    requestBody: {
      color: {
        backgroundColor: backgroundColor,
        textColor: textColor
      }
    }
  });
}

/**
 * Lấy ID của label theo tên
 */
async function getLabelIdByName(gmail, labelName) {
  const labelsRes = await gmail.users.labels.list({ userId: 'me' });
  const labels = labelsRes.data.labels || [];
  const label = labels.find(l => l.name === labelName);
  return label ? label.id : null;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎨 ========== GMAIL API - ĐỔI MÀU LABELS ==========\n');
  
  // Hiển thị tất cả màu có sẵn
  displayAvailableColors();
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Đang xác thực...\n');
  
  const auth = await authorize();
  console.log('✅ Xác thực thành công!\n');
  
  const gmail = google.gmail({version: 'v1', auth});
  
  // Đổi màu các labels đã tạo
  console.log('🎨 ========== ĐỔI MÀU CÁC LABELS ==========\n');
  
  const labelColors = {
    'Công việc': { bg: '#4a86e8', text: '#ffffff', name: 'Xanh dương' },
    'Gia đình': { bg: '#e66550', text: '#ffffff', name: 'Đỏ gạch' },
    'Bạn bè': { bg: '#16a766', text: '#ffffff', name: 'Xanh lá' },
    'Khẩn cấp': { bg: '#cc3a21', text: '#ffffff', name: 'Đỏ thẫm' },
    'Cần xử lý': { bg: '#ffad47', text: '#000000', name: 'Cam' }
  };
  
  for (const [labelName, color] of Object.entries(labelColors)) {
    try {
      const labelId = await getLabelIdByName(gmail, labelName);
      
      if (!labelId) {
        console.log(`⚠️  Không tìm thấy label "${labelName}"`);
        continue;
      }
      
      await updateLabelColor(gmail, labelId, color.bg, color.text);
      console.log(`✅ Đã đổi màu label "${labelName}" → ${color.name} (${color.bg})`);
    } catch (error) {
      console.log(`❌ Lỗi khi đổi màu "${labelName}": ${error.message}`);
    }
  }
  
  console.log('\n✨ ========== HOÀN THÀNH! ==========\n');
  console.log('💡 Vào Gmail web để xem labels với màu mới!');
  console.log('📧 https://mail.google.com\n');
  console.log('🎨 Màu labels:');
  console.log('   - Công việc: Xanh dương');
  console.log('   - Gia đình: Đỏ gạch');
  console.log('   - Bạn bè: Xanh lá');
  console.log('   - Khẩn cấp: Đỏ thẫm');
  console.log('   - Cần xử lý: Cam\n');
}

main().catch(console.error);
