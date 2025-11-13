// Agent 1: Email Classifier
// Classifies emails into categories and detects tasks

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
    body: "Here are the action items: 1. Review proposal, 2. Schedule follow-up, 3. Prepare presentation"
  },
  {
    id: 5,
    from: "billing@vietcombank.com",
    subject: "Payment reminder - Credit card bill",
    body: "Your credit card bill of 5,000,000 VND is due on November 20, 2025. Please make payment to avoid late fees."
  },
  {
    id: 6,
    from: "friend@gmail.com",
    subject: "Coffee this weekend?",
    body: "Hey! Long time no see. Want to grab coffee this Saturday? Let me know!"
  }
];

async function classifyEmail(email) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an Email Classifier AI. Analyze this email and classify it.

Email:
From: ${email.from}
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

async function testAgent1() {
  console.log("🤖 AGENT 1: EMAIL CLASSIFIER");
  console.log("=".repeat(80));
  console.log("");

  for (const email of sampleEmails) {
    console.log(`📧 Email ${email.id}: ${email.subject}`);
    console.log(`   From: ${email.from}`);
    
    const result = await classifyEmail(email);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   ✅ Category: ${result.category}`);
      console.log(`   📝 Has Task: ${result.hasTask ? 'Yes' : 'No'}`);
      console.log(`   💯 Confidence: ${(result.confidence * 100).toFixed(0)}%`);
      console.log(`   💡 Reasoning: ${result.reasoning}`);
    }
    console.log("");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("=".repeat(80));
  console.log("✅ Agent 1 test completed!\n");
}

testAgent1().catch(console.error);
