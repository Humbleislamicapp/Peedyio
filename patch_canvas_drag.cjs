const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

// replace dragState state definition
code = code.replace(
  "const [dragState, setDragState] = useState<{\n    elementId: string;\n    startX: number;\n    startY: number;\n    elemStartX: number;\n    elemStartY: number;\n    elemWidth: number;\n    elemHeight: number;\n  } | null>(null);",
  "const [dragState, setDragState] = useState<{\n    elementIds: string[];\n    startX: number;\n    startY: number;\n    initialPositions: { id: string; x: number; y: number; width: number; height: number }[];\n  } | null>(null);"
);

// replace setDragState in handleElemMouseDown
code = code.replace(
  "setDragState({\n      elementId: elem.id,\n      startX: e.clientX,\n      startY: e.clientY,\n      elemStartX: elem.x,\n      elemStartY: elem.y,\n      elemWidth: elemWidth || 20,\n      elemHeight: elemHeight || 10,\n    });",
  `const idsToDrag = selectedElementIds.includes(elem.id) ? selectedElementIds : [elem.id];
    setDragState({
      elementIds: idsToDrag,
      startX: e.clientX,
      startY: e.clientY,
      initialPositions: (page?.elements || []).filter(el => idsToDrag.includes(el.id)).map(el => ({ id: el.id, x: el.x, y: el.y, width: el.width || 20, height: el.height || 10 }))
    });`
);

// replace handleWindowMouseMove for dragState
code = code.replace(
  "if (dragState) {\n        const deltaX = ((e.clientX - dragState.startX) / pageWidth) * 100;\n        const deltaY = ((e.clientY - dragState.startY) / pageHeight) * 100;\n        const maxX = Math.max(0, 100 - (dragState.elemWidth || 5));\n        const maxY = Math.max(0, 100 - (dragState.elemHeight || 5));\n        const newX = dragState.elemStartX + deltaX;\n        const newY = dragState.elemStartY + deltaY;\n\n        const target = (page?.elements || []).find((el) => el.id === dragState.elementId);\n        if (target) {\n          onUpdateElement({\n            ...target,\n            x: Math.round(newX * 10) / 10,\n            y: Math.round(newY * 10) / 10,\n          });\n        }\n      }",
  `if (dragState) {
        const deltaX = ((e.clientX - dragState.startX) / pageWidth) * 100;
        const deltaY = ((e.clientY - dragState.startY) / pageHeight) * 100;
        
        dragState.initialPositions.forEach(pos => {
          const target = (page?.elements || []).find((el) => el.id === pos.id);
          if (target) {
            onUpdateElement({
              ...target,
              x: Math.max(0, Math.min(100 - pos.width, Math.round((pos.x + deltaX) * 10) / 10)),
              y: Math.max(0, Math.min(100 - pos.height, Math.round((pos.y + deltaY) * 10) / 10)),
            });
          }
        });
      }`
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
