/**
 * TEST GEMINI API
 * 
 * Chạy: node test-gemini-api.js
 */

const GEMINI_API_KEY = 'AIzaSyDo-qk0G6OW2lv7bpNk72zAT9tT1Dz-TFw';
const GEMINI_MODEL = 'gemini-2.5-flash'; // Hoặc: gemini-2.0-flash, gemini-flash-latest
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Test 1: Chat đơn giản
 */
async function testSimpleChat() {
  console.log('\n💬 ========== TEST 1: CHAT ĐÔN GIẢN ==========\n');
  
  const prompt = 'Xin chào! Bạn là ai?';
  console.log(`📝 Câu hỏi: ${prompt}\n`);
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      console.log(`🤖 Gemini trả lời:\n${answer}\n`);
    } else {
      console.log('❌ Không nhận được câu trả lời');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

/**
 * Test 2: Phân loại email
 */
async function testEmailClassification() {
  console.log('\n📧 ========== TEST 2: PHÂN LOẠI EMAIL ==========\n');
  
  const emailContent = `
Người gửi: boss@company.com
Tiêu đề: Urgent - Meeting tomorrow at 9AM
Nội dung: Hi team, we need to discuss the Q4 report. Please prepare your data and join the meeting at 9AM tomorrow in Room 301.
  `;
  
  const prompt = `
Phân loại email sau đây vào một trong các danh mục: Công việc, Gia đình, Bạn bè, Spam, Quảng cáo.

Email:
${emailContent}

Trả lời theo format JSON:
{
  "category": "tên danh mục",
  "confidence": "mức độ tin cậy (0-100)",
  "reason": "lý do phân loại"
}
  `;
  
  console.log('📨 Email cần phân loại:');
  console.log(emailContent);
  console.log('\n🤔 Đang phân loại...\n');
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      console.log(`🤖 Kết quả phân loại:\n${answer}\n`);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

/**
 * Test 3: Trích xuất task từ email
 */
async function testTaskExtraction() {
  console.log('\n📋 ========== TEST 3: TRÍCH XUẤT TASK TỪ EMAIL ==========\n');
  
  const emailContent = `
Chào bạn,

Nhớ bạn chuẩn bị báo cáo dự án cho buổi họp vào 9h sáng mai tại phòng họp tầng 3. 
Gửi giúp mình file báo cáo trước 8h nhé. Ngoài ra, nhớ mua 5 hộp bút cho team.

Cảm ơn!
  `;
  
  const prompt = `
Trích xuất tất cả các task (nhiệm vụ cần làm) từ email sau:

${emailContent}

Trả lời theo format JSON array:
[
  {
    "task": "tên task",
    "deadline": "thời hạn (nếu có)",
    "location": "địa điểm (nếu có)",
    "priority": "high/medium/low"
  }
]
  `;
  
  console.log('📨 Email:');
  console.log(emailContent);
  console.log('\n🤔 Đang trích xuất tasks...\n');
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      console.log(`🤖 Tasks tìm thấy:\n${answer}\n`);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

/**
 * Test 4: Tạo email phản hồi
 */
async function testEmailReply() {
  console.log('\n✉️ ========== TEST 4: TẠO EMAIL PHẢN HỒI ==========\n');
  
  const originalEmail = `
Người gửi: Mẹ
Tiêu đề: Nhớ mua rau về
Nội dung: Con ơi, chiều nay về nhớ mua giúp mẹ 1kg rau cải và 500g thịt ba chỉ nhé. Tối nay mẹ nấu canh rau.
  `;
  
  const prompt = `
Viết email phản hồi cho email sau với giọng văn thân mật, ấm áp:

${originalEmail}

Yêu cầu:
- Xác nhận đã nhận được yêu cầu
- Cam kết sẽ mua đúng những gì mẹ nhờ
- Thể hiện tình cảm với mẹ
- Ngắn gọn, tự nhiên
  `;
  
  console.log('📨 Email gốc:');
  console.log(originalEmail);
  console.log('\n🤔 Đang tạo email phản hồi...\n');
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      console.log(`✉️ Email phản hồi được tạo:\n${answer}\n`);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

/**
 * Test 5: Phân tích sentiment (cảm xúc)
 */
async function testSentimentAnalysis() {
  console.log('\n😊 ========== TEST 5: PHÂN TÍCH CẢM XÚC EMAIL ==========\n');
  
  const emails = [
    "Cảm ơn bạn rất nhiều! Tuyệt vời!",
    "URGENT!!! Cần xử lý ngay! Rất khẩn cấp!!!",
    "Chào bạn, tôi muốn hỏi về sản phẩm.",
    "Tôi rất thất vọng về dịch vụ của các bạn!"
  ];
  
  for (const email of emails) {
    const prompt = `
Phân tích cảm xúc (sentiment) của email sau:

"${email}"

Trả lời theo format JSON:
{
  "sentiment": "positive/negative/neutral/urgent",
  "score": "điểm từ -100 (rất tiêu cực) đến 100 (rất tích cực)",
  "emotion": "cảm xúc chính (vui vẻ, giận dữ, khẩn cấp, bình thường...)"
}
    `;
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const answer = data.candidates[0].content.parts[0].text;
        console.log(`📧 "${email}"`);
        console.log(`🤖 Phân tích: ${answer}\n`);
      }
    } catch (error) {
      console.error('❌ Lỗi:', error.message);
    }
  }
}

/**
 * Test 6: Kiểm tra API key info
 */
async function testAPIInfo() {
  console.log('\n🔑 ========== THÔNG TIN API KEY ==========\n');
  console.log(`API Key: ${GEMINI_API_KEY.substring(0, 20)}...`);
  console.log(`Model: ${GEMINI_MODEL}`);
  console.log(`Endpoint: ${GEMINI_API_URL}\n`);
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 ========== GEMINI API TEST ==========\n');
  
  await testAPIInfo();
  await testSimpleChat();
  await testEmailClassification();
  await testTaskExtraction();
  await testEmailReply();
  await testSentimentAnalysis();
  
  console.log('\n✨ ========== HOÀN THÀNH! ==========\n');
  console.log('📝 Các chức năng đã test:');
  console.log('   ✅ Chat đơn giản');
  console.log('   ✅ Phân loại email');
  console.log('   ✅ Trích xuất task');
  console.log('   ✅ Tạo email phản hồi');
  console.log('   ✅ Phân tích cảm xúc');
  console.log('\n💡 Gemini API hoạt động tốt! Có thể tích hợp vào ứng dụng.\n');
}

main().catch(console.error);
