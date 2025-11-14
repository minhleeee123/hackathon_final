"""
Spoon OS Backend - Minimal wrapper cho Email Management
Chỉ dùng LLM Manager, KHÔNG dùng ReAct/Tools
Giữ nguyên prompts của frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import sys
import os

# Add spoon-core to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'spoon-core'))

from spoon_ai.llm import LLMManager, ConfigurationManager

app = FastAPI(title="Email Management API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Manager
config_manager = ConfigurationManager()
llm_manager = LLMManager(config_manager)

# Set fallback chain: gemini-2.0 → gemini-2.5 → claude (if available)
llm_manager.set_fallback_chain(["gemini", "gemini_fast", "anthropic"])

# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class Email(BaseModel):
    id: str
    from_email: str
    from_name: str
    subject: str
    body: str
    snippet: str

class ClassifyRequest(BaseModel):
    email: Email

class ClassifyResponse(BaseModel):
    category: str
    hasTask: bool
    reasoning: str
    gmailLabel: str
    needsTaskLabel: bool
    isSpam: bool

class ExtractTasksRequest(BaseModel):
    email: Email

class ExtractTasksResponse(BaseModel):
    hasTask: bool
    tasks: List[dict]
    reasoning: str

class GenerateReplyRequest(BaseModel):
    email: Email
    style: str  # professional, friendly, concise, detailed
    userContext: Optional[str] = None
    customPrompt: Optional[str] = None

class GenerateReplyResponse(BaseModel):
    subject: str
    body: str
    reasoning: str
    style: str

class ExtractPaymentRequest(BaseModel):
    email: Email

class ExtractPaymentResponse(BaseModel):
    title: str
    amount: float
    currency: str
    dueDate: Optional[str] = None
    recipient: Optional[str] = None
    paymentMethod: Optional[str] = None
    description: str

# ============================================
# AGENT 1: EMAIL CLASSIFIER
# ============================================

@app.post("/api/classify", response_model=ClassifyResponse)
async def classify_email(request: ClassifyRequest):
    """
    Classify email - GIỮ NGUYÊN PROMPT CŨ
    Chỉ thay fetch API bằng Spoon LLM Manager
    """
    email = request.email
    
    # PROMPT GIỐNG Y NGUYÊN FRONTEND
    truncated_body = email.body[:200] + "..." if len(email.body) > 200 else email.body
    
    prompt = f"""Classify email:
From: {email.from_email}
Subject: {email.subject}
Body: {truncated_body}

Categories: Work|Family|Friends|Finance|Spam|Promotion
- Work: Professional, meetings, projects
- Family: Personal from family
- Friends: Personal from friends
- Finance: Bills, invoices, payments
- Spam: Unwanted bulk
- Promotion: Marketing, ads

Task: Does it contain actionable items? (yes/no)

JSON: {{"category":"","hasTask":false,"reasoning":""}}"""

    try:
        # Dùng LLM Manager với fallback
        response = await llm_manager.chat(
            messages=[{"role": "user", "content": prompt}],
            provider="gemini"  # Will fallback if fails
        )
        
        # Parse JSON từ response
        import json
        import re
        
        json_match = re.search(r'\{[\s\S]*\}', response.content)
        if not json_match:
            raise ValueError("No JSON found in response")
        
        result = json.loads(json_match.group(0))
        
        # Mapping categories to Vietnamese labels
        CATEGORY_LABELS = {
            'Work': 'Công việc',
            'Family': 'Người thân & Gia đình',
            'Friends': 'Bạn bè',
            'Finance': 'Tài chính',
            'Spam': 'Spam & Quảng cáo',
            'Promotion': 'Spam & Quảng cáo'
        }
        
        return ClassifyResponse(
            category=result['category'],
            hasTask=result['hasTask'],
            reasoning=result['reasoning'],
            gmailLabel=CATEGORY_LABELS.get(result['category'], result['category']),
            needsTaskLabel=result['hasTask'],
            isSpam=result['category'] in ['Spam', 'Promotion']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

# ============================================
# AGENT 2: TASK EXTRACTOR
# ============================================

@app.post("/api/extract-tasks", response_model=ExtractTasksResponse)
async def extract_tasks(request: ExtractTasksRequest):
    """
    Extract tasks - GIỮ NGUYÊN PROMPT CŨ
    """
    email = request.email
    
    prompt = f"""You are a Task Extraction AI. Analyze this email and extract actionable tasks.

Email:
From: {email.from_name} <{email.from_email}>
Subject: {email.subject}
Body: {email.body}

Extract tasks with these details:
1. Title: Brief task name
2. Description: What needs to be done
3. Deadline: Date/time if mentioned (ISO format YYYY-MM-DDTHH:mm:ss)
4. Location: Physical or virtual location if mentioned
5. Related People: Names of people involved
6. Items: List of items/materials needed

Rules:
- Only extract ACTIONABLE tasks (meeting, buy, prepare, send, etc.)
- Ignore greetings, pleasantries, general statements
- If multiple tasks, extract all of them
- Convert relative dates to absolute (e.g., "tomorrow" → actual date)
- Use Vietnamese for title/description if email is in Vietnamese

Respond ONLY with valid JSON (no markdown):
{{
  "hasTask": true|false,
  "tasks": [
    {{
      "title": "Task name",
      "description": "What to do",
      "deadline": "2025-11-14T09:00:00" or null,
      "location": "Where" or null,
      "relatedPeople": ["Person1", "Person2"] or null,
      "items": ["Item1", "Item2"] or null
    }}
  ],
  "reasoning": "Why these are tasks"
}}"""

    try:
        response = await llm_manager.chat(
            messages=[{"role": "user", "content": prompt}],
            provider="gemini_fast"  # Use faster model
        )
        
        import json
        import re
        json_match = re.search(r'\{[\s\S]*\}', response.content)
        result = json.loads(json_match.group(0))
        
        return ExtractTasksResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Task extraction failed: {str(e)}")

# ============================================
# AGENT 3: REPLY GENERATOR
# ============================================

@app.post("/api/generate-reply", response_model=GenerateReplyResponse)
async def generate_reply(request: GenerateReplyRequest):
    """
    Generate reply - GIỮ NGUYÊN PROMPT CŨ
    """
    email = request.email
    
    style_instructions = {
        'professional': 'Use formal, professional tone. Include proper salutations and closings. Be respectful and courteous.',
        'friendly': 'Use warm, friendly tone. Be conversational and personal. Show empathy and care.',
        'concise': 'Be brief and to the point. Use short sentences. No unnecessary details.',
        'detailed': 'Provide comprehensive response. Explain thoroughly. Include relevant details and examples.'
    }
    
    prompt = f"""You are an Email Reply Generator AI. Generate an appropriate email reply.

Original Email:
From: {email.from_name} <{email.from_email}>
Subject: {email.subject}
Body: {email.body}

{f"User Context:\n{request.userContext}\n" if request.userContext else ""}
Reply Style: {request.style}
Instructions: {style_instructions[request.style]}
{f"\nAdditional Custom Instructions:\n{request.customPrompt}\n" if request.customPrompt else ""}

Generate a reply email with:
1. Appropriate subject line (Re: ... or new subject if needed)
2. Email body in Vietnamese (unless original is in English)
3. Match the tone and style requested
4. Address main points from original email
5. Be helpful and actionable

Respond ONLY with valid JSON (no markdown):
{{
  "subject": "Reply subject line",
  "body": "Email body content with proper formatting",
  "reasoning": "Why this reply is appropriate"
}}"""

    try:
        response = await llm_manager.chat(
            messages=[{"role": "user", "content": prompt}],
            provider="gemini_fast"
        )
        
        import json
        import re
        json_match = re.search(r'\{[\s\S]*\}', response.content)
        result = json.loads(json_match.group(0))
        
        return GenerateReplyResponse(
            subject=result['subject'],
            body=result['body'],
            reasoning=result['reasoning'],
            style=request.style
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reply generation failed: {str(e)}")

# ============================================
# AGENT 4: PAYMENT EXTRACTOR
# ============================================

@app.post("/api/extract-payment", response_model=ExtractPaymentResponse)
async def extract_payment(request: ExtractPaymentRequest):
    """
    Extract payment info - GIỮ NGUYÊN PROMPT CŨ
    """
    email = request.email
    
    prompt = f"""Trích xuất thông tin thanh toán từ email sau:

From: {email.from_email}
Subject: {email.subject}
Body: {email.body}

Hãy phân tích và trích xuất:
1. Tên khoản phí/thanh toán
2. Số tiền (chỉ số, không có ký tự)
3. Đơn vị tiền tệ (VND, USD, EUR, etc.)
4. Hạn thanh toán (format: YYYY-MM-DD)
5. Người nhận/Đơn vị thu
6. Phương thức thanh toán (nếu có)
7. Mô tả chi tiết

JSON format:
{{
  "title": "Tên khoản phí",
  "amount": 100000,
  "currency": "VND",
  "dueDate": "2025-12-31",
  "recipient": "Công ty ABC",
  "paymentMethod": "Chuyển khoản",
  "description": "Mô tả chi tiết"
}}"""

    try:
        response = await llm_manager.chat(
            messages=[{"role": "user", "content": prompt}],
            provider="gemini"
        )
        
        import json
        import re
        json_match = re.search(r'\{[\s\S]*\}', response.content)
        result = json.loads(json_match.group(0))
        
        return ExtractPaymentResponse(
            title=result.get('title', 'Khoản thanh toán'),
            amount=float(result.get('amount', 0)),
            currency=result.get('currency', 'VND'),
            dueDate=result.get('dueDate'),
            recipient=result.get('recipient'),
            paymentMethod=result.get('paymentMethod'),
            description=result.get('description', email.snippet)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment extraction failed: {str(e)}")

# ============================================
# MONITORING ENDPOINTS
# ============================================

@app.get("/api/stats")
async def get_stats():
    """Get LLM usage statistics"""
    try:
        from spoon_ai.llm.monitoring import get_metrics_collector
        metrics = get_metrics_collector()
        
        return {
            "gemini": metrics.get_provider_stats("gemini"),
            "gemini_fast": metrics.get_provider_stats("gemini_fast"),
            "anthropic": metrics.get_provider_stats("anthropic") if "anthropic" in llm_manager._providers else None
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "spoon-email-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
