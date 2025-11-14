"""
Email Backend API using Spoon OS LLM Manager
Simple and clean implementation based on test learnings
"""
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add spoon-core to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from spoon_ai.llm import LLMManager, ConfigurationManager
from spoon_ai.schema import Message, Role

# Initialize FastAPI
app = FastAPI(title="Email Backend API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Manager (global)
config_manager = ConfigurationManager()
llm_manager = LLMManager(config_manager)

# ==================== Request/Response Models ====================

class EmailClassifyRequest(BaseModel):
    subject: str
    from_email: str
    body: str

class EmailClassifyResponse(BaseModel):
    category: str
    confidence: Optional[float] = None

class TaskExtractRequest(BaseModel):
    subject: str
    from_email: str
    body: str

class Task(BaseModel):
    task: str
    priority: str

class TaskExtractResponse(BaseModel):
    tasks: List[Task]

class ReplyGenerateRequest(BaseModel):
    subject: str
    from_email: str
    body: str
    style: str = "professional"

class ReplyGenerateResponse(BaseModel):
    reply: str

class PaymentExtractRequest(BaseModel):
    subject: str
    from_email: str
    body: str

class PaymentInfo(BaseModel):
    amount: Optional[str] = None
    currency: Optional[str] = None
    due_date: Optional[str] = None
    payment_method: Optional[str] = None
    invoice_number: Optional[str] = None

class PaymentExtractResponse(BaseModel):
    payment_info: PaymentInfo

# ==================== Helper Functions ====================

async def call_llm(prompt: str, provider: str = "gemini") -> str:
    """Helper to call LLM with proper Message format"""
    try:
        messages = [Message(role=Role.USER.value, content=prompt)]
        response = await llm_manager.chat(messages=messages, provider=provider)
        return response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

# ==================== API Endpoints ====================

@app.get("/")
async def root():
    return {
        "message": "Email Backend API with Spoon OS",
        "version": "1.0.0",
        "endpoints": [
            "/api/classify",
            "/api/extract-tasks", 
            "/api/generate-reply",
            "/api/extract-payment"
        ]
    }

@app.get("/health")
async def health():
    return {"status": "ok", "llm_provider": "gemini"}

@app.post("/api/classify", response_model=EmailClassifyResponse)
async def classify_email(request: EmailClassifyRequest):
    """Classify email into categories"""
    
    prompt = f"""You are an email classification assistant. Analyze the following email and classify it into ONE of these categories:
- work: Professional emails, work-related correspondence
- personal: Personal messages, family, friends
- finance: Bills, invoices, bank statements, payment-related
- promotions: Marketing, advertisements, promotional offers
- social: Social media notifications, networking
- updates: System updates, newsletters, automated notifications
- spam: Unwanted or suspicious emails

Email to classify:
Subject: {request.subject}
From: {request.from_email}
Body: {request.body}

Respond with ONLY the category name (e.g., "work", "personal", etc.)."""

    result = await call_llm(prompt)
    category = result.strip().lower()
    
    return EmailClassifyResponse(category=category)

@app.post("/api/extract-tasks", response_model=TaskExtractResponse)
async def extract_tasks(request: TaskExtractRequest):
    """Extract actionable tasks from email"""
    
    prompt = f"""Extract actionable tasks from this email. Return ONLY a JSON array of tasks.

Email:
Subject: {request.subject}
From: {request.from_email}
Body: {request.body}

Return format (JSON only, no markdown):
[{{"task": "task description", "priority": "high"}}, {{"task": "another task", "priority": "medium"}}]

If no tasks, return: []"""

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        # Clean up response (remove markdown if present)
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        tasks_data = json.loads(clean_result)
        tasks = [Task(**task) for task in tasks_data]
        return TaskExtractResponse(tasks=tasks)
    except Exception as e:
        return TaskExtractResponse(tasks=[])

@app.post("/api/generate-reply", response_model=ReplyGenerateResponse)
async def generate_reply(request: ReplyGenerateRequest):
    """Generate email reply"""
    
    style_instructions = {
        "professional": "formal, business-appropriate language",
        "friendly": "warm, casual, personable tone",
        "concise": "brief, direct, to-the-point",
        "detailed": "comprehensive, thorough explanation"
    }
    
    style_desc = style_instructions.get(request.style, "professional")
    
    prompt = f"""Generate a reply to this email in {style_desc} style.

Original Email:
Subject: {request.subject}
From: {request.from_email}
Body: {request.body}

Generate ONLY the reply body text (no subject line, no greetings like "Dear", just the message content)."""

    reply = await call_llm(prompt)
    
    return ReplyGenerateResponse(reply=reply.strip())

@app.post("/api/extract-payment", response_model=PaymentExtractResponse)
async def extract_payment(request: PaymentExtractRequest):
    """Extract payment information from email"""
    
    prompt = f"""Extract payment information from this email. Return ONLY a JSON object.

Email:
Subject: {request.subject}
From: {request.from_email}
Body: {request.body}

Return format (JSON only, no markdown):
{{
  "amount": "amount or null",
  "currency": "currency or null",
  "due_date": "due date or null",
  "payment_method": "method or null",
  "invoice_number": "number or null"
}}"""

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        # Clean up response
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        payment_data = json.loads(clean_result)
        payment_info = PaymentInfo(**payment_data)
        return PaymentExtractResponse(payment_info=payment_info)
    except Exception as e:
        return PaymentExtractResponse(payment_info=PaymentInfo())

# ==================== Run Server ====================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Email Backend API...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
