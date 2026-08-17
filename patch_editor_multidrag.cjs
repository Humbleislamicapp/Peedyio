const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

code = code.replace(
  "const handleUpdateElement = (updatedElem: PageElement) => {",
  `const handleUpdateElements = (updatedElems: PageElement[]) => {
    if (!doc?.pages || !currentPage) return;
    const newPages = [...doc.pages];
    newPages[currentPageIndex] = {
      ...currentPage,
      elements: (currentPage.elements || []).map((el) => {
        const match = updatedElems.find(u => u.id === el.id);
        return match ? match : el;
      }),
    };
    pushDocChange({ ...doc, pages: newPages });
  };

  const handleUpdateElement = (updatedElem: PageElement) => {`
);

code = code.replace(
  "onUpdateElement={(updatedElement) => {",
  "onUpdateElements={handleUpdateElements}\n                onUpdateElement={(updatedElement) => {"
);

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
