const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const oldDragStateBlock = `      if (dragState) {
        const deltaX = ((e.clientX - dragState.startX) / pageWidth) * 100;
        const deltaY = ((e.clientY - dragState.startY) / pageHeight) * 100;

        const maxX = Math.max(0, 100 - (dragState.elemWidth || 5));
        const maxY = Math.max(0, 100 - (dragState.elemHeight || 5));

        const newX = dragState.elemStartX + deltaX;
        const newY = dragState.elemStartY + deltaY;

        const target = (page?.elements || []).find((el) => el.id === dragState.elementId);
        if (target) {
          onUpdateElement({
            ...target,
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
          });
        }
      }`;

const newDragStateBlock = `      if (dragState) {
        const deltaX = ((e.clientX - dragState.startX) / pageWidth) * 100;
        const deltaY = ((e.clientY - dragState.startY) / pageHeight) * 100;

        const updates = dragState.initialPositions.map((pos) => {
          let newX = pos.x + deltaX;
          let newY = pos.y + deltaY;
          
          newX = Math.max(0, Math.min(newX, 100 - pos.width));
          newY = Math.max(0, Math.min(newY, 100 - pos.height));

          const target = (page?.elements || []).find((el) => el.id === pos.id);
          if (!target) return null;
          return {
            ...target,
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
          };
        }).filter(Boolean);

        if (updates.length > 0) {
          if (onUpdateElements && updates.length > 1) {
            onUpdateElements(updates);
          } else {
            updates.forEach(u => onUpdateElement(u));
          }
        }
      }`;

if (code.includes(oldDragStateBlock)) {
  code = code.replace(oldDragStateBlock, newDragStateBlock);
  fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
  console.log('Fixed drag state bug');
} else {
  console.error('Could not find old drag state block');
}
