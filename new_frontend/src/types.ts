export type EmailFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'trash' | 'spam' | 'all';

export type EmailLabel = 'work' | 'family' | 'friends' | 'important' | 'promotion' | 'social';

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
  labels: EmailLabel[];
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
  id: EmailLabel;
  name: string;
  color: string;
}
