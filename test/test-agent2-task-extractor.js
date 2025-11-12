// Test Agent 2 - Task Extractor
// API Key: AIzaSyD4MY7PEDcXZ2R-7Prfq6btGIkuDOBFl44

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyD4MY7PEDcXZ2R-7Prfq6btGIkuDOBFl44";
const genAI = new GoogleGenerativeAI(API_KEY);

// Sample emails with tasks
const sampleEmailsWithTasks = [
  {
    id: 1,
    from: "boss@company.com",
    subject: "Urgent: Project deadline moved to Friday",
    body: "Hi team, we need to complete the Q4 report by this Friday at 5pm. The meeting will be in Conference Room A. Please coordinate with Sarah and Mike."
  },
  {
    id: 2,
    from: "mom@gmail.com",
    subject: "Don't forget dinner this Sunday",
    body: "Hi sweetie, we're having family dinner this Sunday at 6pm at The Garden Restaurant. Grandma and Uncle Tom will be there too. Please bring dessert!"
  },
  {
    id: 3,
    from: "john@company.com",
    subject: "Meeting notes - Action items",
    body: `Action items from today's meeting:
    1. Review the proposal document by Monday 3pm
    2. Schedule follow-up meeting with client next week
    3. Prepare presentation slides - deadline Tuesday morning
    Contact Lisa and David for their input.`
  },
  {
    id: 4,
    from: "events@tech.com",
    subject: "Tech Conference Registration Reminder",
    body: "Don't forget to register for the Annual Tech Conference on December 15-16, 2025 at Convention Center. Early bird deadline is November 20th. Contact organizer at events@tech.com"
  }
];

async function extractTasks(email) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a Task Extractor AI. Analyze the following email and extract all tasks/action items.

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Your task:
Extract ALL tasks or action items from this email. For each task, identify:
- Title: Brief description of the task
- Description: Detailed information
- Deadline: When it needs to be done (if mentioned, otherwise null)
- Location: Where it needs to be done (if mentioned, otherwise null)
- Related People: Who is involved (if mentioned, otherwise empty array)

Respond in JSON format:
{
  "hasTasks": true|false,
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "deadline": "YYYY-MM-DD HH:mm" or null,
      "location": "Location name" or null,
      "relatedPeople": ["person1", "person2"] or []
    }
  ]
}

If no tasks found, return: {"hasTasks": false, "tasks": []}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { error: "Could not parse JSON response", raw: text };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAgent2() {
  console.log("🤖 TESTING AGENT 2 - TASK EXTRACTOR");
  console.log("API Key:", API_KEY.substring(0, 20) + "...");
  console.log("=" .repeat(80));
  console.log("");

  for (const email of sampleEmailsWithTasks) {
    console.log(`\n📧 Email ${email.id}: ${email.subject}`);
    console.log(`From: ${email.from}`);
    console.log("-".repeat(80));
    
    const extraction = await extractTasks(email);
    
    if (extraction.error) {
      console.log("❌ ERROR:", extraction.error);
      if (extraction.raw) {
        console.log("Raw response:", extraction.raw);
      }
    } else {
      console.log("✅ Task Extraction Result:");
      console.log(`   Has Tasks: ${extraction.hasTasks}`);
      console.log(`   Number of Tasks: ${extraction.tasks.length}`);
      
      if (extraction.tasks.length > 0) {
        extraction.tasks.forEach((task, index) => {
          console.log(`\n   Task ${index + 1}:`);
          console.log(`     • Title: ${task.title}`);
          console.log(`     • Description: ${task.description}`);
          console.log(`     • Deadline: ${task.deadline || 'Not specified'}`);
          console.log(`     • Location: ${task.location || 'Not specified'}`);
          console.log(`     • Related People: ${task.relatedPeople.length > 0 ? task.relatedPeople.join(', ') : 'None'}`);
        });
      }
    }
    
    console.log("");
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("=" .repeat(80));
  console.log("✅ Agent 2 testing completed!");
}

// Run the test
testAgent2().catch(console.error);
