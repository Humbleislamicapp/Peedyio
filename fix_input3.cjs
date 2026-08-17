const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const regex = /onInput=\{\(e\) => \{[\s\S]*?\}\}/g;
code = code.replace(regex, "");

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
