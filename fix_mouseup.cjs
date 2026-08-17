const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const regex = /\} else if \(creationDrag\.tool === 'select'\) \{\s*return \(\s*<div\s*className="absolute pointer-events-none z-50 bg-blue-500\/10 border-2 border-dashed border-blue-500"\s*style=\{\{[\s\S]*?\}\}\s*\/>\s*\);\s*\}\s*if \(creationDrag\.tool === 'select'\) \{\s*return \(\s*<div\s*className="absolute pointer-events-none z-50 bg-blue-500\/10 border-2 border-dashed border-blue-500"\s*style=\{\{[\s\S]*?\}\}\s*\/>\s*\);\s*\}/g;

code = code.replace(regex, "");

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
