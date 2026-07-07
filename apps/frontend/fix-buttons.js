const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace text-rig-text with text-white if the same className contains bg-rig-primary, bg-red-500, bg-blue-600, bg-green-600
  // A simple regex: find className="..." and replace inside it
  content = content.replace(/className=(["'{`])(.*?)(["'}])/g, (match, p1, p2, p3) => {
    if (p2.includes('bg-rig-primary') || p2.includes('bg-red-500') || p2.includes('bg-blue-600') || p2.includes('bg-green-500')) {
      // It has a colored background, so change text-rig-text back to text-white
      return `className=${p1}${p2.replace(/text-rig-text/g, 'text-white')}${p3}`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files with button text color fixes.`);
