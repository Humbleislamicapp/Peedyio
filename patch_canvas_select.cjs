const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "if (activeTool === 'select' || activeTool === 'draw') return;",
  "if (activeTool === 'draw') return;"
);

// handleWindowMouseUp
code = code.replace(
  "if (creationDrag.tool === 'shape') {",
  `if (creationDrag.tool === 'select') {
          if (isDrag) {
            const minX = Math.min(creationDrag.startX, creationDrag.currentX);
            const minY = Math.min(creationDrag.startY, creationDrag.currentY);
            const maxX = Math.max(creationDrag.startX, creationDrag.currentX);
            const maxY = Math.max(creationDrag.startY, creationDrag.currentY);
            
            const selectedIds = (page?.elements || []).filter(el => {
              const elRight = el.x + (el.width || 0);
              const elBottom = el.y + (el.height || 0);
              return !(el.x > maxX || elRight < minX || el.y > maxY || elBottom < minY);
            }).map(el => el.id);
            
            if (selectedIds.length > 0) {
              onSelectElement(selectedIds);
            } else {
              onSelectElement(null);
            }
          } else {
            onSelectElement(null);
          }
        } else if (creationDrag.tool === 'shape') {`
);

// Draw the selection box during drag
code = code.replace(
  "if (creationDrag.tool === 'shape') {",
  `if (creationDrag.tool === 'select') {
            return (
              <div
                className="absolute pointer-events-none z-50 bg-blue-500/10 border border-blue-500"
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
