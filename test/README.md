# 🧪 TEST FILES - GMAIL & GEMINI API

Thư mục này chứa các file test để thử nghiệm Gmail API và Gemini AI API.

---

## 📧 GMAIL API Tests

### 1. `test-gmail-simple.js` 
**Mô tả:** Test cơ bản Gmail API - Hiển thị 5 email mới nhất
```bash
node test/test-gmail-simple.js
```

### 2. `test-gmail-api.js`
**Mô tả:** Test đầy đủ các tính năng Gmail API
- Lấy danh sách email
- Tìm kiếm email
- Thống kê email
- Lấy email theo label
- Gửi email (đã comment)
```bash
node test/test-gmail-api.js
```

### 3. `test-gmail-labels.js`
**Mô tả:** Quản lý Labels (Tags) cho email
- Tạo labels: Công việc, Gia đình, Bạn bè, Khẩn cấp, Cần xử lý
- Gắn label "Công việc" cho 10 email đầu tiên
```bash
node test/test-gmail-labels.js
```

### 4. `test-gmail-colors.js`
**Mô tả:** Đổi màu Labels
- Hiển thị 64 màu có sẵn
- Đổi màu cho các labels đã tạo
```bash
node test/test-gmail-colors.js
```

---

## 🤖 GEMINI AI Tests

### 5. `test-gemini-check.js`
**Mô tả:** Kiểm tra API key và list tất cả models có sẵn
```bash
node test/test-gemini-check.js
```

### 6. `test-gemini-api.js`
**Mô tả:** Test các tính năng AI cho Email Assistant
- Chat đơn giản
- Phân loại email (Công việc/Gia đình/Bạn bè/Spam...)
- Trích xuất task từ email
- Tạo email phản hồi tự động
- Phân tích cảm xúc email
```bash
node test/test-gemini-api.js
```

---

## 🔑 Credentials

- **Gmail OAuth:** `client_secret_...json` (ở thư mục gốc)
- **Gmail Token:** `token.json` (tự động tạo sau lần đăng nhập đầu)
- **Gemini API Key:** `AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw`

---

## 📦 Dependencies

```bash
npm install googleapis @google-cloud/local-auth
```

---

## ✅ Kết quả đã test

### Gmail API:
- ✅ Xác thực OAuth2 thành công
- ✅ Đọc email từ Gmail: minh00plus@gmail.com
- ✅ Tạo 5 labels: Công việc, Gia đình, Bạn bè, Khẩn cấp, Cần xử lý
- ✅ Gắn labels cho 10 email
- ✅ Đổi màu labels thành công

### Gemini API:
- ✅ API Key hợp lệ
- ✅ Tìm thấy 50+ models
- ⚠️ Quota hiện tại: Đã vượt (cần đợi reset hoặc upgrade)
- ✅ Model recommend: `gemini-2.5-flash`

---

## 🚀 Next Steps

1. Đợi Gemini quota reset (24h)
2. Tích hợp Gmail API vào ứng dụng React
3. Tích hợp Gemini AI để tự động phân loại & trả lời email
4. Kết hợp cả 2 API để tạo Email AI Assistant hoàn chỉnh

---

**Created:** November 12, 2025
