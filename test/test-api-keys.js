// Test all 3 API keys to see which models are available

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEYS = {
  key1: "AIzaSyA7KnHZ5Kiuz9QLB4j86_dCUQ0tdJCq7Tc",
  key2: "AIzaSyD4MY7PEDcXZ2R-7Prfq6btGIkuDOBFl44",
  key3: "AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw"
};

const modelsToTry = [
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest"
];

async function testAPIKey(apiKey, keyName) {
  console.log(`\n🔑 Testing ${keyName}: ${apiKey.substring(0, 20)}...`);
  console.log("-".repeat(80));
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'OK' if you can read this");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName}: Working! Response: ${text.substring(0, 50)}`);
      return modelName; // Return first working model
    } catch (error) {
      console.log(`❌ ${modelName}: ${error.message.substring(0, 100)}`);
    }
  }
  
  return null;
}

async function testAllKeys() {
  console.log("🧪 TESTING ALL API KEYS");
  console.log("=".repeat(80));
  
  const workingModels = {};
  
  for (const [keyName, apiKey] of Object.entries(API_KEYS)) {
    const workingModel = await testAPIKey(apiKey, keyName);
    workingModels[keyName] = workingModel;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("📊 SUMMARY:");
  for (const [keyName, model] of Object.entries(workingModels)) {
    if (model) {
      console.log(`✅ ${keyName}: ${model}`);
    } else {
      console.log(`❌ ${keyName}: No working model found`);
    }
  }
}

testAllKeys().catch(console.error);
