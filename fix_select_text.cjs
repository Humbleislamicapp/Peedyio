const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5\"",
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5 select-text\""
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
