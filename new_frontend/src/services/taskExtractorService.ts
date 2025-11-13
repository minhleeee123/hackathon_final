// AI Service - Agent 2 Task Extractor
import { Email } from '../types';

const GEMINI_API_KEY = 'AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface ExtractedTask {
  title: string;
  description: string;
  deadline?: string;
  location?: string;
  relatedPeople?: string[];
  items?: string[];
}

export interface TaskExtractionResult {
  hasTask: boolean;
  tasks: ExtractedTask[];
  reasoning: string;
}

/**
 * Extract tasks from email using Agent 2
 */
export async function extractTasksFromEmail(email: Email): Promise<TaskExtractionResult> {
  const prompt = `You are a Task Extraction AI. Analyze this email and extract actionable tasks.

Email:
From: ${email.from.name} <${email.from.email}>
Subject: ${email.subject}
Body: ${email.body}

Extract tasks with these details:
1. Title: Brief task name
2. Description: What needs to be done
3. Deadline: Date/time if mentioned (ISO format YYYY-MM-DDTHH:mm:ss)
4. Location: Physical or virtual location if mentioned
5. Related People: Names of people involved
6. Items: List of items/materials needed

Rules:
- Only extract ACTIONABLE tasks (meeting, buy, prepare, send, etc.)
- Ignore greetings, pleasantries, general statements
- If multiple tasks, extract all of them
- Convert relative dates to absolute (e.g., "tomorrow" → actual date)
- Use Vietnamese for title/description if email is in Vietnamese

Respond ONLY with valid JSON (no markdown):
{
  "hasTask": true|false,
  "tasks": [
    {
      "title": "Task name",
      "description": "What to do",
      "deadline": "2025-11-14T09:00:00" or null,
      "location": "Where" or null,
      "relatedPeople": ["Person1", "Person2"] or null,
      "items": ["Item1", "Item2"] or null
    }
  ],
  "reasoning": "Why these are tasks"
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
          hasTask: result.hasTask,
          tasks: result.tasks || [],
          reasoning: result.reasoning
        };
      }
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Task extraction error:', error);
    throw error;
  }
}

/**
 * Extract tasks from multiple emails in bulk
 */
export async function extractTasksBulk(
  emails: Email[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, TaskExtractionResult>> {
  const results = new Map<string, TaskExtractionResult>();

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    
    if (onProgress) {
      onProgress(i + 1, emails.length);
    }

    try {
      const result = await extractTasksFromEmail(email);
      results.set(email.id, result);
    } catch (error) {
      console.error(`Failed to extract tasks from email ${email.id}:`, error);
    }

    // Rate limiting - wait 1 second between requests
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
