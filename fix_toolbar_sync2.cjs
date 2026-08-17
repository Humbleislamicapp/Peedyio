const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

const regex = /\/\/ Force update of the element's text property[\s\S]*?handleUpdateElement\(\{ \.\.\.selectedElem, text: activeEl\.innerHTML \}\);\s*\}\s*\}/g;

code = code.replace(regex, "");

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
