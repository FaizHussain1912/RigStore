const fs = require('fs');
const path = require('path');

const filesToFix = [
  path.join(__dirname, 'seed.ts'),
  path.join(__dirname, 'moreProducts.ts'),
  path.join(__dirname, 'moreProducts2.ts'),
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace ram: '16GB DDR5' with ram: '16GB'
    // Matches ram: ' followed by digits and GB, then space and anything until quote
    content = content.replace(/ram:\s*'(\d+GB)[^']*'/g, "ram: '$1'");
    
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
