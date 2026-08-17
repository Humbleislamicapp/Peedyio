const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const regex = /if \(creationDrag\.tool === 'shape'\) \{/g;
let replaced = false;
code = code.replace(regex, (match, offset, string) => {
  // Only replace the one in the render section which is further down (after line 900)
  if (offset > 15000 && !replaced) {
    replaced = true;
    return `if (creationDrag.tool === 'select') {
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
          if (creationDrag.tool === 'shape') {`;
  }
  return match;
});

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
