// Test Agent 3 - Reply Generator
// API Key: AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw";
const genAI = new GoogleGenerativeAI(API_KEY);

// Sample user settings
const userSettings = {
  name: "Quang Minh",
  role: "Software Developer",
  communicationStyle: "Professional but friendly",
  workContext: "Working at a tech startup, focusing on web development",
  familyContext: "Close family, living with parents"
};

// Sample emails to reply to
const sampleEmailsToReply = [
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
  },
  {
    id: 4,
    from: "friend@gmail.com",
    subject: "Coffee catch-up?",
    body: "Hey Minh! Long time no see. Want to grab coffee this weekend? Let me know when you're free!",
    category: "Friends"
  }
];

async function generateReply(email, userSettings) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a Reply Generator AI. Generate an appropriate email reply based on the user's settings and the original email.

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

Your task:
Generate a suitable reply that:
1. Matches the user's communication style
2. Is appropriate for the email category (Work/Family/Friends)
3. Addresses the content of the original email
4. Is concise but complete
5. Uses proper email etiquette

Respond in JSON format:
{
  "subject": "Re: Original subject",
  "body": "The reply email body in HTML format",
  "tone": "professional|casual|friendly",
  "reasoning": "Brief explanation of why you chose this reply style"
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

async function testAgent3() {
  console.log("🤖 TESTING AGENT 3 - REPLY GENERATOR");
  console.log("API Key:", API_KEY.substring(0, 20) + "...");
  console.log("=" .repeat(80));
  console.log("\n👤 User Settings:");
  console.log(`   Name: ${userSettings.name}`);
  console.log(`   Role: ${userSettings.role}`);
  console.log(`   Style: ${userSettings.communicationStyle}`);
  console.log("");

  for (const email of sampleEmailsToReply) {
    console.log(`\n📧 Email ${email.id}: ${email.subject}`);
    console.log(`From: ${email.from}`);
    console.log(`Category: ${email.category}`);
    console.log("-".repeat(80));
    
    const reply = await generateReply(email, userSettings);
    
    if (reply.error) {
      console.log("❌ ERROR:", reply.error);
      if (reply.raw) {
        console.log("Raw response:", reply.raw);
      }
    } else {
      console.log("✅ Generated Reply:");
      console.log(`   Subject: ${reply.subject}`);
      console.log(`   Tone: ${reply.tone}`);
      console.log(`   Reasoning: ${reply.reasoning}`);
      console.log("\n   Body:");
      console.log("   " + "-".repeat(76));
      // Strip HTML tags for console display
      const plainBody = reply.body.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n');
      plainBody.split('\n').forEach(line => {
        console.log(`   ${line}`);
      });
      console.log("   " + "-".repeat(76));
    }
    
    console.log("");
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("=" .repeat(80));
  console.log("✅ Agent 3 testing completed!");
}

// Run the test
testAgent3().catch(console.error);
