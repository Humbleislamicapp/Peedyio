const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "if (creationDrag.tool === 'shape') {",
  `if (creationDrag.tool === 'select') {
            return (
              <div
                className="absolute pointer-events-none z-50 bg-blue-500/10 border-2 border-dashed border-blue-500"
                style={{
                  left: \`\${minX}%\`,
                  top: \`\${minY}%\`,
                  width: \`\${Math.max(0.1, width)}%\`,
                  height: \`\${Math.max(0.1, height)}%\`,
                }}
              />
            );
          }
          if (creationDrag.tool === 'shape') {`
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
