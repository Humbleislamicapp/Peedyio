const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');

const oldStr = `                onDeleteElement={(id) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.filter(e => e.id !== id)
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}`;

const newStr = `                onDeleteElement={(id) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.filter(e => e.id !== id)
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}
                onDeleteElements={(ids) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.filter(e => !ids.includes(e.id))
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
