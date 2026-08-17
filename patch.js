const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

code = code.replace(
  "const [selectedElementId, setSelectedElementId] = useState<string | null>(null);",
  "const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);"
);

code = code.replace(
  "if (selectedElementId) {",
  "if (selectedElementIds.length === 1) {"
);

code = code.replace(
  "const selectedElem = allElements.find(e => e.id === selectedElementId);",
  "const selectedElem = allElements.find(e => e.id === selectedElementIds[0]);"
);

code = code.replace(
  "}, [selectedElementId, doc.pages]);",
  "}, [selectedElementIds, doc.pages]);"
);

// handleSelectElement
code = code.replace(
  "const handleSelectElement = (id: string | null) => {",
  "const handleSelectElement = (ids: string | string[] | null) => {"
);

code = code.replace(
  "setSelectedElementId(id);",
  "if (!ids) { setSelectedElementIds([]); return; } const newIds = Array.isArray(ids) ? ids : [ids]; setSelectedElementIds(newIds);"
);

code = code.replace(
  "if (id && doc?.pages) {",
  "if (newIds.length === 1 && doc?.pages) { const id = newIds[0];"
);

// Tool settings apply to all selected elements
code = code.replace(
  "if (selectedElementId && currentPage?.elements) {",
  "if (selectedElementIds.length > 0 && currentPage?.elements) {"
);

code = code.replace(
  "const selectedElem = currentPage.elements.find((el) => el.id === selectedElementId);",
  "for (const selectedId of selectedElementIds) { const selectedElem = currentPage.elements.find((el) => el.id === selectedId);"
);

// close the loop around update logic
code = code.replace(
  "pushDocChange({ ...doc, pages: updatedPages });\n      }\n    }",
  "pushDocChange({ ...doc, pages: updatedPages });\n      }\n    } }"
);

// handle delete
code = code.replace(
  "if (selectedElementId && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {\n          handleDeleteElement(selectedElementId);",
  "if (selectedElementIds.length > 0 && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {\n          selectedElementIds.forEach(id => handleDeleteElement(id));"
);

code = code.replace(
  "}, [historyIndex, history, selectedElementId]);",
  "}, [historyIndex, history, selectedElementIds]);"
);

code = code.replace(
  "selectedElementId={selectedElementId}",
  "selectedElementIds={selectedElementIds}"
);

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
