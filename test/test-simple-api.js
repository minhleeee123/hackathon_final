// Simple API Test
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw";

async function testAPI() {
  console.log("🧪 Testing Gemini API...\n");
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  try {
    const result = await model.generateContent("Say 'Hello! I am working.' if you can read this message.");
    const response = await result.response;
    const text = response.text();
    
    console.log("\n✅ API is working!");
    console.log(`Response: ${text}\n`);
    return true;
  } catch (error) {
    console.log("\n❌ API Error:");
    console.log(error.message);
    return false;
  }
}

testAPI();
