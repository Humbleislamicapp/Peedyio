const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "target.getAttribute('contenteditable') === 'true' ||",
  "target.closest('[contenteditable=\"true\"]') ||"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
