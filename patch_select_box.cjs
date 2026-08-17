const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  'className="absolute pointer-events-none z-50 bg-blue-500/10 border border-blue-500"',
  'className="absolute pointer-events-none z-50 bg-blue-500/10 border-2 border-dashed border-blue-500"'
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
