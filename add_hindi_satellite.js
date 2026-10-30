const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'translations.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find the hi: { sections: { ... } } block
const hiStart = content.indexOf('  hi: {');
if (hiStart === -1) {
  console.error("Could not find 'hi: {'");
  process.exit(1);
}

const hiSectionsStart = content.indexOf('    sections: {', hiStart);
if (hiSectionsStart === -1) {
  console.error("Could not find 'sections: {' under hi");
  process.exit(1);
}

const hiGovSchemes = content.indexOf('      govSchemes: { title: "सरकारी योजनाएं", desc: "स्मार्ट पात्रता जांचकर्ता।" }', hiSectionsStart);
if (hiGovSchemes === -1) {
  console.error("Could not find govSchemes line in hi");
  process.exit(1);
}

// We want to add satellite key after govSchemes
const targetPos = hiGovSchemes + '      govSchemes: { title: "सरकारी योजनाएं", desc: "स्मार्ट पात्रता जांचकर्ता।" }'.length;

const insertStr = ',\n      satellite: { title: "उपग्रह निगरानी", desc: "अंतरिक्ष और कृत्रिम बुद्धिमत्ता (AI) के साथ फसल स्वास्थ्य की निगरानी करें।" }';

const newContent = content.substring(0, targetPos) + insertStr + content.substring(targetPos);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully added Hindi satellite translation key!");
