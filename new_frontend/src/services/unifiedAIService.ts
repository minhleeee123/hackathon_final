/**
 * Unified AI Service - Backend Only
 * Routes all AI operations through Python backend with Spoon OS
 */

import * as BackendService from './backendService';
import type { Email } from './backendService';

// Re-export constants from original services for backward compatibility
export const CATEGORY_LABELS = {
  'Work': 'Công việc',
  'Family': 'Người thân & Gia đình',
  'Friends': 'Bạn bè',
  'Finance': 'Tài chính',
  'Spam': 'Spam & Quảng cáo',
  'Promotion': 'Spam & Quảng cáo'
} as const;

export const TASK_LABEL = 'Task for Agent 2';

export const REPLY_STYLES = {
  professional: {
    name: 'Chuyên nghiệp',
    description: 'Trang trọng, lịch sự, phù hợp công việc'
  },
  friendly: {
    name: 'Thân thiện',
    description: 'Gần gũi, ấm áp nhưng vẫn lịch sự'
  },
  casual: {
    name: 'Thoải mái',
    description: 'Thân mật, dễ chịu với bạn bè'
  },
  formal: {
    name: 'Trang trọng',
    description: 'Rất lịch sự, trang trọng cho quan hệ quan trọng'
  }
} as const;

// ==================== Classification ====================

export async function classifyEmail(email: Email) {
  return await BackendService.classifyEmail(email);
}

export async function classifyEmailsBulk(
  emails: Email[],
  onProgress?: (current: number, total: number, emailId: string) => void
): Promise<BulkClassificationResult[]> {
  // Process emails one by one (backend doesn't have bulk endpoint yet)
  const results: BulkClassificationResult[] = [];
  for (let i = 0; i < emails.length; i++) {
    try {
      const classification = await BackendService.classifyEmail(emails[i]);
      results.push({
        emailId: emails[i].id,
        classification: classification,
        success: true
      });
    } catch (error) {
      console.error(`Failed to classify email ${emails[i].id}:`, error);
      results.push({
        emailId: emails[i].id,
        classification: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    if (onProgress) {
      onProgress(i + 1, emails.length, emails[i].id);
    }
  }
  return results;
}

// ==================== Task Extraction ====================

export async function extractTasksFromEmail(email: Email) {
  return await BackendService.extractTasksFromEmail(email);
}

export async function extractTasksBulk(
  emails: Email[],
  onProgress?: (current: number, total: number) => void
) {
  // Process emails one by one (backend doesn't have bulk endpoint yet)
  const results = [];
  for (let i = 0; i < emails.length; i++) {
    const result = await BackendService.extractTasksFromEmail(emails[i]);
    results.push(result);
    if (onProgress) {
      onProgress(i + 1, emails.length);
    }
  }
  return results;
}

// ==================== Reply Generation ====================

export async function generateReply(request: BackendService.GenerateReplyRequest) {
  return await BackendService.generateReply(request);
}

// ==================== Payment Extraction ====================

export async function extractPaymentInfo(email: Email) {
  return await BackendService.extractPaymentInfo(email);
}

// ==================== Utility ====================

export interface BulkClassificationResult {
  emailId: string;
  classification: any;
  success: boolean;
  error?: string;
}

export function getClassificationSummary(results: BulkClassificationResult[]) {
  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    byCategory: {} as Record<string, number>,
    withTasks: 0,
    spamDetected: 0
  };

  results.forEach(result => {
    if (result.success && result.classification) {
      const category = result.classification.category;
      summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
      
      if (result.classification.hasTask) {
        summary.withTasks++;
      }
      
      if (result.classification.isSpam) {
        summary.spamDetected++;
      }
    }
  });

  return summary;
}

// ==================== Agent 5: System Analyzer ====================

export async function analyzeProfile(profile: BackendService.UserProfile) {
  return await BackendService.analyzeProfile(profile);
}

// Re-export types for convenience
export type { 
  UserProfile, 
  EmailPattern, 
  SystemAnalysisResult, 
  AgentSuggestion 
} from './backendService';

