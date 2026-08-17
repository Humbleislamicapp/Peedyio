const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

const execCommandLogic = `const handleUpdateToolSettings = (newSettings: Partial<typeof toolSettings>) => {
    // Intercept if there's a selection inside a contenteditable
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && document.activeElement?.getAttribute('contenteditable') === 'true') {
      if (newSettings.fontWeight) {
        document.execCommand('bold', false);
      }
      if (newSettings.textDecoration === 'underline') {
        document.execCommand('underline', false);
      }
      if (newSettings.textDecoration === 'line-through') {
        document.execCommand('strikeThrough', false);
      }
      if (newSettings.textColor) {
        document.execCommand('foreColor', false, newSettings.textColor);
      }
      if (newSettings.textAlign) {
        let align = newSettings.textAlign;
        if (align === 'left') document.execCommand('justifyLeft', false);
        if (align === 'center') document.execCommand('justifyCenter', false);
        if (align === 'right') document.execCommand('justifyRight', false);
      }
      // Force update of the element's text property since onBlur might not catch programmatic changes immediately
      const activeEl = document.activeElement as HTMLElement;
      if (selectedElementIds.length === 1 && currentPage?.elements) {
        const selectedElem = currentPage.elements.find(el => el.id === selectedElementIds[0]);
        if (selectedElem) {
          handleUpdateElement({ ...selectedElem, text: activeEl.innerHTML });
        }
      }
      setToolSettings((prev) => ({ ...prev, ...newSettings }));
      return;
    }

    setToolSettings((prev) => ({ ...prev, ...newSettings }));`;

code = code.replace(
  "const handleUpdateToolSettings = (newSettings: Partial<typeof toolSettings>) => {\n    setToolSettings((prev) => ({ ...prev, ...newSettings }));",
  execCommandLogic
);

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
