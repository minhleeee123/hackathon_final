/**
 * TEST LABELS API
 * Chạy server trước: node gmail-api-server.cjs
 * Sau đó chạy: node test-labels-api.js
 */

const BASE_URL = 'http://localhost:3002';

async function testLabelsAPI() {
  console.log('\n🧪 ========== TEST LABELS API ==========\n');

  try {
    // 1. Test GET /api/labels
    console.log('1️⃣ Testing GET /api/labels...');
    const labelsRes = await fetch(`${BASE_URL}/api/labels`);
    const labelsData = await labelsRes.json();
    
    console.log('\n📋 LABELS DATA:');
    console.log('   Total labels:', labelsData.labels?.length || 0);
    console.log('   System labels:', labelsData.systemLabels?.length || 0);
    console.log('   User labels:', labelsData.userLabels?.length || 0);
    
    if (labelsData.systemLabels) {
      console.log('\n   📌 System Labels:');
      labelsData.systemLabels.forEach(label => {
        console.log(`      - ${label.name} (${label.id})`);
      });
    }
    
    if (labelsData.userLabels && labelsData.userLabels.length > 0) {
      console.log('\n   🎨 User Labels:');
      labelsData.userLabels.forEach(label => {
        console.log(`      - ${label.name} (${label.id})`);
      });
    } else {
      console.log('\n   ⚠️  No user labels found');
    }

    // 2. Test GET /api/emails (kiểm tra labels được trả về)
    console.log('\n2️⃣ Testing GET /api/emails (check labels)...');
    const emailsRes = await fetch(`${BASE_URL}/api/emails?maxResults=5`);
    const emailsData = await emailsRes.json();
    
    console.log('\n📧 EMAILS WITH LABELS:');
    if (emailsData.emails) {
      emailsData.emails.forEach((email, index) => {
        console.log(`\n   ${index + 1}. ${email.subject}`);
        console.log(`      From: ${email.from.name} <${email.from.email}>`);
        console.log(`      Labels: ${email.labels?.join(', ') || 'None'}`);
        console.log(`      Folder: ${email.folder}`);
      });
    }

    // 3. Test tạo label mới
    console.log('\n3️⃣ Testing POST /api/labels/create...');
    const newLabelRes = await fetch(`${BASE_URL}/api/labels/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test-Label-' + Date.now(),
        color: {
          backgroundColor: '#42d692',
          textColor: '#ffffff'
        }
      })
    });
    const newLabelData = await newLabelRes.json();
    
    if (newLabelData.success) {
      console.log('   ✅ Label created successfully!');
      console.log(`      Name: ${newLabelData.label.name}`);
      console.log(`      ID: ${newLabelData.label.id}`);
      
      // 4. Test gắn label vào email đầu tiên
      if (emailsData.emails && emailsData.emails.length > 0) {
        console.log('\n4️⃣ Testing POST /api/emails/:id/labels/add...');
        const firstEmail = emailsData.emails[0];
        
        const addLabelRes = await fetch(`${BASE_URL}/api/emails/${firstEmail.id}/labels/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            labelIds: [newLabelData.label.id]
          })
        });
        const addLabelResult = await addLabelRes.json();
        
        if (addLabelResult.success) {
          console.log(`   ✅ Label added to email: ${firstEmail.subject}`);
        } else {
          console.log('   ❌ Failed to add label');
        }

        // 5. Test xóa label khỏi email
        console.log('\n5️⃣ Testing POST /api/emails/:id/labels/remove...');
        const removeLabelRes = await fetch(`${BASE_URL}/api/emails/${firstEmail.id}/labels/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            labelIds: [newLabelData.label.id]
          })
        });
        const removeLabelResult = await removeLabelRes.json();
        
        if (removeLabelResult.success) {
          console.log(`   ✅ Label removed from email`);
        } else {
          console.log('   ❌ Failed to remove label');
        }
      }

      // 6. Test xóa label
      console.log('\n6️⃣ Testing DELETE /api/labels/:labelId...');
      const deleteLabelRes = await fetch(`${BASE_URL}/api/labels/${newLabelData.label.id}`, {
        method: 'DELETE'
      });
      const deleteLabelResult = await deleteLabelRes.json();
      
      if (deleteLabelResult.success) {
        console.log('   ✅ Label deleted successfully');
      } else {
        console.log('   ❌ Failed to delete label');
      }
    }

    console.log('\n✅ ========== ALL TESTS COMPLETED ==========\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. Gmail API server is running (node gmail-api-server.cjs)');
    console.log('   2. You are authenticated with Gmail');
    console.log('   3. Server is running on port 3002\n');
  }
}

testLabelsAPI();
