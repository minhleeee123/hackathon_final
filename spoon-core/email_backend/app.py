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
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
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
    hasTask: bool
    reasoning: str
    gmailLabel: str
    needsTaskLabel: bool
    isSpam: bool

class TaskExtractRequest(BaseModel):
    subject: str
    from_email: str
    from_name: str = ""
    body: str

class Task(BaseModel):
    title: str
    description: str
    deadline: Optional[str] = None
    location: Optional[str] = None
    relatedPeople: Optional[List[str]] = None
    items: Optional[List[str]] = None

class TaskExtractResponse(BaseModel):
    hasTask: bool
    tasks: List[Task]
    reasoning: str

class ReplyGenerateRequest(BaseModel):
    subject: str
    from_email: str
    from_name: str = ""
    body: str
    style: str = "professional"
    userContext: str = ""
    customPrompt: str = ""

class ReplyGenerateResponse(BaseModel):
    subject: str
    body: str
    reasoning: str
    style: str

class PaymentExtractRequest(BaseModel):
    subject: str
    from_email: str
    body: str

class PaymentExtractResponse(BaseModel):
    title: str
    amount: float
    currency: str
    dueDate: Optional[str] = None
    recipient: Optional[str] = None
    paymentMethod: Optional[str] = None
    description: str

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
    
    # Truncate body to 200 characters like frontend
    truncated_body = request.body[:200] + '...' if len(request.body) > 200 else request.body
    
    prompt = f"""Classify email:
From: {request.from_email}
Subject: {request.subject}
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

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        # Extract JSON from response
        json_match = clean_result
        if '{' in clean_result:
            start = clean_result.index('{')
            end = clean_result.rindex('}') + 1
            json_match = clean_result[start:end]
        
        data = json.loads(json_match)
        
        # Map category to Gmail label
        CATEGORY_LABELS = {
            "Work": "CATEGORY_PERSONAL",
            "Family": "CATEGORY_PERSONAL",
            "Friends": "CATEGORY_PERSONAL",
            "Finance": "CATEGORY_UPDATES",
            "Spam": "SPAM",
            "Promotion": "CATEGORY_PROMOTIONS"
        }
        
        category = data.get("category", "Work")
        has_task = data.get("hasTask", False)
        
        return EmailClassifyResponse(
            category=category,
            hasTask=has_task,
            reasoning=data.get("reasoning", ""),
            gmailLabel=CATEGORY_LABELS.get(category, "CATEGORY_PERSONAL"),
            needsTaskLabel=has_task,
            isSpam=(category == "Spam" or category == "Promotion")
        )
    except Exception as e:
        # Fallback
        return EmailClassifyResponse(
            category="Work",
            hasTask=False,
            reasoning="Error parsing response",
            gmailLabel="CATEGORY_PERSONAL",
            needsTaskLabel=False,
            isSpam=False
        )

@app.post("/api/extract-tasks", response_model=TaskExtractResponse)
async def extract_tasks(request: TaskExtractRequest):
    """Extract actionable tasks from email"""
    
    from_name = request.from_name or request.from_email
    
    prompt = f"""You are a Task Extraction AI. Analyze this email and extract actionable tasks.

Email:
From: {from_name} <{request.from_email}>
Subject: {request.subject}
Body: {request.body}

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

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        # Extract JSON
        if '{' in clean_result:
            start = clean_result.index('{')
            end = clean_result.rindex('}') + 1
            clean_result = clean_result[start:end]
        
        data = json.loads(clean_result)
        
        tasks = [Task(**task) for task in data.get("tasks", [])]
        return TaskExtractResponse(
            hasTask=data.get("hasTask", False),
            tasks=tasks,
            reasoning=data.get("reasoning", "")
        )
    except Exception as e:
        return TaskExtractResponse(hasTask=False, tasks=[], reasoning="Error parsing response")

@app.post("/api/generate-reply", response_model=ReplyGenerateResponse)
async def generate_reply(request: ReplyGenerateRequest):
    """Generate email reply"""
    
    REPLY_STYLES = {
        "professional": {"name": "Professional", "desc": "Use formal, professional tone. Include proper salutations and closings. Be respectful and courteous."},
        "friendly": {"name": "Friendly", "desc": "Use warm, friendly tone. Be conversational and personal. Show empathy and care."},
        "concise": {"name": "Concise", "desc": "Be brief and to the point. Use short sentences. No unnecessary details."},
        "detailed": {"name": "Detailed", "desc": "Provide comprehensive response. Explain thoroughly. Include relevant details and examples."}
    }
    
    style_info = REPLY_STYLES.get(request.style, REPLY_STYLES["professional"])
    from_name = request.from_name or request.from_email
    
    user_context_part = f"User Context:\n{request.userContext}\n" if request.userContext else ""
    custom_prompt_part = f"\nAdditional Custom Instructions:\n{request.customPrompt}\n" if request.customPrompt else ""
    custom_instruction = "6. Follow the custom instructions provided above" if request.customPrompt else ""
    
    prompt = f"""You are an Email Reply Generator AI. Generate an appropriate email reply.

Original Email:
From: {from_name} <{request.from_email}>
Subject: {request.subject}
Body: {request.body}

{user_context_part}Reply Style: {style_info['name']}
Instructions: {style_info['desc']}
{custom_prompt_part}
Generate a reply email with:
1. Appropriate subject line (Re: ... or new subject if needed)
2. Email body in Vietnamese (unless original is in English)
3. Match the tone and style requested
4. Address main points from original email
5. Be helpful and actionable
{custom_instruction}

Respond ONLY with valid JSON (no markdown):
{{
  "subject": "Reply subject line",
  "body": "Email body content with proper formatting",
  "reasoning": "Why this reply is appropriate"
}}"""

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        # Extract JSON
        if '{' in clean_result:
            start = clean_result.index('{')
            end = clean_result.rindex('}') + 1
            clean_result = clean_result[start:end]
        
        data = json.loads(clean_result)
        
        return ReplyGenerateResponse(
            subject=data.get("subject", f"Re: {request.subject}"),
            body=data.get("body", ""),
            reasoning=data.get("reasoning", ""),
            style=request.style
        )
    except Exception as e:
        return ReplyGenerateResponse(
            subject=f"Re: {request.subject}",
            body="I appreciate your message. I'll get back to you soon.",
            reasoning="Error parsing response",
            style=request.style
        )

@app.post("/api/extract-payment", response_model=PaymentExtractResponse)
async def extract_payment(request: PaymentExtractRequest):
    """Extract payment information from email"""
    
    prompt = f"""Trích xuất thông tin thanh toán từ email sau:

From: {request.from_email}
Subject: {request.subject}
Body: {request.body}

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

    result = await call_llm(prompt)
    
    # Parse JSON response
    import json
    try:
        clean_result = result.strip()
        if clean_result.startswith("```"):
            clean_result = clean_result.split("```")[1]
            if clean_result.startswith("json"):
                clean_result = clean_result[4:]
        clean_result = clean_result.strip()
        
        # Extract JSON
        if '{' in clean_result:
            start = clean_result.index('{')
            end = clean_result.rindex('}') + 1
            clean_result = clean_result[start:end]
        
        data = json.loads(clean_result)
        
        return PaymentExtractResponse(
            title=data.get("title", "Khoản thanh toán"),
            amount=float(data.get("amount", 0)),
            currency=data.get("currency", "VND"),
            dueDate=data.get("dueDate"),
            recipient=data.get("recipient"),
            paymentMethod=data.get("paymentMethod"),
            description=data.get("description", request.body[:100])
        )
    except Exception as e:
        return PaymentExtractResponse(
            title="Khoản thanh toán",
            amount=0.0,
            currency="VND",
            dueDate=None,
            recipient=None,
            paymentMethod=None,
            description=request.body[:100]
        )

# ==================== Agent 5: System Analyzer ====================

class EmailPattern(BaseModel):
    category: str  # work, family, friends, finance, shopping, travel, health, education, other
    frequency: int  # emails per week
    commonSenders: List[str] = []
    description: Optional[str] = None

class UserProfileRequest(BaseModel):
    name: str
    email: str
    role: str  # employee, manager, freelancer, business_owner, student, other
    occupation: Optional[str] = None
    industry: Optional[str] = None
    workingHours: Optional[str] = None
    emailPatterns: List[EmailPattern]
    painPoints: List[str]
    goals: List[str]
    additionalInfo: Optional[str] = None

class AgentSuggestion(BaseModel):
    agentId: str
    name: str
    description: str
    purpose: str
    useCases: List[str]
    features: List[str]
    estimatedImpact: str  # high, medium, low
    priority: int  # 1 = highest
    reasoning: str

class SystemAnalysisResponse(BaseModel):
    currentAgents: List[str]
    suggestedAgents: List[AgentSuggestion]
    workflowRecommendations: List[str]
    overallAssessment: str
    reasoning: str

@app.post("/api/analyze-profile", response_model=SystemAnalysisResponse)
async def analyze_profile(request: UserProfileRequest):
    """Agent 5: Analyze user profile and suggest additional agents"""
    
    # Build detailed prompt for analysis
    email_patterns_str = "\n".join([
        f"  - {p.category}: ~{p.frequency} emails/tuần"
        + (f" ({p.description})" if p.description else "")
        + (f"\n    Người gửi: {', '.join(p.commonSenders)}" if p.commonSenders else "")
        for p in request.emailPatterns
    ])
    
    pain_points_str = "\n".join([f"  - {p}" for p in request.painPoints])
    goals_str = "\n".join([f"  - {g}" for g in request.goals])
    
    prompt = f"""Analyze this user's email usage profile and suggest additional AI agents to help them.

USER PROFILE:
Name: {request.name}
Email: {request.email}
Role: {request.role}
Occupation: {request.occupation or 'Not specified'}
Industry: {request.industry or 'Not specified'}
Working Hours: {request.workingHours or 'Not specified'}

EMAIL PATTERNS:
{email_patterns_str}

PAIN POINTS (Khó khăn hiện tại):
{pain_points_str}

GOALS (Mục tiêu mong muốn):
{goals_str}

ADDITIONAL INFO:
{request.additionalInfo or 'None'}

CURRENT AGENTS:
1. Email Classifier - Phân loại email (Work/Family/Friends/Finance/Spam/Promotion)
2. Task Extractor - Trích xuất tasks từ email
3. Reply Generator - Tạo email trả lời tự động
4. Payment Extractor - Trích xuất thông tin thanh toán

YOUR TASK:
Based on the user's profile, email patterns, pain points, and goals, suggest 3-5 additional AI agents that would be most helpful.

For each suggested agent, provide:
1. agentId: unique identifier (lowercase-with-dashes)
2. name: Vietnamese name
3. description: Short description (1-2 sentences)
4. purpose: Main purpose
5. useCases: 3-5 specific use cases (list)
6. features: 3-5 key features (list)
7. estimatedImpact: "high", "medium", or "low"
8. priority: 1-5 (1 = highest priority)
9. reasoning: Why this agent is recommended for this user

Also provide:
- workflowRecommendations: 3-5 suggestions to improve their email workflow
- overallAssessment: Overall assessment of their current setup and needs
- reasoning: Why you made these specific recommendations

Respond ONLY with valid JSON in this format:
{{
  "currentAgents": ["Email Classifier", "Task Extractor", "Reply Generator", "Payment Extractor"],
  "suggestedAgents": [
    {{
      "agentId": "email-scheduler",
      "name": "Email Scheduler",
      "description": "Tự động lên lịch gửi email vào thời điểm phù hợp",
      "purpose": "Tối ưu thời gian gửi email để tăng tỷ lệ phản hồi",
      "useCases": ["Gửi email vào giờ làm việc của người nhận", "..."],
      "features": ["Phân tích múi giờ", "Smart scheduling", "..."],
      "estimatedImpact": "high",
      "priority": 1,
      "reasoning": "User nhận nhiều email công việc và cần quản lý thời gian tốt hơn"
    }}
  ],
  "workflowRecommendations": ["Sử dụng labels để tổ chức email tốt hơn", "..."],
  "overallAssessment": "User có workflow cơ bản tốt nhưng cần tools để xử lý khối lượng email lớn",
  "reasoning": "Dựa trên việc user nhận ~50 emails/tuần về công việc và goals là tự động hóa"
}}"""

    try:
        # Call LLM
        response_content = await call_llm(prompt, provider="gemini")
        
        # Parse JSON from response
        import json
        import re
        
        # Extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', response_content)
        if not json_match:
            raise ValueError("No JSON found in LLM response")
        
        result = json.loads(json_match.group(0))
        
        # Validate and structure response
        return SystemAnalysisResponse(
            currentAgents=result.get("currentAgents", []),
            suggestedAgents=[
                AgentSuggestion(**agent) for agent in result.get("suggestedAgents", [])
            ],
            workflowRecommendations=result.get("workflowRecommendations", []),
            overallAssessment=result.get("overallAssessment", ""),
            reasoning=result.get("reasoning", "")
        )
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Response content: {response_content}")
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# ==================== Run Server ====================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Email Backend API...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
