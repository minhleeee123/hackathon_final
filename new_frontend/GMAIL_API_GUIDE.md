# Hướng dẫn sử dụng Gmail Clone với Real Data

## Bước 1: Chạy Backend API Server

Mở terminal thứ nhất và chạy:

```bash
cd new_frontend
npm run api
```

Server sẽ chạy tại: **http://localhost:3002**

Khi chạy lần đầu, server sẽ mở browser để authenticate với Gmail account của bạn.

## Bước 2: Chạy Frontend

Mở terminal thứ hai và chạy:

```bash
cd new_frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3001**

## Bước 3: Toggle Data Source

Trong giao diện, bạn sẽ thấy thanh vàng ở trên với:
- **Mock Data** button (default) - Sử dụng dữ liệu test
- Click vào button để chuyển sang **Gmail API (Real Data)** - Sử dụng email thật từ Gmail

## Chức năng với Real Data:

✅ **Đọc emails** - Tự động load 50 emails mới nhất
✅ **Star/Unstar** - Đánh dấu sao email
✅ **Mark as read/unread** - Đánh dấu đã đọc
✅ **Delete** - Xóa email (move to trash)
✅ **Send email** - Gửi email mới
✅ **Refresh** - Tải lại emails mới nhất

## Lưu ý:

- Backend server phải chạy trước khi bật "Gmail API" mode
- Lần đầu chạy cần authenticate Gmail account
- Token sẽ được lưu vào file `token.json`
- Mỗi lần thao tác sẽ gọi API thật đến Gmail

## Troubleshooting:

Nếu gặp lỗi "Failed to load Gmail emails":
1. Kiểm tra backend server đã chạy chưa (port 3002)
2. Kiểm tra file `credentials.json` và `token.json` có trong thư mục `new_frontend`
3. Thử authenticate lại bằng cách xóa `token.json` và restart server
