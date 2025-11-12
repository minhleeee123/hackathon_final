#!/usr/bin/env node

/**
 * 📧 GMAIL API TEST - Phiên bản đơn giản
 * 
 * Chạy: node test-gmail-simple.js
 */

const fs = require('fs').promises;
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
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

async function main() {
  console.log('\n📧 GMAIL API - TEST ĐƠN GIẢN\n');
  console.log('Đang xác thực Gmail...');
  
  try {
    const auth = await authorize();
    console.log('✅ Xác thực thành công!\n');
    
    const gmail = google.gmail({version: 'v1', auth});
    
    // Lấy profile
    const profile = await gmail.users.getProfile({userId: 'me'});
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 THÔNG TIN TÀI KHOẢN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${profile.data.emailAddress}`);
    console.log(`Tổng email: ${profile.data.messagesTotal}`);
    console.log(`Tổng threads: ${profile.data.threadsTotal}`);
    
    // Lấy 5 email mới nhất
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📬 5 EMAIL MỚI NHẤT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });

    const messages = res.data.messages || [];
    
    if (messages.length === 0) {
      console.log('Không có email nào.');
      return;
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: messages[i].id,
      });

      const headers = msg.data.payload.headers;
      const from = getHeader(headers, 'From');
      const subject = getHeader(headers, 'Subject');
      const date = getHeader(headers, 'Date');

      console.log(`${i + 1}. ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`   Từ: ${from}`);
      console.log(`   Tiêu đề: ${subject}`);
      console.log(`   Ngày: ${date}`);
      console.log(`   Labels: ${msg.data.labelIds ? msg.data.labelIds.join(', ') : 'Không có'}`);
      console.log('');
    }
    
    console.log('✨ Hoàn thành!\n');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    
    if (error.message.includes('redirect_uri_mismatch')) {
      console.log('\n💡 Hướng dẫn sửa lỗi:');
      console.log('1. Vào https://console.cloud.google.com/');
      console.log('2. Chọn project: gmail-api-478007');
      console.log('3. APIs & Services > Credentials');
      console.log('4. Click vào OAuth 2.0 Client ID');
      console.log('5. Thêm "http://localhost" vào Authorized redirect URIs');
      console.log('6. Save và chạy lại\n');
    }
  }
}

main();
