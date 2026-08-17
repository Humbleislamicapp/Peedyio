const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "fontSize: toolSettings.fontSize || 14,\n            fontFamily: toolSettings.fontFamily || 'Helvetica Neue',\n            color: toolSettings.textColor || '#111827',\n            fontWeight: toolSettings.fontWeight || 'normal',\n            textAlign: toolSettings.textAlign || 'left',\n            textDecoration: toolSettings.textDecoration || 'none',",
  "fontSize: 14,\n            fontFamily: 'Helvetica Neue',\n            color: '#111827',\n            fontWeight: 'normal',\n            textAlign: 'left',\n            textDecoration: 'none',"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
