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
  paymentMethod?: string; // Phương thức thanh toán
  description: string; // Mô tả chi tiết
  status: PaymentStatus;
  source: PaymentSource;
  emailId?: string;
  paidAt?: string; // Thời điểm thanh toán
  createdAt: string;
}
