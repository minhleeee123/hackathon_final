# 📧 Gmail & Email Automation Templates với AI

Bộ sưu tập 20 workflows tự động hóa email sử dụng n8n và AI (OpenAI, ChatGPT, LangChain).

---

## 📋 Danh sách Templates

### 1️⃣ **A Very Simple Human in the Loop Email Response System Using AI and IMAP**

**Luồng hoạt động:**
1. Lấy email mới qua **IMAP Trigger**
2. Chuyển HTML email sang **Markdown** để AI dễ đọc
3. **LangChain Summarization Chain** tóm tắt nội dung email (max 100 words)
4. **AI Agent** (OpenAI GPT-4o-mini) sinh phản hồi tự động dựa trên:
   - Tóm tắt email
   - System prompt: Chuyên nghiệp, ngắn gọn (<100 words)
5. Gửi draft reply cho **con người phê duyệt** qua email
6. Nếu approve → Tự động gửi email reply

**Công nghệ:**
- IMAP Email Trigger
- LangChain Summarization (DeepSeek/OpenAI)
- OpenAI Agent với custom system prompt
- Human-in-the-loop approval system

**Use case:** Phản hồi email kinh doanh với sự kiểm soát của con người

---

### 2️⃣ **Auto-label incoming Gmail messages with AI nodes**

**Luồng hoạt động:**
1. **Gmail Trigger** nhận email mới mỗi phút
2. **Get message content** lấy body email
3. **LangChain LLM Chain** phân loại email thành 3 categories:
   - **Partnership**: Email về hợp tác, sponsored content
   - **Inquiry**: Email hỏi về sản phẩm/dịch vụ
   - **Notification**: Email không cần trả lời
4. **JSON Parser** parse output thành structured format
5. **Split & Merge labels**: Kết hợp AI labels với Gmail labels hiện có
6. **Aggregate label IDs** tạo mảng label IDs
7. **Add labels to message** gắn labels vào email trong Gmail

**Công nghệ:**
- Gmail API OAuth2
- LangChain LLM Chain với JSON output
- OpenAI GPT-4 Turbo (temperature=0 cho deterministic)
- Custom JSON schema validation

**Use case:** Tự động phân loại email đến theo nội dung

---

### 3️⃣ **Gmail AI Auto-Responder: Create Draft Replies to incoming emails**

**Luồng hoạt động:**
1. **Gmail Trigger** theo dõi email mới (filter: `-from:me`)
2. **Assess if message needs reply**:
   - LangChain LLM đánh giá email có cần trả lời không
   - JSON output: `{"needsReply": true/false}`
   - Marketing emails → `needsReply: false`
3. **If Needs Reply** → Chuyển sang bước tiếp theo
4. **Generate email reply**:
   - AI Agent (OpenAI GPT-4 Turbo) tạo draft reply
   - System prompt chi tiết:
     - Business casual tone
     - Start: "Hello,", End: "Best,"
     - Yes/no questions → 2 versions (affirmative + negative)
     - Placeholders cho unknown info: `[YOUR_ANSWER_HERE]`
     - Plain text only
     - Reply cùng ngôn ngữ với email gốc
5. **Gmail - Create Draft** tạo draft trong Gmail thread

**Công nghệ:**
- Gmail Trigger với filters
- LangChain conditional logic
- OpenAI GPT-4 Turbo
- JSON structured output parser

**Use case:** Tự động tạo draft replies cho inbox, người dùng chỉ cần review và gửi

---

### 4️⃣ **Basic Automatic Gmail Email Labelling with OpenAI and Gmail API**

**Luồng hoạt động:**
1. **Gmail Trigger** mỗi 5 phút
2. **Gmail Tools** (AI Agent sử dụng):
   - Read all Gmail labels
   - Get specific message by ID
   - Add label to message
3. **OpenAI Agent** với tools:
   - Đọc danh sách labels hiện có
   - Lấy nội dung email mới
   - Quyết định label phù hợp
   - Tự động gắn label

**Công nghệ:**
- Gmail OAuth2 API
- OpenAI Function Calling (Tools)
- LangChain Tool integration
- Agent-based automation

**Use case:** AI Agent tự động quản lý Gmail labels

---

### 5️⃣ **Email Summary Agent**

**Luồng hoạt động:**
1. **Schedule Trigger** chạy mỗi ngày 7:00 AM
2. **Get unread emails** từ Gmail/IMAP
3. **For each email**:
   - Extract sender, subject, body
   - AI summarization (key points + action items)
4. **Aggregate summaries** gộp tất cả email
5. **Generate daily digest**:
   - Tóm tắt tổng thể
   - Prioritized action items
   - Urgent vs non-urgent
6. **Send summary email** đến user

**Công nghệ:**
- Schedule Trigger (cron)
- Gmail/IMAP integration
- OpenAI GPT-4 summarization
- Batch processing

**Use case:** Daily email digest, không bỏ lỡ email quan trọng

---

### 6️⃣ **AI-powered email processing autoresponder and response approval (Yes/No)**

**Luồng hoạt động:**
1. Email trigger (IMAP/Gmail)
2. AI classification:
   - Needs reply? (Yes/No)
   - Urgency level (High/Medium/Low)
   - Category (Support/Sales/General)
3. **Auto-response logic**:
   - IF urgent + support → Immediate auto-reply
   - IF sales → Generate personalized response
   - IF low priority → Queue for later
4. **Approval workflow**:
   - Send notification với Yes/No buttons
   - User click Yes → Send email
   - User click No → Discard

**Công nghệ:**
- AI multi-class classification
- Conditional routing
- Interactive approvals
- Email queue management

**Use case:** Customer support automation với human oversight

---

### 7️⃣ **Analyze & Sort Suspicious Email Contents with ChatGPT**

**Luồng hoạt động:**
1. Email trigger
2. **Extract features**:
   - Sender domain
   - Email headers
   - Body content
   - Attachments
   - Links
3. **ChatGPT analysis**:
   - Phishing indicators
   - Spam patterns
   - Malicious links
   - Social engineering attempts
4. **Risk scoring** (0-100)
5. **Actions**:
   - High risk → Move to Spam + Alert admin
   - Medium risk → Flag for review
   - Low risk → Label as safe

**Công nghệ:**
- ChatGPT Vision (analyze screenshots)
- Pattern matching
- Risk scoring algorithms
- Security automation

**Use case:** Email security, phishing detection

---

### 8️⃣ **Analyze Suspicious Email Contents with ChatGPT Vision**

**Luồng hoạt động:**
1. Email với attachments/images
2. **ChatGPT Vision** phân tích:
   - Screenshot emails
   - Attachment thumbnails
   - Logo/branding
3. **Visual phishing detection**:
   - Fake login pages
   - Brand impersonation
   - QR code scams
4. Auto-categorize + alert

**Công nghệ:**
- ChatGPT Vision API
- Image processing
- Visual pattern recognition

**Use case:** Detect sophisticated visual phishing attacks

---

### 9️⃣ **Auto Categorise Outlook Emails with AI**

**Luồng hoạt động:**
1. **Outlook Trigger** (Microsoft 365)
2. AI categorization:
   - Work/Personal
   - Projects
   - Clients
   - Departments
3. Apply Outlook categories + folders
4. Sync với Outlook

**Công nghệ:**
- Microsoft Graph API
- Outlook OAuth
- AI classification

**Use case:** Tổ chức Outlook inbox tự động

---

### 🔟 **Classify lemlist replies using OpenAI and automate reply handling**

**Luồng hoạt động:**
1. **Lemlist webhook** khi có reply
2. **OpenAI classification**:
   - Interested (positive)
   - Not interested (negative)
   - Out of office
   - Request more info
3. **Automation**:
   - Interested → Add to CRM + Schedule call
   - Not interested → Remove from campaign
   - OOO → Reschedule follow-up
   - More info → Send resources

**Công nghệ:**
- Lemlist API
- OpenAI sentiment analysis
- CRM integration

**Use case:** Sales outreach automation

---

### 1️⃣1️⃣ **Compose reply draft in Gmail with OpenAI Assistant**

**Luồng hoạt động:**
1. Gmail trigger
2. **OpenAI Assistant**:
   - Context-aware responses
   - Reference previous conversations
   - Access knowledge base
3. Generate contextual draft reply
4. Save to Gmail drafts

**Công nghệ:**
- OpenAI Assistants API
- Thread management
- Context retention

**Use case:** Smart email replies với long-term memory

---

### 1️⃣2️⃣ **Create e-mail responses with Fastmail and OpenAI**

**Luồng hoạt động:**
1. Fastmail IMAP trigger
2. OpenAI GPT response generation
3. Save draft in Fastmail

**Công nghệ:**
- Fastmail API
- OpenAI integration

**Use case:** Fastmail users automation

---

### 1️⃣3️⃣ **Effortless Email Management with AI-Powered Summarization & Review**

**Luồng hoạt động:**
1. Daily email collection
2. **AI Processing**:
   - Summarize each email (1-2 sentences)
   - Extract action items
   - Prioritize by importance
3. **Smart digest**:
   - Executive summary
   - Top 5 urgent items
   - Nice-to-know section
4. Send morning briefing

**Công nghệ:**
- Multi-stage summarization
- Priority scoring
- Template-based formatting

**Use case:** Executive email management

---

### 1️⃣4️⃣ **Extract spending history from Gmail to Google Sheet**

**Luồng hoạt động:**
1. **Gmail filter**: Emails with receipts/invoices
2. **Extract data**:
   - Merchant name
   - Amount
   - Date
   - Category (food/transport/shopping)
3. **AI categorization**: Spending category
4. **Append to Google Sheets**:
   - Transaction log
   - Monthly summary
   - Charts

**Công nghệ:**
- Gmail filters
- OpenAI data extraction
- Google Sheets API
- Regex + NLP

**Use case:** Personal finance tracking

---

### 1️⃣5️⃣ **Microsoft Outlook AI Email Assistant with contact support from Monday and Airtable**

**Luồng hoạt động:**
1. Outlook email arrives
2. **Check contacts**:
   - Search Monday.com CRM
   - Search Airtable database
3. **Contextual reply**:
   - Include contact history
   - Reference past deals
   - Personalized greeting
4. Draft reply with context

**Công nghệ:**
- Microsoft Graph API
- Monday.com API
- Airtable API
- Multi-source data aggregation

**Use case:** Sales/CRM-powered email responses

---

### 1️⃣6️⃣ **Modular & Customizable AI-Powered Email Routing: Text Classifier for eCommerce**

**Luồng hoạt động:**
1. Email arrives (customer inquiry)
2. **AI Classification**:
   - Product questions → Product team
   - Order issues → Fulfillment
   - Returns → Returns department
   - General → Support
3. **Route to appropriate queue/person**
4. Auto-reply với estimated response time

**Công nghệ:**
- Multi-class text classification
- Routing logic
- Team assignment
- SLA tracking

**Use case:** eCommerce customer support routing

---

### 1️⃣7️⃣ **Send a ChatGPT email reply and save responses to Google Sheets**

**Luồng hoạt động:**
1. Email trigger
2. ChatGPT generates reply
3. Send email
4. **Log to Google Sheets**:
   - Original email
   - AI response
   - Timestamp
   - Sender
5. Analytics dashboard

**Công nghệ:**
- ChatGPT API
- Google Sheets logging
- Response tracking

**Use case:** AI response monitoring & analytics

---

### 1️⃣8️⃣ **Send specific PDF attachments from Gmail to Google Drive using OpenAI**

**Luồng hoạt động:**
1. Gmail với PDF attachments
2. **OpenAI PDF analysis**:
   - Extract document type (invoice/contract/receipt)
   - Extract metadata (date, parties, amount)
3. **Smart filing**:
   - Invoices → `/Drive/Finance/Invoices/2025/`
   - Contracts → `/Drive/Legal/Contracts/`
   - Auto-rename: `Invoice_CompanyName_2025-01-15.pdf`
4. Update Google Sheet index

**Công nghệ:**
- Gmail attachment handling
- OpenAI document analysis
- Google Drive API
- File organization

**Use case:** Automatic document management

---

### 1️⃣9️⃣ **Summarize your emails with A.I. (via Openrouter) and send to Line messenger**

**Luồng hoạt động:**
1. Fetch unread emails
2. **Openrouter AI** summarization (multi-model support)
3. Format summary
4. **Send to Line messenger**:
   - Push notification
   - Interactive buttons (Mark read/Reply/Snooze)

**Công nghệ:**
- Openrouter (access multiple LLMs)
- Line Messaging API
- Mobile notifications

**Use case:** Mobile-first email management

---

### 2️⃣0️⃣ **📈 Receive Daily Market News from FT.com to your Microsoft Outlook inbox**

**Luồng hoạt động:**
1. **Schedule trigger** 8:00 AM daily
2. **Scrape FT.com**:
   - Latest market news
   - Stock movements
   - Economic indicators
3. **AI curation**:
   - Summarize articles
   - Extract key insights
   - Highlight relevant topics
4. **Email digest** to Outlook:
   - Formatted newsletter
   - Links to full articles
   - Custom sections

**Công nghệ:**
- Web scraping
- AI summarization
- Email templating
- Microsoft Outlook API

**Use case:** Daily news briefing automation

---

## 🎯 Tổng hợp Use Cases

| Use Case | Templates |
|----------|-----------|
| **Email Classification/Labeling** | #2, #4, #9, #16 |
| **Auto-Reply/Draft Generation** | #1, #3, #6, #11, #12 |
| **Email Summarization** | #5, #13, #19 |
| **Security/Spam Detection** | #7, #8 |
| **Document Management** | #18 |
| **Finance Tracking** | #14 |
| **Sales/CRM Integration** | #10, #15 |
| **News Aggregation** | #20 |

---

## 🛠️ Công nghệ chung

### AI Models
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-4o-mini
- **LangChain**: Summarization Chain, LLM Chain, Agents
- **ChatGPT Vision**: Visual analysis
- **DeepSeek**: Alternative LLM
- **Openrouter**: Multi-model access

### Email Services
- **Gmail**: OAuth2, API, Triggers, Tools
- **Microsoft Outlook**: Graph API, OAuth
- **IMAP/SMTP**: Universal email protocols
- **Fastmail**: IMAP integration

### Integrations
- **Google Sheets**: Logging, analytics
- **Google Drive**: File storage
- **Monday.com**: CRM
- **Airtable**: Database
- **Lemlist**: Sales outreach
- **Line Messenger**: Mobile notifications

### n8n Features
- **Triggers**: Schedule, Webhook, Email
- **Nodes**: Gmail, OpenAI, LangChain
- **Tools**: Function calling, structured output
- **Conditional Logic**: IF, Switch, Merge
- **Human-in-the-loop**: Approval workflows

---

## 📚 Học từ Templates

### Pattern 1: Email → AI → Action
```
Trigger → Get Email → AI Processing → Conditional Logic → Execute Action
```

### Pattern 2: Human-in-the-loop
```
AI Draft → Send for Approval → Wait for Response → Execute if Approved
```

### Pattern 3: Multi-stage AI
```
Email → Classify → Summarize → Generate Response → Review → Send
```

### Pattern 4: Data Extraction & Storage
```
Email → Extract Data → Validate → Store (Sheets/Drive/CRM)
```

---

## 💡 Best Practices

1. **Always use temperature=0** cho classification tasks (deterministic)
2. **JSON Schema validation** để đảm bảo structured output
3. **Human approval** cho sensitive actions (send emails, delete, etc.)
4. **Logging** tất cả AI responses để audit
5. **Rate limiting** để tránh API quotas
6. **Error handling** cho failed API calls
7. **Filters** để tránh xử lý spam/marketing emails

---

## 🚀 Getting Started

1. Import JSON file vào n8n
2. Configure credentials (Gmail/OpenAI/etc.)
3. Update system prompts theo use case
4. Test với sample emails
5. Enable workflow và monitor

---

**Source**: [enescingoz/awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates)
