const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "} else {\\n          }\\n          if (creationDrag.tool === 'shape') {",
  "} else {\\n            onSelectElement(null);\\n          }\\n        } else if (creationDrag.tool === 'shape') {"
);

// alternative if the previous didn't match spaces:
code = code.replace(/\} else \{\s*\}\s*if \(creationDrag\.tool === 'shape'\) \{/g, "} else {\n            onSelectElement(null);\n          }\n        } else if (creationDrag.tool === 'shape') {");

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
