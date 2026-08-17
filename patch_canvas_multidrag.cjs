const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "onUpdateElement: (elem: PageElement) => void;",
  "onUpdateElement: (elem: PageElement) => void;\n  onUpdateElements?: (elems: PageElement[]) => void;"
);

code = code.replace(
  "onSelectElement,\n  onUpdateElement,",
  "onSelectElement,\n  onUpdateElement,\n  onUpdateElements,"
);

code = code.replace(
  "dragState.initialPositions.forEach(pos => {\n          const target = (page?.elements || []).find((el) => el.id === pos.id);\n          if (target) {\n            onUpdateElement({\n              ...target,\n              x: Math.max(0, Math.min(100 - pos.width, Math.round((pos.x + deltaX) * 10) / 10)),\n              y: Math.max(0, Math.min(100 - pos.height, Math.round((pos.y + deltaY) * 10) / 10)),\n            });\n          }\n        });",
  `const updatedElements: any[] = [];
        dragState.initialPositions.forEach(pos => {
          const target = (page?.elements || []).find((el) => el.id === pos.id);
          if (target) {
            updatedElements.push({
              ...target,
              x: Math.max(0, Math.min(100 - pos.width, Math.round((pos.x + deltaX) * 10) / 10)),
              y: Math.max(0, Math.min(100 - pos.height, Math.round((pos.y + deltaY) * 10) / 10)),
            });
          }
        });
        if (updatedElements.length > 0) {
          if (onUpdateElements) onUpdateElements(updatedElements);
          else updatedElements.forEach(el => onUpdateElement(el));
        }`
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
