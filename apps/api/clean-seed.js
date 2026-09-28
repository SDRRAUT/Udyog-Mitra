const fs = require('fs');

let content = fs.readFileSync('prisma/seed.ts', 'utf8');
content = content.replace(/\u20b9/g, 'Rs.'); // Rupee symbol
content = content.replace(/\u043d/g, 'n');   // Cyrillic n
content = content.replace(/[\u2018\u2019]/g, "'");
content = content.replace(/[\u201C\u201D]/g, '"');
content = content.replace(/[\u2013\u2014]/g, '-');

// Replace any remaining non-ascii characters in text fields (excluding console.log emojis)
let lines = content.split('\n');
let cleanedLines = lines.map((line) => {
  if (line.includes('console.log')) return line;
  // Replace any character > 127 with ASCII equivalent or '?'
  return line.replace(/[^\x00-\x7F]/g, '');
});

fs.writeFileSync('prisma/seed.ts', cleanedLines.join('\n'), 'utf8');
console.log('Cleaned seed.ts successfully!');
