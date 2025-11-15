/**
 * Test Gmail API - Bulk Add Labels to 20 Emails
 * 
 * Test gắn labels cho 20 emails đầu tiên với phân loại tự động
 */

const API_BASE = 'http://localhost:3002/api';

// Mapping keywords to label names
const LABEL_MAPPING = {
  'Công việc': ['họp', 'meeting', 'project', 'báo cáo', 'report', 'deadline', 'task', 'work', 'công ty', 'company', 'team', 'client', 'contract'],
  'Người thân & Gia đình': ['mẹ', 'bố', 'ba', 'má', 'anh', 'chị', 'em', 'con', 'cháu', 'family', 'gia đình', 'sinh nhật', 'birthday'],
  'Bạn bè': ['bro', 'bạn', 'friend', 'cà phê', 'coffee', 'chơi', 'game', 'cuối tuần', 'weekend', 'đi chơi'],
  'Tài chính': ['hóa đơn', 'bill', 'payment', 'thanh toán', 'invoice', 'tiền', 'ngân hàng', 'bank', 'vnd', 'usd', 'đồng'],
  'Spam & Quảng cáo': ['sale', 'discount', 'giảm giá', 'khuyến mãi', 'promo', 'deal', 'flash sale', 'mua ngay', 'shop', 'freeship']
};

function classifyEmailSubject(subject) {
  const lowerSubject = subject.toLowerCase();
  
  for (const [labelName, keywords] of Object.entries(LABEL_MAPPING)) {
    for (const keyword of keywords) {
      if (lowerSubject.includes(keyword)) {
        return labelName;
      }
    }
  }
  
  return 'Khác'; // Default
}

async function testBulkLabels() {
  try {
    console.log('🚀 Starting Bulk Label Test for 20 emails...\n');

    // Step 1: Initialize AI labels
    console.log('🏷️  Step 1: Initializing AI labels...');
    const initRes = await fetch(`${API_BASE}/ai/init-labels`, { method: 'POST' });
    const initData = await initRes.json();
    console.log(`✅ Labels ready: ${initData.created.length} created, ${initData.existed.length} existed\n`);

    // Step 2: Fetch labels
    console.log('📋 Step 2: Fetching all labels...');
    const labelsRes = await fetch(`${API_BASE}/labels`);
    const { labels, userLabels } = await labelsRes.json();
    
    const aiLabels = userLabels.filter(l => 
      ['Công việc', 'Người thân & Gia đình', 'Bạn bè', 'Tài chính', 'Spam & Quảng cáo'].includes(l.name)
    );
    
    console.log('Available AI Labels:');
    aiLabels.forEach(l => {
      console.log(`   - ${l.name} (${l.id})`);
    });
    console.log();

    // Step 3: Fetch 20 emails
    console.log('📧 Step 3: Fetching 20 emails...');
    const emailsRes = await fetch(`${API_BASE}/emails?maxResults=20`);
    const { emails } = await emailsRes.json();
    
    console.log(`✅ Found ${emails.length} emails\n`);

    // Step 4: Randomly assign labels to ALL emails
    console.log('🤖 Step 4: Randomly assigning labels to all emails...\n');
    
    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      // Pick a random label
      const randomLabel = aiLabels[Math.floor(Math.random() * aiLabels.length)];
      
      console.log(`[${i + 1}/${emails.length}] "${email.subject.substring(0, 50)}${email.subject.length > 50 ? '...' : ''}"`);
      console.log(`   Random label: ${randomLabel.name}`);
      
      try {
        // Add label to email
        const addRes = await fetch(`${API_BASE}/emails/${email.id}/labels/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labelIds: [randomLabel.id] })
        });
        
        if (addRes.ok) {
          console.log(`   ✅ Added label successfully`);
          successCount++;
          results.push({ email: email.subject, label: randomLabel.name, status: 'success' });
        } else {
          const error = await addRes.json();
          console.log(`   ❌ Failed: ${error.error || 'Unknown error'}`);
          failCount++;
          results.push({ email: email.subject, label: randomLabel.name, status: 'failed' });
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failCount++;
        results.push({ email: email.subject, label: randomLabel.name, status: 'error' });
      }
      
      console.log();
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Total emails processed: ${emails.length}`);
    console.log(`✅ Successfully labeled: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️  Skipped: ${results.filter(r => r.status === 'skipped').length}`);
    console.log();

    // Label breakdown
    const labelCount = {};
    results.forEach(r => {
      if (r.status === 'success') {
        labelCount[r.label] = (labelCount[r.label] || 0) + 1;
      }
    });

    console.log('Labels applied:');
    Object.entries(labelCount).forEach(([label, count]) => {
      console.log(`   ${label}: ${count} emails`);
    });
    console.log();

    console.log('✅ Bulk label test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run test
testBulkLabels();
