# Email Backend with Spoon OS

Simple FastAPI backend using Spoon OS LLM Manager for email processing.

## Features

- ✅ Email Classification (7 categories)
- ✅ Task Extraction
- ✅ Reply Generation (4 styles)
- ✅ Payment Information Extraction
- ✅ Automatic fallback (Spoon OS)
- ✅ Error handling

## Setup

1. **Install dependencies:**
```bash
pip install fastapi uvicorn pydantic
```

2. **Configure .env in spoon-core/:**
```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

3. **Run server:**
```bash
cd spoon-core/email_backend
python app.py
```

Server will start at: http://localhost:8000

## API Endpoints

### 1. Classify Email
```
POST /api/classify
```

**Request:**
```json
{
  "subject": "Meeting tomorrow",
  "from_email": "john@company.com",
  "body": "Can we meet tomorrow at 3pm?"
}
```

**Response:**
```json
{
  "category": "work"
}
```

### 2. Extract Tasks
```
POST /api/extract-tasks
```

**Request:**
```json
{
  "subject": "Project deadline",
  "from_email": "manager@company.com",
  "body": "Please submit the report by Friday"
}
```

**Response:**
```json
{
  "tasks": [
    {
      "task": "Submit report",
      "priority": "high"
    }
  ]
}
```

### 3. Generate Reply
```
POST /api/generate-reply
```

**Request:**
```json
{
  "subject": "Meeting request",
  "from_email": "client@company.com",
  "body": "Can we schedule a call?",
  "style": "professional"
}
```

Styles: `professional`, `friendly`, `concise`, `detailed`

**Response:**
```json
{
  "reply": "Thank you for reaching out. I'd be happy to schedule a call..."
}
```

### 4. Extract Payment Info
```
POST /api/extract-payment
```

**Request:**
```json
{
  "subject": "Invoice #12345",
  "from_email": "billing@company.com",
  "body": "Please pay $500 USD by Dec 31"
}
```

**Response:**
```json
{
  "payment_info": {
    "amount": "500",
    "currency": "USD",
    "due_date": "Dec 31",
    "payment_method": null,
    "invoice_number": "12345"
  }
}
```

## Test API

Visit: http://localhost:8000/docs for interactive API documentation

## Architecture

```
Frontend (React/TypeScript)
    ↓
Backend API (FastAPI)
    ↓
Spoon OS LLM Manager
    ↓
Gemini API (with fallback)
```

## Key Learnings Applied

1. **Message Format**: Using `Message(role=Role.USER.value, content="...")` 
2. **LLM Manager**: Centralized LLM calls with automatic retry
3. **Error Handling**: Try/catch with fallback
4. **Clean Architecture**: Simple, focused endpoints

## Next Steps

1. Test all endpoints with Postman/curl
2. Update frontend to call backend API
3. Monitor API usage and errors
4. Add caching if needed
