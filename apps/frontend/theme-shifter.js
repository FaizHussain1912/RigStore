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

  // Replace bg-rig-dark with bg-rig-background
  content = content.replace(/bg-rig-dark/g, 'bg-rig-background');

  // Replace bg-rig-surface-light with hover variant equivalent or just keep it as bg-rig-surface
  content = content.replace(/bg-rig-surface-light/g, 'bg-rig-surface');

  // Replace text-white with text-rig-text
  // Wait! Buttons use text-white and we want them to stay white.
  // Actually, we can just replace text-white globally, and then manually fix buttons, 
  // or we can use a clever regex to skip it if it's near bg-rig-primary.
  // Given the complexity of TSX, a global replace is safest, and manual fixing of buttons is easiest.
  content = content.replace(/text-white/g, 'text-rig-text');

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files.`);
