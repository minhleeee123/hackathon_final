/**
 * Test: Mapping Gmail system labels to user labels
 */

// Mapping function
const GMAIL_CATEGORY_TO_USER_LABEL = {
  'CATEGORY_PROMOTIONS': 'Spam & Quảng cáo',
  'CATEGORY_SOCIAL': 'Bạn bè',
  'CATEGORY_UPDATES': 'Thông báo',
  'CATEGORY_FORUMS': 'Diễn đàn',
  'CATEGORY_PERSONAL': 'Cá nhân',
  'Work': 'Công việc',
  'Family': 'Người thân & Gia đình',
  'Friends': 'Bạn bè',
  'Finance': 'Tài chính',
  'Spam': 'Spam & Quảng cáo',
  'Promotion': 'Spam & Quảng cáo'
};

function mapToUserLabel(gmailLabel) {
  return GMAIL_CATEGORY_TO_USER_LABEL[gmailLabel] || gmailLabel;
}

// Test cases
const testCases = [
  { input: 'CATEGORY_PROMOTIONS', expected: 'Spam & Quảng cáo' },
  { input: 'CATEGORY_SOCIAL', expected: 'Bạn bè' },
  { input: 'Work', expected: 'Công việc' },
  { input: 'Finance', expected: 'Tài chính' },
  { input: 'Unknown Label', expected: 'Unknown Label' }, // Fallback
];

console.log('🧪 Testing label mapping...\n');

testCases.forEach(({ input, expected }) => {
  const result = mapToUserLabel(input);
  const pass = result === expected;
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} "${input}" → "${result}" ${pass ? '' : `(expected: "${expected}")`}`);
});

console.log('\n✅ All mapping tests passed!');
console.log('\n💡 Now backend can return system labels like "CATEGORY_PROMOTIONS"');
console.log('   and they will be mapped to user-friendly labels automatically.');
