/**
 * Unified AI Service with Backend Fallback
 * Tries backend first, falls back to direct Gemini API if backend is down
 */

import * as BackendService from './backendService';
import * as DirectAIService from './aiService';
import * as DirectTaskService from './taskExtractorService';
import * as DirectReplyService from './replyGeneratorService';
import type { Email } from './backendService';

let backendAvailable = true;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

// ==================== Health Check ====================

async function checkBackend(): Promise<boolean> {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return backendAvailable;
  }

  lastHealthCheck = now;
  backendAvailable = await BackendService.checkBackendHealth();
  
  if (backendAvailable) {
    console.log('✅ Backend is available - using Spoon OS');
  } else {
    console.warn('⚠️ Backend unavailable - using direct Gemini API');
  }
  
  return backendAvailable;
}

// ==================== Classification ====================

export async function classifyEmail(email: Email) {
  if (await checkBackend()) {
    try {
      return await BackendService.classifyEmail(email);
    } catch (error) {
      console.error('Backend classification failed, falling back to direct API:', error);
      backendAvailable = false;
    }
  }
  
  // Fallback to direct API
  return await DirectAIService.classifyEmail(email);
}

export async function classifyEmailsBulk(
  emails: Email[],
  onProgress?: (current: number, total: number, emailId: string) => void,
  useFastMode: boolean = false
) {
  // For bulk operations, use direct API (no backend endpoint yet)
  return await DirectAIService.classifyEmailsBulk(emails, onProgress, useFastMode);
}

// ==================== Task Extraction ====================

export async function extractTasksFromEmail(email: Email) {
  if (await checkBackend()) {
    try {
      return await BackendService.extractTasksFromEmail(email);
    } catch (error) {
      console.error('Backend task extraction failed, falling back to direct API:', error);
      backendAvailable = false;
    }
  }
  
  // Fallback to direct API
  return await DirectTaskService.extractTasksFromEmail(email);
}

export async function extractTasksBulk(
  emails: Email[],
  onProgress?: (current: number, total: number) => void
) {
  // For bulk operations, use direct API (no backend endpoint yet)
  return await DirectTaskService.extractTasksBulk(emails, onProgress);
}

// ==================== Reply Generation ====================

export async function generateReply(request: BackendService.GenerateReplyRequest) {
  if (await checkBackend()) {
    try {
      return await BackendService.generateReply(request);
    } catch (error) {
      console.error('Backend reply generation failed, falling back to direct API:', error);
      backendAvailable = false;
    }
  }
  
  // Fallback to direct API
  return await DirectReplyService.generateReply(request);
}

// ==================== Payment Extraction ====================

export async function extractPaymentInfo(email: Email) {
  if (await checkBackend()) {
    try {
      return await BackendService.extractPaymentInfo(email);
    } catch (error) {
      console.error('Backend payment extraction failed, falling back to direct API:', error);
      backendAvailable = false;
    }
  }
  
  // Fallback to direct API
  return await DirectAIService.extractPaymentInfo(email);
}

// ==================== Utility ====================

export function getClassificationSummary(results: any[]) {
  return DirectAIService.getClassificationSummary(results);
}

export { CATEGORY_LABELS, TASK_LABEL } from './aiService';
export { REPLY_STYLES } from './replyGeneratorService';
