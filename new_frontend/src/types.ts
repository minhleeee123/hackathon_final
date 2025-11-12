export type EmailFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'trash' | 'spam' | 'all';

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
