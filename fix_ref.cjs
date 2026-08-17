const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "if (el && isSelected && window.document.activeElement !== el && elem.text === 'Type text here...') {\\n                      el.focus();",
  "if (el && isSelected && window.document.activeElement !== el && !el.dataset.autofocused && elem.text === 'Type text here...') {\\n                      el.dataset.autofocused = 'true';\\n                      el.focus();"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
