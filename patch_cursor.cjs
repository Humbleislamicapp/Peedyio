const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "cursor: isSelected ? 'move' : 'pointer',",
  "cursor: isSelected ? 'move' : (elem.type === 'text' && (activeTool === 'select' || activeTool === 'editText' || activeTool === 'addText') ? 'text' : 'pointer'),"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
