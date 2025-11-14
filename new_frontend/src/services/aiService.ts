// AI Service - Agent 1 Email Classifier
import { Email } from '../types';

const GEMINI_API_KEY = 'AIzaSyAl9P_ydHYwRyNVHaiB1_LLIEhAL5su70Y';
const GEMINI_MODEL = 'gemini-2.0-flash'; // Stable model, 2.5-flash is getting 503 errors
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

export const TASK_LABEL = 'Task for Agent 2';

export interface ClassificationResult {
  category: 'Work' | 'Family' | 'Friends' | 'Finance' | 'Spam' | 'Promotion';
  hasTask: boolean;
  reasoning: string;
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
  // Truncate body to 200 characters
  const truncatedBody = email.body.length > 200 
    ? email.body.substring(0, 200) + '...' 
    : email.body;

  const prompt = `Classify email:
From: ${email.from.email}
Subject: ${email.subject}
Body: ${truncatedBody}

Categories: Work|Family|Friends|Finance|Spam|Promotion
- Work: Professional, meetings, projects
- Family: Personal from family
- Friends: Personal from friends
- Finance: Bills, invoices, payments
- Spam: Unwanted bulk
- Promotion: Marketing, ads

Task: Does it contain actionable items? (yes/no)

JSON: {"category":"","hasTask":false,"reasoning":""}`;

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
  onProgress?: (current: number, total: number, emailId: string) => void,
  useFastMode: boolean = false
): Promise<BulkClassificationResult[]> {
  const results: BulkClassificationResult[] = [];
  const delayMs = useFastMode ? 200 : 1000; // 200ms for mock data

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    
    if (onProgress) {
      onProgress(i + 1, emails.length, email.id);
    }

    try {
      // For mock data (fast mode), use existing labels instead of calling API
      let classification: ClassificationResult;
      
      if (useFastMode && email.labels && email.labels.length > 0) {
        // Mock: Just use the first label as category
        const mockCategories: Array<keyof typeof CATEGORY_LABELS> = ['Work', 'Family', 'Friends', 'Finance', 'Spam'];
        const randomCategory = mockCategories[i % mockCategories.length];
        
        classification = {
          category: randomCategory,
          hasTask: email.labels.includes('label_task') || Math.random() > 0.7,
          reasoning: 'Mock classification for demo',
          gmailLabel: CATEGORY_LABELS[randomCategory],
          needsTaskLabel: email.labels.includes('label_task') || Math.random() > 0.7,
          isSpam: randomCategory === 'Spam' || randomCategory === 'Promotion'
        };
      } else {
        // Real API call
        classification = await classifyEmail(email);
      }
      
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

    // Wait between requests
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
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

// ===== Agent 4: Payment Information Extractor =====

export interface PaymentExtractionResult {
  title: string;
  amount: number;
  currency: string;
  dueDate?: string;
  recipient?: string;
  paymentMethod?: string;
  description: string;
}

/**
 * Extract payment information from finance-tagged emails using LLM4
 */
export async function extractPaymentInfo(email: Email): Promise<PaymentExtractionResult> {
  const prompt = `Trích xuất thông tin thanh toán từ email sau:

From: ${email.from.email}
Subject: ${email.subject}
Body: ${email.body}

Hãy phân tích và trích xuất:
1. Tên khoản phí/thanh toán
2. Số tiền (chỉ số, không có ký tự)
3. Đơn vị tiền tệ (VND, USD, EUR, etc.)
4. Hạn thanh toán (format: YYYY-MM-DD)
5. Người nhận/Đơn vị thu
6. Phương thức thanh toán (nếu có)
7. Mô tả chi tiết

JSON format:
{
  "title": "Tên khoản phí",
  "amount": 100000,
  "currency": "VND",
  "dueDate": "2025-12-31",
  "recipient": "Công ty ABC",
  "paymentMethod": "Chuyển khoản",
  "description": "Mô tả chi tiết"
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
          title: result.title || 'Khoản thanh toán',
          amount: parseFloat(result.amount) || 0,
          currency: result.currency || 'VND',
          dueDate: result.dueDate,
          recipient: result.recipient,
          paymentMethod: result.paymentMethod,
          description: result.description || email.snippet
        };
      }
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Payment extraction error:', error);
    throw error;
  }
}
