// AI Service - Agent 3 Reply Generator
import { Email } from '../types';

const GEMINI_API_KEY = 'AIzaSyBKoPjBKVzNd7bKpx-y4fr7ZNSEeeSd6Ao';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type ReplyStyle = 'professional' | 'friendly' | 'concise' | 'detailed';

export const REPLY_STYLES = {
  professional: {
    name: 'Chuyên nghiệp',
    description: 'Trang trọng, lịch sự, phù hợp công việc'
  },
  friendly: {
    name: 'Thân thiện',
    description: 'Gần gũi, ấm áp, phù hợp bạn bè/gia đình'
  },
  concise: {
    name: 'Ngắn gọn',
    description: 'Súc tích, đi thẳng vào vấn đề'
  },
  detailed: {
    name: 'Chi tiết',
    description: 'Giải thích đầy đủ, cung cấp nhiều thông tin'
  }
} as const;

export interface GenerateReplyRequest {
  email: Email;
  style: ReplyStyle;
  userContext?: string; // Optional context about user (name, role, etc.)
  customPrompt?: string; // Custom instructions from user
}

export interface GenerateReplyResult {
  subject: string;
  body: string;
  reasoning: string;
  style: ReplyStyle;
}

/**
 * Generate email reply using Agent 3
 */
export async function generateReply({
  email,
  style,
  userContext = '',
  customPrompt = ''
}: GenerateReplyRequest): Promise<GenerateReplyResult> {
  const styleInstructions = {
    professional: 'Use formal, professional tone. Include proper salutations and closings. Be respectful and courteous.',
    friendly: 'Use warm, friendly tone. Be conversational and personal. Show empathy and care.',
    concise: 'Be brief and to the point. Use short sentences. No unnecessary details.',
    detailed: 'Provide comprehensive response. Explain thoroughly. Include relevant details and examples.'
  };

  const prompt = `You are an Email Reply Generator AI. Generate an appropriate email reply.

Original Email:
From: ${email.from.name} <${email.from.email}>
Subject: ${email.subject}
Body: ${email.body}

${userContext ? `User Context:\n${userContext}\n` : ''}
Reply Style: ${REPLY_STYLES[style].name}
Instructions: ${styleInstructions[style]}
${customPrompt ? `\nAdditional Custom Instructions:\n${customPrompt}\n` : ''}

Generate a reply email with:
1. Appropriate subject line (Re: ... or new subject if needed)
2. Email body in Vietnamese (unless original is in English)
3. Match the tone and style requested
4. Address main points from original email
5. Be helpful and actionable
${customPrompt ? '6. Follow the custom instructions provided above' : ''}

Respond ONLY with valid JSON (no markdown):
{
  "subject": "Reply subject line",
  "body": "Email body content with proper formatting",
  "reasoning": "Why this reply is appropriate"
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
          subject: result.subject,
          body: result.body,
          reasoning: result.reasoning,
          style
        };
      }
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Reply generation error:', error);
    throw error;
  }
}
