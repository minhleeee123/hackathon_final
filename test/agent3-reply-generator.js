// Agent 3: Reply Generator
// Generates appropriate email replies based on user settings

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw";
const genAI = new GoogleGenerativeAI(API_KEY);

// User settings for personalized replies
const userSettings = {
  name: "Quang Minh",
  role: "Software Developer",
  communicationStyle: "Professional but friendly",
  workContext: "Working at a tech startup, focusing on web development",
  familyContext: "Close family, living with parents"
};

// Sample emails to reply
const sampleEmails = [
  {
    id: 1,
    from: "boss@company.com",
    subject: "Urgent: Project deadline moved to Friday",
    body: "Hi Minh, we need to complete the Q4 report by this Friday. Please prioritize this task and let me know if you need any support.",
    category: "Work"
  },
  {
    id: 2,
    from: "mom@gmail.com",
    subject: "Don't forget dinner this Sunday",
    body: "Hi sweetie, we're having family dinner this Sunday at 6pm. Don't be late! Grandma is coming too.",
    category: "Family"
  },
  {
    id: 3,
    from: "client@external.com",
    subject: "Question about the new feature",
    body: "Hi Minh, I have some questions about the new authentication feature. Can we schedule a call this week to discuss?",
    category: "Work"
  }
];

async function generateReply(email, userSettings) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a Reply Generator AI. Generate an appropriate email reply.

User Settings:
- Name: ${userSettings.name}
- Role: ${userSettings.role}
- Communication Style: ${userSettings.communicationStyle}
- Work Context: ${userSettings.workContext}
- Family Context: ${userSettings.familyContext}

Original Email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}
Category: ${email.category}

Generate a suitable reply that:
1. Matches user's communication style
2. Is appropriate for the category (Work/Family/Friends)
3. Addresses the email content
4. Is concise but complete
5. Uses proper email etiquette

Respond ONLY with valid JSON (no markdown):
{
  "subject": "Re: Original subject",
  "body": "Reply email body in HTML format",
  "tone": "professional|casual|friendly",
  "reasoning": "Why this reply style was chosen"
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

async function testAgent3() {
  console.log("🤖 AGENT 3: REPLY GENERATOR");
  console.log("=".repeat(80));
  console.log("");
  console.log("👤 User Settings:");
  console.log(`   Name: ${userSettings.name}`);
  console.log(`   Role: ${userSettings.role}`);
  console.log(`   Style: ${userSettings.communicationStyle}`);
  console.log("");

  for (const email of sampleEmails) {
    console.log(`📧 Email ${email.id}: ${email.subject}`);
    console.log(`   From: ${email.from}`);
    console.log(`   Category: ${email.category}`);
    
    const result = await generateReply(email, userSettings);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`\n   ✅ Generated Reply:`);
      console.log(`   Subject: ${result.subject}`);
      console.log(`   Tone: ${result.tone}`);
      console.log(`   Reasoning: ${result.reasoning}`);
      console.log(`\n   Body:`);
      console.log("   " + "-".repeat(76));
      const plainBody = result.body.replace(/<[^>]*>/g, '');
      plainBody.split('\n').forEach(line => {
        if (line.trim()) console.log(`   ${line.trim()}`);
      });
      console.log("   " + "-".repeat(76));
    }
    console.log("");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("=".repeat(80));
  console.log("✅ Agent 3 test completed!\n");
}

testAgent3().catch(console.error);
