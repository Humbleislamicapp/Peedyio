const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "if (creationDrag.tool === 'shape') {\\n          const isLine",
  "}\\n        if (creationDrag.tool === 'shape') {\\n          const isLine"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
