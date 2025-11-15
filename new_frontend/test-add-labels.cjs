/**
 * Test Gmail API - Add Labels to Email
 * 
 * Chức năng test:
 * 1. Lấy danh sách emails
 * 2. Lấy danh sách labels
 * 3. Thêm labels vào email đầu tiên
 * 4. Kiểm tra kết quả
 */

const API_BASE = 'http://localhost:3002/api';

async function testAddLabels() {
  try {
    console.log('🚀 Starting Gmail Label Test...\n');

    // Step 1: Fetch emails
    console.log('📧 Step 1: Fetching emails...');
    const emailsRes = await fetch(`${API_BASE}/emails?maxResults=5`);
    const { emails } = await emailsRes.json();
    
    if (emails.length === 0) {
      console.log('❌ No emails found');
      return;
    }

    const testEmail = emails[0];
    console.log(`✅ Found ${emails.length} emails`);
    console.log(`📨 Test email: "${testEmail.subject}"`);
    console.log(`   ID: ${testEmail.id}`);
    console.log(`   Current labels: ${testEmail.labels.join(', ')}\n`);

    // Step 2: Fetch labels
    console.log('🏷️  Step 2: Fetching labels...');
    const labelsRes = await fetch(`${API_BASE}/labels`);
    const { labels, userLabels } = await labelsRes.json();
    
    console.log(`✅ Found ${labels.length} total labels (${userLabels.length} user labels)`);
    
    // Find AI labels
    const aiLabels = userLabels.filter(l => 
      ['Công việc', 'Người thân & Gia đình', 'Bạn bè', 'Tài chính', 'Spam & Quảng cáo'].includes(l.name)
    );
    
    if (aiLabels.length === 0) {
      console.log('⚠️  No AI labels found. Creating them first...');
      const initRes = await fetch(`${API_BASE}/ai/init-labels`, { method: 'POST' });
      const initData = await initRes.json();
      console.log(`✅ Initialized ${initData.total} AI labels\n`);
      
      // Re-fetch labels
      const newLabelsRes = await fetch(`${API_BASE}/labels`);
      const newData = await newLabelsRes.json();
      aiLabels.push(...newData.userLabels.filter(l => 
        ['Công việc', 'Người thân & Gia đình', 'Bạn bè', 'Tài chính', 'Spam & Quảng cáo'].includes(l.name)
      ));
    }

    console.log('Available AI Labels:');
    aiLabels.forEach(l => {
      console.log(`   - ${l.name} (${l.id})`);
    });
    console.log();

    // Step 3: Add labels to email
    console.log('➕ Step 3: Adding labels to test email...');
    
    // Test 1: Add "Công việc" label
    const workLabel = aiLabels.find(l => l.name === 'Công việc');
    if (workLabel) {
      console.log(`   Adding label: "${workLabel.name}" (${workLabel.id})`);
      const addRes = await fetch(`${API_BASE}/emails/${testEmail.id}/labels/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelIds: [workLabel.id] })
      });
      
      if (addRes.ok) {
        console.log('   ✅ Label added successfully');
      } else {
        const error = await addRes.json();
        console.log('   ❌ Failed to add label:', error);
      }
    }

    // Test 2: Add multiple labels
    const familyLabel = aiLabels.find(l => l.name === 'Người thân & Gia đình');
    const friendLabel = aiLabels.find(l => l.name === 'Bạn bè');
    
    if (familyLabel && friendLabel) {
      console.log(`   Adding multiple labels: "${familyLabel.name}", "${friendLabel.name}"`);
      const addRes = await fetch(`${API_BASE}/emails/${testEmail.id}/labels/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelIds: [familyLabel.id, friendLabel.id] })
      });
      
      if (addRes.ok) {
        console.log('   ✅ Multiple labels added successfully');
      } else {
        const error = await addRes.json();
        console.log('   ❌ Failed to add labels:', error);
      }
    }
    console.log();

    // Step 4: Verify labels were added
    console.log('🔍 Step 4: Verifying labels...');
    const verifyRes = await fetch(`${API_BASE}/emails?maxResults=5`);
    const { emails: updatedEmails } = await verifyRes.json();
    const updatedEmail = updatedEmails.find(e => e.id === testEmail.id);
    
    if (updatedEmail) {
      console.log(`✅ Email labels updated:`);
      console.log(`   Before: ${testEmail.labels.join(', ')}`);
      console.log(`   After:  ${updatedEmail.labels.join(', ')}`);
      
      // Show human-readable label names
      const labelNames = updatedEmail.labels
        .map(labelId => {
          const label = labels.find(l => l.id === labelId);
          return label ? label.name : labelId;
        })
        .join(', ');
      console.log(`   Names:  ${labelNames}`);
    }
    console.log();

    // Step 5: Test removing labels
    console.log('➖ Step 5: Testing label removal...');
    if (workLabel) {
      console.log(`   Removing label: "${workLabel.name}"`);
      const removeRes = await fetch(`${API_BASE}/emails/${testEmail.id}/labels/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelIds: [workLabel.id] })
      });
      
      if (removeRes.ok) {
        console.log('   ✅ Label removed successfully');
      } else {
        const error = await removeRes.json();
        console.log('   ❌ Failed to remove label:', error);
      }
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run test
testAddLabels();
