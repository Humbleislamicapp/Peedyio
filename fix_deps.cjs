const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "    arrowDragState,\\n    page?.elements,\\n    pageWidth,",
  "    arrowDragState,\\n    page,\\n    pageWidth,"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
