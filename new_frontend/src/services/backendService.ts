/**
 * Backend API Service
 * Connects frontend to Python backend with Spoon OS
 */

const BACKEND_URL = 'http://localhost:8000';

export interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: Array<{ name: string; email: string }>;
  subject: string;
  body: string;
  snippet: string;
  date: Date;
  labels: string[];
  isRead: boolean;
}

// ==================== Classification ====================

export interface ClassificationResult {
  category: string;
  hasTask: boolean;
  reasoning: string;
  gmailLabel: string;
  needsTaskLabel: boolean;
  isSpam: boolean;
}

export async function classifyEmail(email: Email): Promise<ClassificationResult> {
  const response = await fetch(`${BACKEND_URL}/api/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: email.subject,
      from_email: email.from.email,
      body: email.body
    })
  });

  if (!response.ok) {
    throw new Error(`Classification API error: ${response.status}`);
  }

  return await response.json();
}

// ==================== Task Extraction ====================

export interface Task {
  title: string;
  description: string;
  deadline: string | null;
  location: string | null;
  relatedPeople: string[] | null;
  items: string[] | null;
}

export interface TaskExtractionResult {
  hasTask: boolean;
  tasks: Task[];
  reasoning: string;
}

export async function extractTasksFromEmail(email: Email): Promise<TaskExtractionResult> {
  const response = await fetch(`${BACKEND_URL}/api/extract-tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: email.subject,
      from_email: email.from.email,
      from_name: email.from.name,
      body: email.body
    })
  });

  if (!response.ok) {
    throw new Error(`Task extraction API error: ${response.status}`);
  }

  return await response.json();
}

// ==================== Reply Generation ====================

export interface GenerateReplyRequest {
  email: Email;
  style: 'professional' | 'friendly' | 'concise' | 'detailed';
  userContext?: string;
  customPrompt?: string;
}

export interface GenerateReplyResult {
  subject: string;
  body: string;
  reasoning: string;
  style: string;
}

export async function generateReply({
  email,
  style,
  userContext = '',
  customPrompt = ''
}: GenerateReplyRequest): Promise<GenerateReplyResult> {
  const response = await fetch(`${BACKEND_URL}/api/generate-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: email.subject,
      from_email: email.from.email,
      from_name: email.from.name,
      body: email.body,
      style,
      userContext,
      customPrompt
    })
  });

  if (!response.ok) {
    throw new Error(`Reply generation API error: ${response.status}`);
  }

  return await response.json();
}

// ==================== Payment Extraction ====================

export interface PaymentExtractionResult {
  title: string;
  amount: number;
  currency: string;
  dueDate: string | null;
  recipient: string | null;
  paymentMethod: string | null;
  description: string;
}

export async function extractPaymentInfo(email: Email): Promise<PaymentExtractionResult> {
  const response = await fetch(`${BACKEND_URL}/api/extract-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: email.subject,
      from_email: email.from.email,
      body: email.body
    })
  });

  if (!response.ok) {
    throw new Error(`Payment extraction API error: ${response.status}`);
  }

  return await response.json();
}

// ==================== Health Check ====================

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

// ==================== Agent 5: System Analyzer ====================

export interface EmailPattern {
  category: string;
  frequency: number;
  commonSenders: string[];
  description?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  occupation?: string;
  industry?: string;
  workingHours?: string;
  emailPatterns: EmailPattern[];
  painPoints: string[];
  goals: string[];
  additionalInfo?: string;
}

export interface AgentSuggestion {
  agentId: string;
  name: string;
  description: string;
  purpose: string;
  useCases: string[];
  features: string[];
  estimatedImpact: string;
  priority: number;
  reasoning: string;
}

export interface SystemAnalysisResult {
  currentAgents: string[];
  suggestedAgents: AgentSuggestion[];
  workflowRecommendations: string[];
  overallAssessment: string;
  reasoning: string;
}

export async function analyzeProfile(profile: UserProfile): Promise<SystemAnalysisResult> {
  const response = await fetch(`${BACKEND_URL}/api/analyze-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile)
  });

  if (!response.ok) {
    throw new Error(`Profile analysis API error: ${response.status}`);
  }

  return await response.json();
}
