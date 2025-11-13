// AI Service - Agent 1 Email Classifier
import { Email } from '../types';

const GEMINI_API_KEY = 'AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Mapping categories to Gmail labels (Vietnamese)
export const CATEGORY_LABELS = {
  'Work': 'Công việc',
  'Family': 'Người thân & Gia đình',
  'Friends': 'Bạn bè',
  'Finance': 'Tài chính',
  'Spam': 'Spam & Quảng cáo',
  'Promotion': 'Spam & Quảng cáo'
} as const;

export const TASK_LABEL = '📋 Task for Agent 2';

export interface ClassificationResult {
  category: 'Work' | 'Family' | 'Friends' | 'Finance' | 'Spam' | 'Promotion';
  hasTask: boolean;
  reasoning: string;
  confidence: number;
  gmailLabel: string;
  needsTaskLabel: boolean;
  isSpam: boolean;
}

export interface BulkClassificationResult {
  emailId: string;
  classification: ClassificationResult;
  success: boolean;
  error?: string;
}

/**
 * Classify a single email using Agent 1
 */
export async function classifyEmail(email: Email): Promise<ClassificationResult> {
  const prompt = `You are an Email Classifier AI. Analyze this email and classify it.

Email:
From: ${email.from.email}
Subject: ${email.subject}
Body: ${email.body}

Tasks:
1. Classify into ONE category: "Work", "Family", "Friends", "Finance", "Spam", "Promotion"
   - Work: Professional emails, meetings, projects, colleagues
   - Family: Personal emails from family members
   - Friends: Personal emails from friends
   - Finance: Bills, invoices, payments, banking, receipts, financial statements
   - Spam: Unwanted bulk emails
   - Promotion: Marketing emails, sales, advertisements
2. Determine if it contains tasks/action items (true/false)
3. Provide reasoning

Respond ONLY with valid JSON (no markdown):
{
  "category": "Work|Family|Friends|Finance|Spam|Promotion",
  "hasTask": true|false,
  "reasoning": "Brief explanation",
  "confidence": 0.0-1.0
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        return {
          category: result.category,
          hasTask: result.hasTask,
          reasoning: result.reasoning,
          confidence: result.confidence,
          gmailLabel: CATEGORY_LABELS[result.category as keyof typeof CATEGORY_LABELS],
          needsTaskLabel: result.hasTask,
          isSpam: result.category === 'Spam' || result.category === 'Promotion'
        };
      }
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}

/**
 * Classify multiple emails in bulk
 */
export async function classifyEmailsBulk(
  emails: Email[],
  onProgress?: (current: number, total: number, emailId: string) => void
): Promise<BulkClassificationResult[]> {
  const results: BulkClassificationResult[] = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    
    if (onProgress) {
      onProgress(i + 1, emails.length, email.id);
    }

    try {
      const classification = await classifyEmail(email);
      results.push({
        emailId: email.id,
        classification,
        success: true
      });
    } catch (error) {
      results.push({
        emailId: email.id,
        classification: null as any,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Wait 1 second between requests to avoid rate limiting
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Get summary statistics from bulk classification
 */
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
