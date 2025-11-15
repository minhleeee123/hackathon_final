# 🤖 Hệ Thống Quản Lý Email Thông Minh - Dự Án Hackathon

<div align="center">
  <h3>Xử Lý Email Thông Minh & Quản Lý Công Việc với Hệ Thống AI Đa Agent</h3>
  <p>Được hỗ trợ bởi Spoon OS Core Framework & Công Nghệ Web Hiện Đại</p>
</div>

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Tính Năng Chính](#-tính-năng-chính)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Hệ Thống AI Agent](#-hệ-thống-ai-agent)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [Luồng Hoạt Động](#-luồng-hoạt-động)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cấu Hình](#-cấu-hình)

---

## 🎯 Tổng Quan

Một hệ thống quản lý email thông minh sử dụng nhiều AI agent để tự động phân loại email, trích xuất công việc, tạo email trả lời, phân tích hợp đồng và quản lý tài chính - tất cả được tích hợp với Gmail API và hỗ trợ ví NEO blockchain.

### Điểm Nổi Bật

- **🤖 Hệ Thống AI Đa Agent**: 5 AI agent chuyên biệt làm việc cùng nhau
- **📧 Tích Hợp Gmail**: Xử lý email thời gian thực với Gmail API
- **✅ Quản Lý Công Việc Thông Minh**: Tự động trích xuất task bằng AI
- **💰 Theo Dõi Tài Chính**: Phát hiện thanh toán và tích hợp ví NEO
- **📄 Phân Tích Hợp Đồng**: Đánh giá rủi ro hợp đồng bằng AI
- **🌓 Giao Diện Hiện Đại**: Dark/Light theme với thiết kế responsive

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Giao diện│  │  Quản lý │  │  Quản lý │  │  Phân tích│       │
│  │  Email   │  │   Task   │  │ Tài chính│  │ Hợp đồng │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tầng API Gateway                              │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  Gmail API Server    │      │  Python Backend      │        │
│  │  (Node.js/Express)   │      │  (FastAPI)           │        │
│  └──────────┬───────────┘      └──────────┬───────────┘        │
└─────────────┼──────────────────────────────┼────────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Hệ Thống AI Agent                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Spoon OS Core Framework                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐  │    │
│  │  │ Agent 1: │  │ Agent 2: │  │ Agent 3: │  │ Ag.4 │  │    │
│  │  │Phân loại │  │Trích xuất│  │  Tạo trả │  │Tài   │  │    │
│  │  │  Email   │  │   Task   │  │   lời    │  │chính │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────┘  │    │
│  │  ┌─────────────────────────────────────────────┐     │    │
│  │  │      LLM Manager (Giao diện thống nhất)     │     │    │
│  │  │  OpenAI | Claude | Gemini | DeepSeek        │     │    │
│  │  └─────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dịch Vụ Bên Ngoài                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Gmail API    │  │ Ví NEO       │  │ Nhà cung cấp │         │
│  │              │  │              │  │     LLM      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Tính Năng Chính

### 1. 📧 **Quản Lý Email Thông Minh**

- **Tự Động Phân Loại**: AI phân loại email thành Công việc, Gia đình, Bạn bè, Tài chính, Spam
- **Đồng Bộ Thời Gian Thực**: Tích hợp Gmail API với đầy đủ thao tác CRUD
- **Gắn Thẻ Thông Minh**: Tự động gán nhãn dựa trên nội dung
- **Thao Tác Hàng Loạt**: Xử lý nhiều email cùng lúc
- **Tìm Kiếm & Lọc**: Lọc email nâng cao theo nhãn, thư mục và từ khóa

### 2. ✅ **Quản Lý Công Việc Thông Minh**

- **Trích Xuất Task Bằng AI**: Tự động phát hiện và trích xuất công việc từ email
- **Dữ Liệu Task Có Cấu Trúc**:
  - Tiêu đề, mô tả, deadline
  - Địa điểm, người liên quan
  - Danh sách hành động và checklist
- **Theo Dõi Trạng Thái**: To-do → In-process → Completed
- **Liên Kết Email**: Liên kết trực tiếp về email nguồn
- **Tạo Thủ Công**: Thêm task tùy chỉnh ngoài ngữ cảnh email

### 3. 💰 **Quản Lý Tài Chính**

- **Phát Hiện Thanh Toán**: AI trích xuất thông tin thanh toán từ hóa đơn
- **Tích Hợp Ví NEO**:
  - Kết nối ví NeoLine
  - Xem số dư NEO/GAS
  - Khả năng ký giao dịch
- **Theo Dõi Thanh Toán**:
  - Số tiền, đơn vị tiền tệ, hạn thanh toán
  - Thông tin người nhận
  - Trạng thái thanh toán (đã trả/chưa trả)
- **Hỗ Trợ Thanh Toán Crypto**: Thanh toán hóa đơn trực tiếp bằng NEO blockchain

### 4. 📄 **Phân Tích Hợp Đồng** (Chế độ Doanh nghiệp)

- **Phân Tích Bằng AI**:
  - Đánh giá mức độ rủi ro (Cao/Trung bình/Thấp)
  - Xác định rủi ro nghiêm trọng
  - Trích xuất điều khoản có lợi
- **Metadata Hợp Đồng**:
  - Khách hàng, giá trị, loại (MSA, NDA, SLA, v.v.)
  - Thời hạn, deadline, trạng thái
- **Dashboard Trực Quan**: Điểm rủi ro và khuyến nghị

### 5. 🎨 **Trải Nghiệm Người Dùng Hiện Đại**

- **Giao Diện Kép**: Chế độ Dark/Light với chuyển đổi mượt mà
- **Thiết Kế Responsive**: Hoạt động trên desktop và mobile
- **Cập Nhật Thời Gian Thực**: Đồng bộ trực tiếp với Gmail
- **Chỉ Báo Tiến Trình**: Phản hồi trực quan cho các thao tác AI
- **Chế Độ Tài Khoản**: Chế độ cá nhân vs doanh nghiệp

---

## 🛠️ Công Nghệ Sử Dụng

### **Frontend**

```
React 18.3         - Framework UI
TypeScript         - Đảm bảo kiểu dữ liệu
Vite              - Công cụ build
Tailwind CSS      - Styling
Radix UI          - Thư viện component
Lucide React      - Icons
React Quill       - Trình soạn thảo văn bản
```

### **Backend**

```
Node.js           - Gmail API Server
Express           - HTTP Server
Python 3.11+      - AI Agent Backend
FastAPI           - REST API Framework
Spoon OS Core     - AI Agent Framework
```

### **AI & LLM**

```
OpenAI GPT-4      - LLM chính
Claude Sonnet     - LLM dự phòng
Gemini 2.0        - LLM thay thế
DeepSeek          - Lựa chọn tiết kiệm chi phí
```

### **API Bên Ngoài**

```
Gmail API         - Thao tác email
NeoLine SDK       - Ví NEO blockchain
Google OAuth 2.0  - Xác thực
```

---

## 🤖 Hệ Thống AI Agent

Hệ thống sử dụng **5 AI agent chuyên biệt**, mỗi agent có vai trò cụ thể:

### **Agent 1: Phân Loại Email** 🏷️

**Mục đích**: Phân loại email đến vào các danh mục đã định sẵn

**Đầu vào**: Email (tiêu đề, nội dung, người gửi)

**Đầu ra**:
```json
{
  "category": "Work | Family | Friends | Finance | Spam",
  "gmailLabel": "Công việc | Người thân & Gia đình | ...",
  "hasTask": true/false,
  "needsTaskLabel": true/false
}
```

**Chiến Lược LLM**:
- **Model**: OpenAI GPT-4.1 / Claude Sonnet-4
- **Temperature**: 0.3 (phân loại xác định)
- **Prompt Engineering**: Few-shot learning với ví dụ
- **Ngữ cảnh**: Uy tín người gửi, từ khóa chủ đề, cảm xúc nội dung

### **Agent 2: Trích Xuất Task** 📝

**Mục đích**: Trích xuất các công việc cần thực hiện từ nội dung email

**Đầu vào**: Email có chứa chỉ dẫn công việc

**Đầu ra**:
```json
{
  "hasTask": true,
  "tasks": [
    {
      "title": "Tên công việc",
      "description": "Mô tả chi tiết",
      "deadline": "2025-11-20T09:00:00",
      "location": "Phòng họp",
      "relatedPeople": ["John", "Mary"],
      "items": ["Item 1", "Item 2"]
    }
  ]
}
```

**Chiến Lược LLM**:
- **Model**: OpenAI GPT-4.1
- **Temperature**: 0.2 (trích xuất chính xác)
- **Kỹ Thuật NLP**: Named Entity Recognition (NER), phân tích ngày tháng
- **Xác Thực**: Kiểm tra các trường bắt buộc (tiêu đề, mô tả)

### **Agent 3: Tạo Email Trả Lời** ✉️

**Mục đích**: Tạo email trả lời phù hợp ngữ cảnh

**Đầu vào**: Email gốc + phong cách trả lời ưa thích

**Đầu ra**: Email trả lời định dạng HTML

**Phong Cách Trả Lời**:
- **Chuyên Nghiệp**: Giao tiếp công việc trang trọng
- **Thân Thiện**: Ấm áp nhưng lịch sự
- **Thoải Mái**: Thư giãn cho bạn bè
- **Trang Trọng**: Rất lịch sự cho các mối quan hệ quan trọng

**Chiến Lược LLM**:
- **Model**: OpenAI GPT-4.1 / Claude Sonnet-4
- **Temperature**: 0.7 (sáng tạo nhưng mạch lạc)
- **Nhận Thức Ngữ Cảnh**: Chuỗi email gốc, mối quan hệ với người gửi
- **Điều Chỉnh Giọng Điệu**: Thích ứng dựa trên phong cách đã chọn

### **Agent 4: Trích Xuất Thanh Toán** 💳

**Mục đích**: Trích xuất thông tin thanh toán/hóa đơn từ email

**Đầu vào**: Email chứa hóa đơn, biên lai, thông báo thanh toán

**Đầu ra**:
```json
{
  "title": "Tên hóa đơn",
  "amount": 1250000,
  "currency": "VND",
  "dueDate": "2025-11-25",
  "recipient": "Vietcombank",
  "recipientAddress": "địa_chỉ_ví_neo",
  "description": "Hóa đơn thẻ tín dụng"
}
```

**Chiến Lược LLM**:
- **Model**: OpenAI GPT-4.1
- **Temperature**: 0.1 (độ chính xác cao cho số liệu)
- **Trích Xuất Dữ Liệu**: Regex + xác thực LLM
- **Phát Hiện Tiền Tệ**: Hỗ trợ đa tiền tệ

### **Agent 5: Phân Tích Hợp Đồng** 📄

**Mục đích**: Phân tích hợp đồng kinh doanh về rủi ro và cơ hội

**Đầu vào**: Tài liệu hợp đồng (PDF/file đính kèm email)

**Đầu ra**:
```json
{
  "overallScore": 7.5,
  "riskLevel": "Medium",
  "criticalRisks": [
    {
      "title": "Điều khoản phạt",
      "description": "Mức phạt cao cho giao hàng muộn",
      "recommendation": "Đàm phán giảm mức phạt"
    }
  ],
  "moderateRisks": ["Điều khoản thanh toán chưa rõ"],
  "favorableTerms": ["Lịch trình linh hoạt"]
}
```

**Chiến Lược LLM**:
- **Model**: Claude Sonnet-4 (tốt hơn cho văn bản pháp lý)
- **Temperature**: 0.4 (phân tích cân bằng)
- **Kiến Thức Chuyên Ngành**: Thuật ngữ pháp lý, mẫu hợp đồng
- **Chấm Điểm Rủi Ro**: Thuật toán trọng số dựa trên mức độ nghiêm trọng của điều khoản

---

## 📥 Hướng Dẫn Cài Đặt

### **Yêu Cầu Trước Khi Cài**

- **Node.js** 18+ và npm
- **Python** 3.11+
- **Git**
- **Tài Khoản Gmail** có quyền truy cập API
- **Ví NeoLine** extension (cho tính năng crypto)

### **1. Clone Repository**

```bash
git clone https://github.com/your-repo/hackathon_final.git
cd hackathon_final
```

### **2. Cài Đặt Frontend**

```bash
cd new_frontend

# Cài đặt dependencies
npm install

# Tạo credentials
# 1. Truy cập Google Cloud Console
# 2. Tạo OAuth 2.0 credentials
# 3. Tải về dưới tên credentials.json
# 4. Đặt vào thư mục new_frontend/
```

### **3. Cài Đặt Python Backend**

```bash
cd ../spoon-core

# Tạo môi trường ảo
python -m venv spoon-env
source spoon-env/bin/activate  # Trên Windows: spoon-env\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### **4. Cấu Hình Biến Môi Trường**

Tạo file `.env` trong `spoon-core/`:

```bash
# API Keys của LLM
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-claude-key
GEMINI_API_KEY=your-gemini-key
DEEPSEEK_API_KEY=your-deepseek-key

# Email Backend
BACKEND_URL=http://localhost:8000

# Ví NEO (tùy chọn)
NEO_NETWORK=TestNet
```

---

## 🚀 Chạy Ứng Dụng

### **Khởi Động Tất Cả Dịch Vụ** (Cần 3 terminal)

#### **Terminal 1: Gmail API Server**

```bash
cd new_frontend
node gmail-api-server.cjs
```

Chạy trên `http://localhost:3002`

#### **Terminal 2: Python AI Backend**

```bash
cd spoon-core
source spoon-env/bin/activate
python email_backend/app.py
```

Chạy trên `http://localhost:8000`

#### **Terminal 3: Frontend Dev Server**

```bash
cd new_frontend
npm run dev
```

Chạy trên `http://localhost:5173`

### **Xác Thực Gmail Lần Đầu**

1. Mở `http://localhost:5173`
2. Bật "Use Real Data" ở header
3. Trình duyệt sẽ mở để xác thực Gmail OAuth
4. Cấp quyền
5. Token được lưu vào `token.json`

### **Truy Cập Ứng Dụng**

Mở trình duyệt: `http://localhost:5173`

**Giao diện mặc định**: Chế độ cá nhân với dữ liệu mock
**Chuyển sang dữ liệu thật**: Bật toggle switch ở header
**Chế độ doanh nghiệp**: Click nút chuyển đổi tài khoản

---

## 🔄 Luồng Hoạt Động

### **Luồng Phân Loại Email**

```
1. Người dùng chọn email → click "Phân loại"
2. Frontend → Gmail API Server → Lấy dữ liệu email
3. Frontend → Python Backend → Phân loại bằng AI
4. Agent 1 phân tích nội dung email
5. LLM trả về danh mục + chỉ báo task
6. Backend → Frontend với kết quả
7. Frontend → Gmail API → Gắn nhãn
8. UI cập nhật với nhãn mới
```

### **Luồng Trích Xuất Task**

```
1. Người dùng chọn email → click "Trích xuất Task"
2. Frontend gửi email đến Python Backend
3. Agent 2 xử lý từng email:
   - Kiểm tra có chứa task không
   - Trích xuất dữ liệu task có cấu trúc
   - Phân tích ngày, người, địa điểm
4. Tasks được lưu vào state frontend
5. Chuyển sang tab Tasks → xem tasks đã trích xuất
6. Liên kết về email nguồn
```

### **Luồng Trích Xuất Thanh Toán**

```
1. Người dùng chọn email hóa đơn → click "Trích xuất Payment"
2. Agent 4 phân tích email để tìm:
   - Số tiền và đơn vị tiền tệ
   - Hạn thanh toán
   - Thông tin người nhận
3. Payments được lưu vào tab Finance
4. Tùy chọn: Kết nối ví NEO để thanh toán crypto
5. Thanh toán trực tiếp từ app (tính năng tương lai)
```

---

## 📁 Cấu Trúc Dự Án

```
hackathon_final/
│
├── new_frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── Header.tsx           # Thanh điều hướng
│   │   │   ├── Sidebar.tsx          # Thư mục email
│   │   │   ├── EmailList.tsx        # Danh sách email
│   │   │   ├── EmailDetail.tsx      # Chi tiết email
│   │   │   ├── TaskManagementPage.tsx
│   │   │   ├── FinanceManagementPage.tsx
│   │   │   ├── ContractAnalyzer.tsx
│   │   │   └── ...
│   │   │
│   │   ├── services/                # Dịch vụ API
│   │   │   ├── gmailService.ts      # Gọi Gmail API
│   │   │   ├── backendService.ts    # Gọi Python backend
│   │   │   ├── walletService.ts     # Tích hợp ví NEO
│   │   │   └── unifiedAIService.ts  # Wrapper dịch vụ AI
│   │   │
│   │   ├── App.tsx                  # Component app chính
│   │   ├── types.ts                 # Kiểu TypeScript
│   │   ├── mockData.ts              # Dữ liệu mock để test
│   │   └── main.tsx                 # Entry point
│   │
│   ├── gmail-api-server.cjs         # Node.js Gmail API server
│   ├── credentials.json             # Gmail OAuth credentials
│   ├── token.json                   # Gmail OAuth token (tự động tạo)
│   ├── package.json
│   └── vite.config.ts
│
├── spoon-core/                      # Python AI Backend
│   ├── email_backend/
│   │   ├── app.py                   # FastAPI server
│   │   └── README.md
│   │
│   ├── spoon_ai/                    # Spoon OS Framework
│   │   ├── agents/                  # AI Agents
│   │   ├── llm/                     # LLM Manager
│   │   │   ├── manager.py           # Giao diện LLM thống nhất
│   │   │   ├── providers/           # Triển khai LLM provider
│   │   │   └── ...
│   │   ├── tools/                   # Công cụ tích hợp sẵn
│   │   ├── graph/                   # Hệ thống workflow graph
│   │   └── ...
│   │
│   ├── examples/                    # Ví dụ agent
│   ├── doc/                         # Tài liệu
│   ├── requirements.txt
│   └── .env                         # Cấu hình môi trường
│
├── test/                            # File test cũ (có thể xóa)
├── README.md                        # File này (English)
└── README_VN.md                     # File này (Tiếng Việt)
```

---

## ⚙️ Cấu Hình

### **Cấu Hình Frontend**

Sửa `new_frontend/src/services/gmailService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3002/api';
```

Sửa `new_frontend/src/services/backendService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

### **Cấu Hình Backend**

Sửa `spoon-core/email_backend/app.py`:

```python
# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Chọn LLM Provider**

Sửa `spoon-core/.env`:

```bash
# LLM chính (sử dụng cho hầu hết thao tác)
DEFAULT_LLM_PROVIDER=openai

# Chuỗi dự phòng
LLM_FALLBACK_CHAIN=openai,anthropic,gemini
```

### **Phạm Vi Gmail API**

Trong `new_frontend/gmail-api-server.cjs`:

```javascript
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send'
];
```

---

## 🎯 Ví Dụ Sử Dụng

### **Ví Dụ 1: Phân Loại Email**

1. Mở app → Bật "Use Real Data"
2. Chọn nhiều email (checkbox)
3. Click nút "Phân loại" ở thanh công cụ
4. AI xử lý email (thanh tiến trình hiển thị)
5. Nhãn được tự động gắn
6. Xem email theo nhãn ở sidebar

### **Ví Dụ 2: Trích Xuất Tasks**

1. Chọn email chứa công việc
2. Click nút "Trích xuất Task"
3. Đợi AI xử lý
4. Chuyển sang tab "Tasks"
5. Xem tasks đã trích xuất với chi tiết
6. Click task để xem email nguồn

### **Ví Dụ 3: Tạo Email Trả Lời**

1. Mở một email
2. Click nút "Trả lời"
3. Chọn phong cách trả lời (Chuyên nghiệp/Thân thiện/Thoải mái)
4. AI tạo email trả lời phù hợp ngữ cảnh
5. Chỉnh sửa nếu cần
6. Gửi trực tiếp từ app

### **Ví Dụ 4: Thanh Toán Bằng NEO**

1. Trích xuất thanh toán từ email hóa đơn
2. Đi đến tab "Finance"
3. Click "Kết nối Ví"
4. Phê duyệt kết nối NeoLine
5. Xem số dư NEO/GAS
6. Click "Thanh toán" trên payment chưa trả
7. Ký giao dịch trong NeoLine

---

## 🔐 Lưu Ý Bảo Mật

- **Gmail OAuth**: Sử dụng luồng Google OAuth 2.0 chính thức
- **API Keys**: Lưu trong `.env`, không commit lên git
- **Lưu Token**: Gmail tokens được lưu cục bộ trong `token.json`
- **Ví NEO**: Private keys không bao giờ rời khỏi extension trình duyệt
- **Backend API**: CORS được cấu hình chỉ cho localhost

---

## 🐛 Khắc Phục Sự Cố

### **Gmail API Lỗi 401**

```bash
# Xóa token và xác thực lại
rm new_frontend/token.json
# Khởi động lại Gmail API server
```

### **Python Backend Import Error**

```bash
# Kích hoạt môi trường ảo
cd spoon-core
source spoon-env/bin/activate
pip install -r requirements.txt
```

### **LLM API Rate Limit**

```bash
# Chuyển sang provider thay thế trong .env
DEFAULT_LLM_PROVIDER=anthropic  # hoặc gemini, deepseek
```

### **Không Phát Hiện NeoLine**

1. Cài đặt NeoLine extension từ Chrome Web Store
2. Làm mới trang trình duyệt
3. Click "Kết nối Ví" lại

---

## 📊 Chỉ Số Hiệu Suất

- **Phân loại Email**: ~2-3 giây mỗi email
- **Trích xuất Task**: ~3-5 giây mỗi email
- **Tạo Trả lời**: ~4-6 giây
- **Phân tích Hợp đồng**: ~8-10 giây mỗi tài liệu
- **Thao tác Hàng loạt**: Xử lý song song (tối đa 5 đồng thời)

---

## 🚀 Cải Tiến Tương Lai

- [ ] Hỗ trợ file đính kèm email (PDF, DOCX)
- [ ] Hỗ trợ email đa ngôn ngữ
- [ ] Tích hợp lịch cho deadline của task
- [ ] Template và snippet email
- [ ] Dashboard phân tích nâng cao
- [ ] Ứng dụng di động (React Native)
- [ ] Tích hợp Slack/Teams
- [ ] Hỗ trợ lệnh giọng nói
- [ ] Tích hợp chữ ký điện tử hợp đồng

---

## 👥 Đóng Góp

Phát triển cho AI Hackathon 2025

---

## 📄 Giấy Phép

Dự án này được phát triển cho mục đích hackathon.

---

## 🙏 Cảm Ơn

- **Spoon OS**: Framework AI agent
- **Gmail API**: Tích hợp email
- **NEO Blockchain**: Hỗ trợ thanh toán crypto
- **OpenAI, Anthropic, Google**: Nhà cung cấp LLM

---

<div align="center">
  <p>Được tạo với ❤️ cho AI Hackathon 2025</p>
  <p>⭐ Star repo này nếu bạn thấy hữu ích!</p>
</div>
