/**
 * KIỂM TRA GEMINI API - List Models
 */

const GEMINI_API_KEY = 'AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw';

async function listModels() {
  console.log('\n🔍 ========== KIỂM TRA MODELS CÓ SẴN ==========\n');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log(`✅ Tìm thấy ${data.models.length} models:\n`);
      
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
      
      // Lọc models hỗ trợ generateContent
      const generateContentModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      console.log('\n📝 Models hỗ trợ generateContent:');
      generateContentModels.forEach(model => {
        console.log(`   - ${model.name}`);
      });
      
      // Test với model đầu tiên
      if (generateContentModels.length > 0) {
        console.log('\n🧪 ========== TEST VỚI MODEL ĐẦU TIÊN ==========\n');
        const testModel = generateContentModels[0].name;
        console.log(`Model: ${testModel}\n`);
        
        const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${testModel}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Xin chào! Giới thiệu về bản thân bạn trong 1 câu.'
              }]
            }]
          })
        });
        
        const testData = await testResponse.json();
        
        if (testData.candidates && testData.candidates[0]) {
          const answer = testData.candidates[0].content.parts[0].text;
          console.log(`✅ API hoạt động!\n`);
          console.log(`🤖 Gemini trả lời:\n${answer}\n`);
          console.log(`\n💡 Sử dụng model này: ${testModel}`);
        } else {
          console.log('❌ Lỗi:', JSON.stringify(testData, null, 2));
        }
      }
      
    } else {
      console.log('❌ Lỗi:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

listModels();
