const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "      if (e.key === 'Delete' || e.key === 'Backspace') {\\n        e.preventDefault();\\n        selectedElementIds.forEach(id => onDeleteElement(id));\\n      }",
  "      if (e.key === 'Delete' || e.key === 'Backspace') {\\n        e.preventDefault();\\n        if (onDeleteElements && selectedElementIds.length > 1) {\\n          onDeleteElements(selectedElementIds);\\n        } else {\\n          selectedElementIds.forEach(id => onDeleteElement(id));\\n        }\\n      }"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
