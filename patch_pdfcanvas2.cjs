const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "  onDeleteElement,\\n  onUpdateFormValues,\\n  globalFormValues,",
  "  onDeleteElement,\n  onDeleteElements,\n  onUpdateFormValues,\n  globalFormValues,"
);

code = code.replace(
  "  onDeleteElement,\\n  onDeleteElements,\\n  onUpdateFormValues,\\n  globalFormValues,",
  "  onDeleteElement,\n  onDeleteElements,\n  onUpdateFormValues,\n  globalFormValues,"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
