const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "selectedElementId: string | null;",
  "selectedElementIds: string[];"
);

code = code.replace(
  "selectedElementId,",
  "selectedElementIds,"
);

code = code.replace(
  "if (!selectedElementId) return;",
  "if (!selectedElementIds || selectedElementIds.length === 0) return;"
);

code = code.replace(
  "const target = (page?.elements || []).find((el) => el.id === selectedElementId);",
  "const target = (page?.elements || []).find((el) => el.id === selectedElementIds[0]);"
);

code = code.replace(
  "onDeleteElement(selectedElementId);",
  "selectedElementIds.forEach(id => onDeleteElement(id));"
);

code = code.replace(
  "}, [selectedElementId, page?.elements, onDeleteElement, onSelectElement, onUpdateElement]);",
  "}, [selectedElementIds, page?.elements, onDeleteElement, onSelectElement, onUpdateElement]);"
);

code = code.replace(
  "const isSelected = selectedElementId === elem.id;",
  "const isSelected = selectedElementIds.includes(elem.id);"
);

// We need to implement group drag in PdfCanvas.tsx
// if multiple elements are selected, we shouldn't show the quick toolbar for each of them, maybe just the drag handle? Or let's see.

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
