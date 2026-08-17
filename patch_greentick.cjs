const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "onClick={(e) => {\\n                        e.stopPropagation();\\n                        onSelectElement(null);\\n                      }}",
  "onClick={(e) => {\\n                        e.stopPropagation();\\n                        onSelectElement(null);\\n                        onSelectTool?.('select');\\n                      }}"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
