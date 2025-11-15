<div align="center">
  
  #  AI Email Management System
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
    <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  </p>

  <h3> Intelligent Email Processing & Task Management with Multi-Agent AI System</h3>
  
  <p>
    <strong>Powered by Spoon OS Core Framework & Modern Web Technologies</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI"/>
    <img src="https://img.shields.io/badge/Claude-Sonnet--4-8B5CF6?style=flat-square" alt="Claude"/>
    <img src="https://img.shields.io/badge/Gemini-2.0-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini"/>
    <img src="https://img.shields.io/badge/NEO-Blockchain-00E599?style=flat-square" alt="NEO"/>
  </p>

  <p align="center">
    <a href="#-installation-guide">Installation</a> •
    <a href="#-running-the-application">Quick Start</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-ai-agent-system">AI Agents</a> •
    <a href="#-core-features">Features</a>
  </p>

  <br/>

  <table>
    <tr>
      <td align="center" width="200px">
        <b> Email Management</b><br/>
        <sub>Auto-classify & organize</sub>
      </td>
      <td align="center" width="200px">
        <b> Task Extraction</b><br/>
        <sub>AI-powered task detection</sub>
      </td>
      <td align="center" width="200px">
        <b> Finance Tracking</b><br/>
        <sub>Payment & crypto wallet</sub>
      </td>
      <td align="center" width="200px">
        <b> Contract Analysis</b><br/>
        <sub>Risk assessment & insights</sub>
      </td>
    </tr>
  </table>

  <br/>

  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Hackathon-2025-orange?style=for-the-badge" alt="Hackathon"/>

</div>

<br/>

---


#  AI Email Management System - Hackathon Project

<div align="center">
  <h3>Intelligent Email Processing & Task Management with Multi-Agent AI System</h3>
  <p>Powered by Spoon OS Core Framework & Modern Web Technologies</p>
</div>

---

##  Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [AI Agent System](#-ai-agent-system)
- [Installation Guide](#-installation-guide)
- [Running the Application](#-running-the-application)
- [System Workflow](#-system-workflow)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)

---

##  Overview

An intelligent email management system that leverages multiple AI agents to automatically classify emails, extract tasks, generate replies, analyze contracts, and manage finances - all integrated with Gmail API and NEO blockchain wallet support.

### Key Highlights

- **Multi-Agent AI System**: 5 specialized AI agents working together
- **Gmail Integration**: Real-time email processing with Gmail API
- **Smart Task Management**: Automatic task extraction with AI
- **Finance Tracking**: Payment detection and NEO wallet integration
- **Contract Analysis**: AI-powered contract risk assessment
- **Modern UI**: Dark/Light theme with responsive design

---

## 📥 Installation Guide

### **Prerequisites**

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**
- **Gmail Account** with API access
- **NeoLine Wallet** extension (for crypto features)

### **1. Clone Repository**

```bash
git clone https://github.com/your-repo/hackathon_final.git
cd hackathon_final
```

### **2. Setup Frontend**

```bash
cd new_frontend

# Install dependencies
npm install

# Create credentials
# 1. Go to Google Cloud Console
# 2. Create OAuth 2.0 credentials
# 3. Download as credentials.json
# 4. Place in new_frontend/ folder
```

### **3. Setup Python Backend**

```bash
cd ../spoon-core

# Create virtual environment
python -m venv spoon-env
source spoon-env/bin/activate  # On Windows: spoon-env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **4. Configure Environment Variables**

Create `.env` file in `spoon-core/`:

```bash
# LLM API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-claude-key
GEMINI_API_KEY=your-gemini-key
DEEPSEEK_API_KEY=your-deepseek-key

# Email Backend
BACKEND_URL=http://localhost:8000

# NEO Wallet (optional)
NEO_NETWORK=TestNet
```

---

##  Running the Application

### **Start All Services** (3 terminals required)

#### **Terminal 1: Gmail API Server**

```bash
cd new_frontend
node gmail-api-server.cjs
```

This starts on `http://localhost:3002`

#### **Terminal 2: Python AI Backend**

```bash
cd spoon-core
source spoon-env/bin/activate
python email_backend/app.py
```

This starts on `http://localhost:8000`

#### **Terminal 3: Frontend Dev Server**

```bash
cd new_frontend
npm run dev
```

This starts on `http://localhost:`(port in terminal)

### **First-Time Gmail Authentication**

1. Open `http://localhost`
2. Toggle "Use Real Data" in header(click touge mock)
3. Browser will open for Gmail OAuth
4. Grant permissions
5. Token saved to `token.json`

### **Access the Application**

Open browser: `http://localhost:5173`

**Default view**: Personal mode with mock data
**Switch to real data**: Toggle switch in header
**Business mode**: Click account toggle button

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Email   │  │   Task   │  │ Finance  │  │Contract  │       │
│  │   UI     │  │  Manager │  │ Manager  │  │ Analyzer │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                             │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  Gmail API Server    │      │  Python Backend      │        │
│  │  (Node.js/Express)   │      │  (FastAPI)           │        │
│  └──────────┬───────────┘      └──────────┬───────────┘        │
└─────────────┼──────────────────────────────┼────────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI Agent System                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Spoon OS Core Framework                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐  │    │
│  │  │ Agent 1: │  │ Agent 2: │  │ Agent 3: │  │ Ag.4 │  │    │
│  │  │Classifier│  │Task Extr.│  │ Reply    │  │Financ│  │    │
│  │  └──────────┘  └──────────┘  │Generator │  └──────┘  │    │
│  │                               └──────────┘            │    │
│  │  ┌─────────────────────────────────────────────┐     │    │
│  │  │         LLM Manager (Unified Interface)      │     │    │
│  │  │  OpenAI | Claude | Gemini | DeepSeek        │     │    │
│  │  └─────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Gmail API    │  │ NEO Wallet   │  │ LLM Providers│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

##  Core Features

### 1. 📧 **Intelligent Email Management**

- **Auto-Classification**: AI categorizes emails into Work, Family, Friends, Finance, Spam
- **Real-time Sync**: Gmail API integration with full CRUD operations
- **Smart Labels**: Automatic label assignment based on content
- **Bulk Operations**: Process multiple emails simultaneously
- **Search & Filter**: Advanced email filtering by labels, folders, and keywords

### 2.  **Smart Task Management**

- **AI Task Extraction**: Automatically detect and extract tasks from emails
- **Structured Task Data**:
  - Title, description, deadline
  - Location, related people
  - Action items and checklists
- **Status Tracking**: To-do → In-process → Completed
- **Email Linking**: Direct link back to source email
- **Manual Creation**: Add custom tasks outside of email context

### 3.  **Finance Management**

- **Payment Detection**: AI extracts payment information from bills/invoices
- **NEO Wallet Integration**:
  - Connect NeoLine wallet
  - View NEO/GAS balance
  - Transaction signing capability
- **Payment Tracking**:
  - Amount, currency, due date
  - Recipient information
  - Payment status (paid/unpaid)
- **Crypto Payment Support**: Pay bills directly with NEO blockchain

### 4.  **Contract Analyzer** (Business Mode)

- **AI-Powered Analysis**:
  - Risk level assessment (High/Medium/Low)
  - Critical risk identification
  - Favorable terms extraction
- **Contract Metadata**:
  - Client, value, type (MSA, NDA, SLA, etc.)
  - Duration, deadline, status
- **Visual Dashboard**: Risk scores and recommendations

### 5.  **Modern User Experience**

- **Dual Theme**: Dark/Light mode with smooth transitions
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live sync with Gmail
- **Progress Indicators**: Visual feedback for AI operations
- **Account Modes**: Personal vs Business views

---

##  Technology Stack

### **Frontend**

```
React 18.3         - UI Framework
TypeScript         - Type Safety
Vite              - Build Tool
Tailwind CSS      - Styling
Radix UI          - Component Library
Lucide React      - Icons
React Quill       - Rich Text Editor
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
OpenAI GPT-4      - Primary LLM
Claude Sonnet     - Backup LLM
Gemini 2.0        - Alternative LLM
DeepSeek          - Cost-effective option
```

### **External APIs**

```
Gmail API         - Email operations
NeoLine SDK       - NEO blockchain wallet
Google OAuth 2.0  - Authentication
```

---

##  AI Agent System

The system employs **5 specialized AI agents**, each with a specific role:

### **Agent 1: Email Classifier** 

**Purpose**: Categorize incoming emails into predefined categories

**Input**: Email (subject, body, sender)

**Output**:
```json
{
  "category": "Work | Family | Friends | Finance | Spam",
  "gmailLabel": "Công việc | Người thân & Gia đình | ...",
  "hasTask": true/false,
  "needsTaskLabel": true/false
}
```

**LLM Strategy**:
- **Model**: OpenAI GPT-4.1 / Claude Sonnet-4
- **Temperature**: 0.3 (deterministic classification)
- **Prompt Engineering**: Few-shot learning with examples
- **Context**: Sender reputation, subject keywords, body sentiment

### **Agent 2: Task Extractor** 

**Purpose**: Extract actionable tasks from email content

**Input**: Email with task indicators

**Output**:
```json
{
  "hasTask": true,
  "tasks": [
    {
      "title": "Task name",
      "description": "Detailed description",
      "deadline": "2025-11-20T09:00:00",
      "location": "Meeting room",
      "relatedPeople": ["John", "Mary"],
      "items": ["Item 1", "Item 2"]
    }
  ]
}
```

**LLM Strategy**:
- **Model**: OpenAI GPT-4.1
- **Temperature**: 0.2 (accurate extraction)
- **NLP Techniques**: Named Entity Recognition (NER), Date parsing
- **Validation**: Check for required fields (title, description)

### **Agent 3: Reply Generator** ✉️

**Purpose**: Generate contextual email replies

**Input**: Original email + reply style preference

**Output**: HTML-formatted reply email

**Reply Styles**:
- **Professional**: Formal business communication
- **Friendly**: Warm but polite
- **Casual**: Relaxed for friends
- **Formal**: Very polite for important contacts

**LLM Strategy**:
- **Model**: OpenAI GPT-4.1 / Claude Sonnet-4
- **Temperature**: 0.7 (creative but coherent)
- **Context Awareness**: Original email thread, sender relationship
- **Tone Adaptation**: Adjusts based on selected style

### **Agent 4: Payment Extractor** 💳

**Purpose**: Extract payment/billing information from emails

**Input**: Email containing bills, invoices, receipts

**Output**:
```json
{
  "title": "Bill name",
  "amount": 1250000,
  "currency": "VND",
  "dueDate": "2025-11-25",
  "recipient": "Vietcombank",
  "recipientAddress": "neo_wallet_address",
  "description": "Credit card bill"
}
```

**LLM Strategy**:
- **Model**: OpenAI GPT-4.1
- **Temperature**: 0.1 (high precision for numbers)
- **Data Extraction**: Regex + LLM validation
- **Currency Detection**: Multi-currency support

### **Agent 5: Contract Analyzer** 📄

**Purpose**: Analyze business contracts for risks and opportunities

**Input**: Contract document (PDF/email attachment)

**Output**:
```json
{
  "overallScore": 7.5,
  "riskLevel": "Medium",
  "criticalRisks": [
    {
      "title": "Penalty clause",
      "description": "High penalty for late delivery",
      "recommendation": "Negotiate lower penalty"
    }
  ],
  "moderateRisks": ["Payment terms unclear"],
  "favorableTerms": ["Flexible schedule"]
}
```

**LLM Strategy**:
- **Model**: Claude Sonnet-4 (better for legal text)
- **Temperature**: 0.4 (balanced analysis)
- **Domain Knowledge**: Legal terminology, contract patterns
- **Risk Scoring**: Weighted algorithm based on clause severity

---

##  System Workflow

### **Email Classification Flow**

```
1. User selects emails → clicks "Classify"
2. Frontend → Gmail API Server → Get email data
3. Frontend → Python Backend → AI Classification
4. Agent 1 analyzes email content
5. LLM returns category + task indicator
6. Backend → Frontend with results
7. Frontend → Gmail API → Apply labels
8. UI updates with new labels
```

### **Task Extraction Flow**

```
1. User selects emails → clicks "Extract Tasks"
2. Frontend sends emails to Python Backend
3. Agent 2 processes each email:
   - Check if contains tasks
   - Extract structured task data
   - Parse dates, people, locations
4. Tasks stored in frontend state
5. Switch to Tasks tab → view extracted tasks
6. Link back to source email
```

### **Payment Extraction Flow**

```
1. User selects billing emails → clicks "Extract Payments"
2. Agent 4 analyzes email for:
   - Amount and currency
   - Due date
   - Recipient information
3. Payments stored in Finance tab
4. Optional: Connect NEO wallet for crypto payment
5. Pay directly from app (future feature)
```

---

## 📁 Project Structure

```
hackathon_final/
│
├── new_frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── Header.tsx           # Top navigation
│   │   │   ├── Sidebar.tsx          # Email folders
│   │   │   ├── EmailList.tsx        # Email list view
│   │   │   ├── EmailDetail.tsx      # Email detail view
│   │   │   ├── TaskManagementPage.tsx
│   │   │   ├── FinanceManagementPage.tsx
│   │   │   ├── ContractAnalyzer.tsx
│   │   │   └── ...
│   │   │
│   │   ├── services/                # API Services
│   │   │   ├── gmailService.ts      # Gmail API calls
│   │   │   ├── backendService.ts    # Python backend calls
│   │   │   ├── walletService.ts     # NEO wallet integration
│   │   │   └── unifiedAIService.ts  # AI service wrapper
│   │   │
│   │   ├── App.tsx                  # Main app component
│   │   ├── types.ts                 # TypeScript types
│   │   ├── mockData.ts              # Mock data for testing
│   │   └── main.tsx                 # Entry point
│   │
│   ├── gmail-api-server.cjs         # Node.js Gmail API server
│   ├── credentials.json             # Gmail OAuth credentials
│   ├── token.json                   # Gmail OAuth token (generated)
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
│   │   │   ├── manager.py           # Unified LLM interface
│   │   │   ├── providers/           # LLM provider implementations
│   │   │   └── ...
│   │   ├── tools/                   # Built-in tools
│   │   ├── graph/                   # Graph workflow system
│   │   └── ...
│   │
│   ├── examples/                    # Example agents
│   ├── doc/                         # Documentation
│   ├── requirements.txt
│   └── .env                         # Environment config
│
├── test/                            # Old test files (can be deleted)
└── README.md                        # This file
```

---

## ⚙️ Configuration

### **Frontend Configuration**

Edit `new_frontend/src/services/gmailService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3002/api';
```

Edit `new_frontend/src/services/backendService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

### **Backend Configuration**

Edit `spoon-core/email_backend/app.py`:

```python
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **LLM Provider Selection**

Edit `spoon-core/.env`:

```bash
# Primary LLM (used for most operations)
DEFAULT_LLM_PROVIDER=openai

# Fallback chain
LLM_FALLBACK_CHAIN=openai,anthropic,gemini
```

### **Gmail API Scopes**

In `new_frontend/gmail-api-server.cjs`:

```javascript
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send'
];
```

---

##  Usage Examples

### **Example 1: Classify Emails**

1. Open app → Toggle "Use Real Data"
2. Select multiple emails (checkbox)
3. Click "Classify" button in toolbar
4. AI processes emails (progress bar shows)
5. Labels automatically applied
6. View emails by label in sidebar

### **Example 2: Extract Tasks**

1. Select emails containing tasks
2. Click "Extract Tasks" button
3. Wait for AI processing
4. Switch to "Tasks" tab
5. View extracted tasks with details
6. Click task to see source email

### **Example 3: Generate Reply**

1. Open an email
2. Click "Reply" button
3. Select reply style (Professional/Friendly/Casual)
4. AI generates contextual reply
5. Edit if needed
6. Send directly from app

### **Example 4: Pay with NEO**

1. Extract payment from bill email
2. Go to "Finance" tab
3. Click "Connect Wallet"
4. Approve NeoLine connection
5. View NEO/GAS balance
6. Click "Pay" on pending payment
7. Sign transaction in NeoLine

---

##  Security Considerations

- **Gmail OAuth**: Uses official Google OAuth 2.0 flow
- **API Keys**: Stored in `.env`, never committed to git
- **Token Storage**: Gmail tokens stored locally in `token.json`
- **NEO Wallet**: Private keys never leave browser extension
- **Backend API**: CORS configured for localhost only

---

## 🐛 Troubleshooting

### **Gmail API 401 Error**

```bash
# Delete token and re-authenticate
rm new_frontend/token.json
# Restart Gmail API server
```

### **Python Backend Import Error**

```bash
# Activate virtual environment
cd spoon-core
source spoon-env/bin/activate
pip install -r requirements.txt
```

### **LLM API Rate Limit**

```bash
# Switch to alternative provider in .env
DEFAULT_LLM_PROVIDER=anthropic  # or gemini, deepseek
```

### **NeoLine Not Detected**

1. Install NeoLine extension from Chrome Web Store
2. Refresh browser page
3. Click "Connect Wallet" again

---

##  Performance Metrics

- **Email Classification**: ~2-3 seconds per email
- **Task Extraction**: ~3-5 seconds per email
- **Reply Generation**: ~4-6 seconds
- **Contract Analysis**: ~8-10 seconds per document
- **Bulk Operations**: Processes in parallel (up to 5 concurrent)

---

##  Future Enhancements

- [ ] Support for email attachments (PDF, DOCX)
- [ ] Multi-language email support
- [ ] Calendar integration for task deadlines
- [ ] Email templates and snippets
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Slack/Teams integration
- [ ] Voice command support
- [ ] Contract e-signature integration

---

##  Contributors

Developed for AI Hackathon 2025

---

##  License

This project is developed for hackathon purposes.

---

##  Acknowledgments

- **Spoon OS**: AI agent framework
- **Gmail API**: Email integration
- **NEO Blockchain**: Crypto payment support
- **OpenAI, Anthropic, Google**: LLM providers

---

<div align="center">
  <p>Made with ❤️ for the AI Hackathon 2025</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
