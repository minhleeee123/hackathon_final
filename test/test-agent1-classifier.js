// Test Agent 1 - Email Classifier
// API Key: AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw (Switch to key3 - working)

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw";
const genAI = new GoogleGenerativeAI(API_KEY);

// Sample emails for testing
const sampleEmails = [
  {
    id: 1,
    from: "boss@company.com",
    subject: "Urgent: Project deadline moved to Friday",
    body: "Hi team, we need to complete the Q4 report by this Friday. Please prioritize this task."
  },
  {
    id: 2,
    from: "mom@gmail.com",
    subject: "Don't forget dinner this Sunday",
    body: "Hi sweetie, we're having family dinner this Sunday at 6pm. Don't be late!"
  },
  {
    id: 3,
    from: "promotions@shop.com",
    subject: "50% OFF - Black Friday Sale!",
    body: "Limited time offer! Get 50% off all products. Shop now before it's too late!"
  },
  {
    id: 4,
    from: "john@company.com",
    subject: "Meeting notes from yesterday",
    body: "Here are the action items from our meeting: 1. Review proposal, 2. Schedule follow-up, 3. Prepare presentation"
  }
];

async function classifyEmail(email) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  "reasoning": "Brief explanation of why you classified it this way",
  "confidence": 0.0-1.0
}`;

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

async function testAgent1() {
  console.log("🤖 TESTING AGENT 1 - EMAIL CLASSIFIER");
  console.log("API Key:", API_KEY.substring(0, 20) + "...");
  console.log("=" .repeat(80));
  console.log("");

  for (const email of sampleEmails) {
    console.log(`\n📧 Email ${email.id}: ${email.subject}`);
    console.log(`From: ${email.from}`);
    console.log("-".repeat(80));
    
    const classification = await classifyEmail(email);
    
    if (classification.error) {
      console.log("❌ ERROR:", classification.error);
      if (classification.raw) {
        console.log("Raw response:", classification.raw);
      }
    } else {
      console.log("✅ Classification Result:");
      console.log(`   Category: ${classification.category}`);
      console.log(`   Has Task: ${classification.hasTask}`);
      console.log(`   Confidence: ${classification.confidence}`);
      console.log(`   Reasoning: ${classification.reasoning}`);
    }
    
    console.log("");
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("=" .repeat(80));
  console.log("✅ Agent 1 testing completed!");
}

// Run the test
testAgent1().catch(console.error);
