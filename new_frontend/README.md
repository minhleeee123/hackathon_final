# Gmail Clone - Email Management Interface

Giao diện clone toàn bộ chức năng của Gmail với React, TypeScript và TailwindCSS.

## ✨ Tính năng

### 📧 Quản lý Email
- ✅ Hiển thị danh sách email với avatar, tiêu đề, nội dung tóm tắt
- ✅ Đọc email chi tiết với HTML body rendering
- ✅ Soạn email mới với rich text editor (ReactQuill)
- ✅ Reply và Forward email
- ✅ Đánh dấu đã đọc/chưa đọc
- ✅ Gắn sao (Star/Unstar)
- ✅ Xóa và Archive email

### 📁 Thư mục
- **Inbox** - Hộp thư đến (hiển thị số email chưa đọc)
- **Starred** - Email đã đánh dấu sao
- **Sent** - Email đã gửi
- **Drafts** - Email nháp
- **Spam** - Thư rác
- **Trash** - Thùng rác
- **All Mail** - Tất cả email

### 🏷️ Nhãn (Labels)
- **Work** - Công việc (màu xanh dương)
- **Family** - Gia đình (màu đỏ)
- **Friends** - Bạn bè (màu xanh lá)
- **Important** - Quan trọng (màu vàng)
- **Promotion** - Khuyến mãi (màu tím)
- **Social** - Mạng xã hội (màu xanh ngọc)

### 🔧 Chức năng khác
- ✅ Tìm kiếm email (theo tiêu đề, người gửi, nội dung)
- ✅ Chọn nhiều email (bulk selection)
- ✅ Thao tác hàng loạt (bulk delete, mark as read)
- ✅ Hiển thị file đính kèm
- ✅ Minimize/Maximize cửa sổ soạn thư
- ✅ Lưu email nháp
- ✅ Responsive scrollbar như Gmail
- ✅ Hover effects và animations

## 🚀 Cài đặt và chạy

### Cài đặt dependencies
```bash
cd new_frontend
npm install
```

### Chạy development server
```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📂 Cấu trúc thư mục

```
new_frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Header với search bar, logo Gmail
│   │   ├── Sidebar.tsx         # Sidebar với folders và labels
│   │   ├── EmailList.tsx       # Danh sách email với bulk actions
│   │   ├── EmailDetail.tsx     # Chi tiết email với HTML rendering
│   │   └── ComposeEmail.tsx    # Soạn email mới với rich editor
│   ├── types.ts                # TypeScript interfaces
│   ├── mockData.ts             # Dữ liệu test (13 emails mẫu)
│   ├── App.tsx                 # Main app component
│   ├── index.css               # Global CSS với Gmail styles
│   └── main.tsx                # React entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 📊 Dữ liệu test

File `mockData.ts` chứa:
- **13 emails mẫu** với nội dung tiếng Việt
  - 10 emails trong Inbox
  - 2 emails trong Sent
  - 1 email Draft
- **6 labels** với màu sắc khác nhau
- **7 folders** với icons và số lượng

## 🎨 Giao diện

### Layout
- **Header**: Search bar, Gmail logo, Settings, User avatar
- **Sidebar**: Compose button, Folders navigation, Labels section
- **EmailList**: Checkbox selection, Star button, Bulk actions toolbar
- **EmailDetail**: Full email view với attachments, reply/forward buttons
- **ComposeEmail**: Modal với To/Cc/Bcc, Subject, Rich text editor

### Styling
- TailwindCSS cho responsive design
- Custom scrollbar giống Gmail
- Hover effects trên email items
- Checkbox và star animations
- Label badges với màu sắc

## 🔌 Tích hợp API (Future)

Có thể tích hợp với:
- **Gmail API** - Đọc/gửi email thật từ Gmail
- **Gemini AI API** - Phân loại email, tạo reply tự động, phân tích cảm xúc

Files test sẵn có trong thư mục `test/`:
- `test-gmail-api.js` - Test Gmail API
- `test-gemini-api.js` - Test Gemini AI

## 📝 Các thao tác chính

### Đọc email
1. Click vào email trong danh sách
2. Email detail hiển thị bên phải
3. Xem nội dung, attachments, thông tin người gửi

### Soạn email mới
1. Click nút "Compose" ở sidebar
2. Nhập To, Cc, Bcc (optional)
3. Nhập Subject
4. Soạn nội dung với rich text editor
5. Click "Send" hoặc "Save Draft"

### Quản lý email
- **Star**: Click vào ⭐ bên cạnh email
- **Delete**: Select email → Click 🗑️ Delete
- **Archive**: Select email → Click 📦 Archive
- **Mark as read**: Select email → Click ✓

### Bulk operations
1. Check nhiều email
2. Toolbar hiển thị số email đã chọn
3. Thực hiện Delete, Archive, Mark as read hàng loạt

## 🛠️ Technologies

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool
- **TailwindCSS** - Styling
- **ReactQuill** - Rich text editor
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📸 Screenshots

Giao diện bao gồm:
- ✅ Gmail-like header với search
- ✅ Sidebar với compose button
- ✅ Email list với checkboxes và stars
- ✅ Email detail panel
- ✅ Compose modal với rich editor
- ✅ Labels và folders navigation

## 🎯 Next Steps

1. ✅ Hoàn thiện giao diện Gmail clone
2. ⏳ Tích hợp Gmail API để đọc email thật
3. ⏳ Tích hợp Gemini AI để phân loại email
4. ⏳ Tự động tạo task từ email
5. ⏳ Gợi ý reply thông minh

---

**Developed for Hackathon 2024** 🚀
