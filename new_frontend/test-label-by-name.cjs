/**
 * Test: Add labels by name (auto find or create)
 * 
 * Test logic mới: tìm label theo tên, nếu không có thì tạo mới
 */

const API_BASE = 'http://localhost:3002/api';

async function findOrCreateLabel(labelName) {
  // Get all existing labels
  const labelsRes = await fetch(`${API_BASE}/labels`);
  const { labels } = await labelsRes.json();
  
  // Find label by name (case-insensitive)
  const existingLabel = labels.find(
    l => l.name.toLowerCase() === labelName.toLowerCase()
  );
  
  if (existingLabel) {
    console.log(`✅ Label "${labelName}" already exists: ${existingLabel.id}`);
    return existingLabel.id;
  }
  
  // Label doesn't exist, create it without color (use Gmail default)
  console.log(`📝 Creating new label: "${labelName}"`);
  const createRes = await fetch(`${API_BASE}/labels/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: labelName }) // No color!
  });
  
  const { label } = await createRes.json();
  console.log(`✅ Label created: ${label.id}`);
  return label.id;
}

async function testLabelByName() {
  try {
    console.log('🚀 Testing label assignment by name...\n');

    // Step 1: Get first email
    console.log('📧 Step 1: Fetching emails...');
    const emailsRes = await fetch(`${API_BASE}/emails?maxResults=5`);
    const { emails } = await emailsRes.json();
    
    if (emails.length === 0) {
      console.log('❌ No emails found');
      return;
    }

    const testEmail = emails[0];
    console.log(`✅ Test email: "${testEmail.subject}"`);
    console.log(`   ID: ${testEmail.id}\n`);

    // Step 2: Test with existing labels
    console.log('🏷️  Step 2: Testing with existing labels...');
    const existingLabels = ['Công việc', 'Tài chính'];
    
    for (const labelName of existingLabels) {
      console.log(`\n   Testing: "${labelName}"`);
      const labelId = await findOrCreateLabel(labelName);
      
      // Add to email
      const addRes = await fetch(`${API_BASE}/emails/${testEmail.id}/labels/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelIds: [labelId] })
      });
      
      if (addRes.ok) {
        console.log(`   ✅ Added successfully`);
      } else {
        console.log(`   ❌ Failed to add`);
      }
    }

    // Step 3: Test with NEW labels (không tồn tại)
    console.log('\n\n🆕 Step 3: Testing with NEW labels...');
    const newLabels = ['Test Label 1', 'Test Label 2', 'Urgent Priority'];
    
    for (const labelName of newLabels) {
      console.log(`\n   Testing: "${labelName}"`);
      const labelId = await findOrCreateLabel(labelName);
      
      // Add to email
      const addRes = await fetch(`${API_BASE}/emails/${testEmail.id}/labels/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelIds: [labelId] })
      });
      
      if (addRes.ok) {
        console.log(`   ✅ Added successfully`);
      } else {
        console.log(`   ❌ Failed to add`);
      }
    }

    // Step 4: Verify
    console.log('\n\n🔍 Step 4: Verifying labels...');
    const verifyRes = await fetch(`${API_BASE}/emails?maxResults=5`);
    const { emails: updatedEmails } = await verifyRes.json();
    const updatedEmail = updatedEmails.find(e => e.id === testEmail.id);
    
    if (updatedEmail) {
      console.log(`\nEmail now has ${updatedEmail.labels.length} labels:`);
      
      // Get label names
      const finalLabelsRes = await fetch(`${API_BASE}/labels`);
      const { labels: allLabels } = await finalLabelsRes.json();
      
      updatedEmail.labels.forEach(labelId => {
        const label = allLabels.find(l => l.id === labelId);
        if (label) {
          console.log(`   - ${label.name} (${labelId})`);
        }
      });
    }

    console.log('\n✅ Test completed!');
    console.log('\n💡 Key points:');
    console.log('   - Existing labels: Found and used directly');
    console.log('   - New labels: Created automatically without color');
    console.log('   - No color validation errors!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testLabelByName();
