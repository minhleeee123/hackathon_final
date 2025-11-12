// Test All 3 Agents Together - Complete Pipeline
// This simulates the full email processing workflow

const { GoogleGenerativeAI } = require("@google/generative-ai");

// 3 different API keys for 3 agents
const API_KEYS = {
  classifier: "AIzaSyA7KnHZ5Kiuz9QLB4j86_dCUQ0tdJCq7Tc",
  taskExtractor: "AIzaSyD4MY7PEDcXZ2R-7Prfq6btGIkuDOBFl44",
  replyGenerator: "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw"
};

const genAI1 = new GoogleGenerativeAI(API_KEYS.classifier);
const genAI2 = new GoogleGenerativeAI(API_KEYS.taskExtractor);
const genAI3 = new GoogleGenerativeAI(API_KEYS.replyGenerator);

// User settings
const userSettings = {
  name: "Quang Minh",
  role: "Software Developer",
  communicationStyle: "Professional but friendly",
  workContext: "Working at a tech startup, focusing on web development",
  familyContext: "Close family, living with parents"
};

// Test email
const testEmail = {
  from: "boss@company.com",
  subject: "Project Review Meeting - Action Items",
  body: `Hi Minh,

Thanks for attending today's project review meeting. Here are the key action items we discussed:

1. Complete the user authentication module by Friday, November 15th
2. Review and merge Sarah's pull request for the dashboard
3. Schedule a demo session with the client next week at our office
4. Prepare documentation for the API endpoints

Please coordinate with Sarah and the QA team for testing. Let me know if you need any resources or support.

Best regards,
John Manager`
};

// Agent 1: Classify Email
async function classifyEmail(email) {
  const model = genAI1.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `You are an Email Classifier AI. Analyze the following email and classify it.

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Your tasks:
1. Classify the email into ONE of these categories: "Work", "Family", "Friends", "Spam", "Promotion"
2. Determine if this email contains any tasks or action items (true/false)
3. Provide a brief reasoning for your classification

Respond in JSON format:
{
  "category": "Work|Family|Friends|Spam|Promotion",
  "hasTask": true|false,
  "reasoning": "Brief explanation",
  "confidence": 0.0-1.0
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse error" };
}

// Agent 2: Extract Tasks
async function extractTasks(email) {
  const model = genAI2.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `You are a Task Extractor AI. Extract all tasks from this email.

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Extract ALL tasks with: title, description, deadline, location, relatedPeople

Respond in JSON format:
{
  "hasTasks": true|false,
  "tasks": [
    {
      "title": "Task title",
      "description": "Details",
      "deadline": "YYYY-MM-DD HH:mm" or null,
      "location": "Location" or null,
      "relatedPeople": ["person1"] or []
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse error" };
}

// Agent 3: Generate Reply
async function generateReply(email, category) {
  const model = genAI3.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `You are a Reply Generator AI. Generate an appropriate email reply.

User Settings:
- Name: ${userSettings.name}
- Role: ${userSettings.role}
- Communication Style: ${userSettings.communicationStyle}

Original Email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}
Category: ${category}

Generate a suitable reply in JSON format:
{
  "subject": "Re: Original subject",
  "body": "Reply body in HTML",
  "tone": "professional|casual|friendly",
  "reasoning": "Why this style"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse error" };
}

// Main test function - Process complete pipeline
async function processEmailPipeline() {
  console.log("🚀 TESTING COMPLETE EMAIL PROCESSING PIPELINE");
  console.log("=" .repeat(80));
  console.log("\n📧 Test Email:");
  console.log(`From: ${testEmail.from}`);
  console.log(`Subject: ${testEmail.subject}`);
  console.log(`Body:\n${testEmail.body}`);
  console.log("\n" + "=" .repeat(80));

  try {
    // Step 1: Classify
    console.log("\n🤖 AGENT 1: Classifying email...");
    const classification = await classifyEmail(testEmail);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("✅ Classification Result:");
    console.log(`   Category: ${classification.category}`);
    console.log(`   Has Tasks: ${classification.hasTask}`);
    console.log(`   Confidence: ${classification.confidence}`);
    console.log(`   Reasoning: ${classification.reasoning}`);

    // Step 2: Extract Tasks (if has tasks)
    let tasks = { hasTasks: false, tasks: [] };
    if (classification.hasTask) {
      console.log("\n🤖 AGENT 2: Extracting tasks...");
      tasks = await extractTasks(testEmail);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ Task Extraction Result:");
      console.log(`   Number of Tasks: ${tasks.tasks.length}`);
      tasks.tasks.forEach((task, index) => {
        console.log(`\n   Task ${index + 1}:`);
        console.log(`     • ${task.title}`);
        console.log(`     • Deadline: ${task.deadline || 'Not specified'}`);
        console.log(`     • Related: ${task.relatedPeople.join(', ') || 'None'}`);
      });
    }

    // Step 3: Generate Reply
    console.log("\n🤖 AGENT 3: Generating reply...");
    const reply = await generateReply(testEmail, classification.category);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("✅ Generated Reply:");
    console.log(`   Subject: ${reply.subject}`);
    console.log(`   Tone: ${reply.tone}`);
    console.log(`\n   Body:`);
    const plainBody = reply.body.replace(/<[^>]*>/g, '');
    console.log("   " + plainBody);

    // Summary
    console.log("\n" + "=" .repeat(80));
    console.log("📊 PROCESSING SUMMARY:");
    console.log(`   ✅ Email classified as: ${classification.category}`);
    console.log(`   ✅ Tasks extracted: ${tasks.tasks.length}`);
    console.log(`   ✅ Reply generated: ${reply.tone} tone`);
    console.log("=" .repeat(80));
    console.log("✅ Pipeline test completed successfully!");

  } catch (error) {
    console.error("❌ Pipeline error:", error);
  }
}

// Run the complete pipeline test
processEmailPipeline().catch(console.error);
