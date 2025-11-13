const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');

// Get all .tsx files
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(uiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove version numbers from imports
  content = content.replace(/@radix-ui\/react-([a-z-]+)@[\d.]+/g, '@radix-ui/react-$1');
  content = content.replace(/lucide-react@[\d.]+/g, 'lucide-react');
  content = content.replace(/class-variance-authority@[\d.]+/g, 'class-variance-authority');
  content = content.replace(/clsx@[\d.]+/g, 'clsx');
  content = content.replace(/tailwind-merge@[\d.]+/g, 'tailwind-merge');
  content = content.replace(/sonner@[\d.]+/g, 'sonner');
  content = content.replace(/next-themes@[\d.]+/g, 'next-themes');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');
