const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // gradients
  content = content.replace(/from-purple-700 via-purple-600 to-orange-500/g, 'from-[#4B27B1] to-[#FF8A00]');
  content = content.replace(/from-purple-700 to-orange-500/g, 'from-[#4B27B1] to-[#FF8A00]');
  content = content.replace(/from-\[\#4A1D96\] to-\[\#FF8A00\]/g, 'from-[#4B27B1] to-[#FF8A00]');
  content = content.replace(/from-purple-500 to-orange-500/g, 'from-[#4B27B1] to-[#FF8A00]');
  
  // texts
  content = content.replace(/text-purple-700/g, 'text-[#4B27B1]');
  content = content.replace(/text-purple-600/g, 'text-[#4B27B1]');
  content = content.replace(/text-purple-500/g, 'text-[#4B27B1]');
  content = content.replace(/text-\[\#4A1D96\]/g, 'text-[#4B27B1]');
  
  // bgs
  content = content.replace(/bg-purple-900/g, 'bg-[#4B27B1]');
  content = content.replace(/bg-purple-950/g, 'bg-[#4B27B1]');
  content = content.replace(/bg-purple-800/g, 'bg-[#3b1e8e]'); // Slightly darker
  content = content.replace(/bg-purple-600/g, 'bg-[#4B27B1]');
  content = content.replace(/bg-\[\#4A1D96\]/g, 'bg-[#4B27B1]');
  
  // borders/rings
  content = content.replace(/border-purple-600/g, 'border-[#4B27B1]');
  content = content.replace(/ring-purple-500/g, 'ring-[#4B27B1]');
  content = content.replace(/focus:ring-purple-500/g, 'focus:ring-[#4B27B1]');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src'));
