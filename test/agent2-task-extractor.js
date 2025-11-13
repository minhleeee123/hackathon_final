// Agent 2: Task Extractor
// Extracts tasks and action items from emails

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw";
const genAI = new GoogleGenerativeAI(API_KEY);

// Sample emails with tasks
const sampleEmails = [
  {
    id: 1,
    from: "boss@company.com",
    subject: "Urgent: Project deadline moved to Friday",
    body: "Hi team, we need to complete the Q4 report by this Friday at 5pm. The meeting will be in Conference Room A. Please coordinate with Sarah and Mike."
  },
  {
    id: 2,
    from: "john@company.com",
    subject: "Meeting notes - Action items",
    body: `Action items from today's meeting:
1. Review the proposal document by Monday 3pm
2. Schedule follow-up meeting with client next week
3. Prepare presentation slides - deadline Tuesday morning
Contact Lisa and David for their input.`
  },
  {
    id: 3,
    from: "events@tech.com",
    subject: "Tech Conference Registration",
    body: "Register for the Annual Tech Conference on December 15-16, 2025 at Convention Center. Early bird deadline is November 20th."
  }
];

async function extractTasks(email) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a Task Extractor AI. Extract all tasks/action items from this email.

Email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

For each task, extract:
- Title: Brief task description
- Description: Detailed information
- Deadline: Date/time if mentioned (format: YYYY-MM-DD HH:mm), else null
- Location: Place if mentioned, else null
- Related People: Names mentioned, else empty array

Respond ONLY with valid JSON (no markdown):
{
  "hasTasks": true|false,
  "tasks": [
    {
      "title": "Task title",
      "description": "Details",
      "deadline": "YYYY-MM-DD HH:mm" or null,
      "location": "Location" or null,
      "relatedPeople": ["name1", "name2"] or []
    }
  ]
}

If no tasks: {"hasTasks": false, "tasks": []}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { error: "Could not parse JSON", raw: text };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAgent2() {
  console.log("🤖 AGENT 2: TASK EXTRACTOR");
  console.log("=".repeat(80));
  console.log("");

  for (const email of sampleEmails) {
    console.log(`📧 Email ${email.id}: ${email.subject}`);
    console.log(`   From: ${email.from}`);
    
    const result = await extractTasks(email);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   ✅ Has Tasks: ${result.hasTasks ? 'Yes' : 'No'}`);
      console.log(`   📋 Tasks Found: ${result.tasks.length}`);
      
      result.tasks.forEach((task, index) => {
        console.log(`\n   Task ${index + 1}:`);
        console.log(`      • Title: ${task.title}`);
        console.log(`      • Description: ${task.description}`);
        console.log(`      • Deadline: ${task.deadline || 'Not specified'}`);
        console.log(`      • Location: ${task.location || 'Not specified'}`);
        console.log(`      • People: ${task.relatedPeople.length > 0 ? task.relatedPeople.join(', ') : 'None'}`);
      });
    }
    console.log("");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("=".repeat(80));
  console.log("✅ Agent 2 test completed!\n");
}

testAgent2().catch(console.error);
