const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

code = code.replace(
  "      // Force update of the element's text property since onBlur might not catch programmatic changes immediately\\n      const activeEl = document.activeElement as HTMLElement;\\n      if (selectedElementIds.length === 1 && currentPage?.elements) {\\n        const selectedElem = currentPage.elements.find(el => el.id === selectedElementIds[0]);\\n        if (selectedElem) {\\n          handleUpdateElement({ ...selectedElem, text: activeEl.innerHTML });\\n        }\\n      }",
  ""
);

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
