export type EmailFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'trash' | 'spam' | 'all';

// Account Mode: Personal vs Business
export type AccountMode = 'personal' | 'business';

// Business-specific types
export type EmailPriority = 'urgent' | 'high' | 'normal' | 'low';
export type Department = 'sales' | 'hr' | 'tech' | 'finance' | 'marketing' | 'support' | 'general';

export interface BusinessMetadata {
  priority: EmailPriority;
  department?: Department;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  ticketId?: string;
  isInternal?: boolean; // Email nội bộ công ty
  requiresApproval?: boolean;
  approvedBy?: string[];
  confidentiality?: 'public' | 'internal' | 'confidential' | 'top-secret';
}

// Gmail Label from API (can be system or user labels)
export interface GmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageListVisibility?: string;
  labelListVisibility?: string;
  color?: {
    textColor: string;
    backgroundColor: string;
  };
}

export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  snippet: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: string[]; // Array of Gmail label IDs
  hasAttachments: boolean;
  attachments?: Attachment[];
  folder: EmailFolder;
  isDraft?: boolean;
  // Business-specific fields
  businessMetadata?: BusinessMetadata;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FolderConfig {
  id: EmailFolder;
  name: string;
  icon: string;
  count?: number;
}

export interface LabelConfig {
  id: string;
  name: string;
  color: string;
  type?: 'system' | 'user';
}

export type TaskStatus = 'to-do' | 'in-process' | 'completed';
export type TaskSource = 'ai' | 'user';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  location?: string;
  relatedPeople?: string[];
  items?: string[];
  status: TaskStatus;
  source: TaskSource;
  emailId?: string;
  createdAt: string;
}

export type PaymentStatus = 'unpaid' | 'paid';
export type PaymentSource = 'ai' | 'user';

export interface PaymentItem {
  id: string;
  title: string; // Tên khoản phí
  amount: number; // Số tiền
  currency: string; // Đơn vị tiền tệ (VND, USD, etc.)
  dueDate?: string; // Hạn thanh toán
  recipient?: string; // Người nhận/Đơn vị thu
  recipientAddress?: string; // Địa chỉ ví NEO của người nhận
  paymentMethod?: string; // Phương thức thanh toán
  description: string; // Mô tả chi tiết
  status: PaymentStatus;
  source: PaymentSource;
  emailId?: string;
  paidAt?: string; // Thời điểm thanh toán
  transactionHash?: string; // NEO transaction hash nếu thanh toán bằng crypto
  createdAt: string;
}

// ==================== NEO Wallet Types ====================

export type NeoNetwork = 'MainNet' | 'TestNet' | 'N3MainNet' | 'N3TestNet';

export interface WalletBalance {
  NEO: string;
  GAS: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: NeoNetwork | null;
  balance: WalletBalance | null;
}

export interface PaymentTransaction {
  paymentId: string;
  txHash: string;
  amount: number;
  currency: 'GAS' | 'NEO' | 'USDT';
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  explorerUrl?: string;
}

// Contract Analyzer Types
export type ContractType = 'msa' | 'license' | 'nda' | 'sla' | 'employment' | 'other';
export type ContractStatus = 'pending_review' | 'under_negotiation' | 'approved' | 'signed' | 'rejected' | 'expired';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface CriticalRisk {
  title: string;
  description: string;
  recommendation: string;
  priority: number; // 1 = highest priority
}

export interface RiskAnalysis {
  overallScore: number; // 0-10 scale
  riskLevel: RiskLevel;
  criticalRisks: CriticalRisk[];
  moderateRisks: string[];
  favorableTerms: string[];
}

export interface ContractDetails {
  title: string;
  client: string;
  value: number;
  currency: string;
  type: ContractType;
  status: ContractStatus;
  deadline?: string;
  receivedDate: string;
  duration?: string;
  keyTerms?: string[];
}

export interface Contract {
  id: string;
  emailId: string; // Link to email containing contract
  contractDetails: ContractDetails;
  riskAnalysis: RiskAnalysis;
  attachments: Attachment[];
}

// ==================== User Profile & Agent Analysis Types ====================

export type EmailCategory = 'work' | 'family' | 'friends' | 'finance' | 'shopping' | 'travel' | 'health' | 'education' | 'other';
export type UserRole = 'employee' | 'manager' | 'freelancer' | 'business_owner' | 'student' | 'other';

export interface EmailPattern {
  category: EmailCategory;
  frequency: number; // emails per week
  commonSenders: string[];
  description?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  occupation?: string; // Nghề nghiệp cụ thể
  industry?: string; // Ngành nghề
  workingHours?: string; // VD: "9-17" hoặc "Linh hoạt"
  emailPatterns: EmailPattern[]; // Các loại email thường nhận
  painPoints: string[]; // Khó khăn hiện tại với email
  goals: string[]; // Mục tiêu muốn đạt được
  additionalInfo?: string; // Thông tin thêm
}

export interface AgentSuggestion {
  agentId: string;
  name: string;
  description: string;
  purpose: string; // Mục đích chính
  useCases: string[]; // Các tình huống sử dụng
  features: string[]; // Tính năng chính
  estimatedImpact: 'high' | 'medium' | 'low'; // Tác động dự kiến
  priority: number; // 1 = highest priority
  reasoning: string; // Lý do đề xuất agent này
}

export interface SystemAnalysisResult {
  currentAgents: string[]; // Các agent hiện có
  suggestedAgents: AgentSuggestion[];
  workflowRecommendations: string[]; // Đề xuất cải thiện workflow
  overallAssessment: string; // Đánh giá tổng quan
  reasoning: string; // Lý do phân tích
}
