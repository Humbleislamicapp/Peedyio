const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const regex = /\{\/\*\s*Text Element\s*\*\/\}\s*\{elem\.type === 'text' && \([\s\S]*?\}\)><\/div>\s*\)\}/g;

code = code.replace(regex, "{/* Text Element */}\n              {elem.type === 'text' && (\n                <EditableTextElement\n                  elem={elem}\n                  isSelected={isSelected}\n                  scale={scale}\n                  onUpdateElement={onUpdateElement}\n                  onSelectElement={onSelectElement}\n                />\n              )}");

// just in case my regex is off (due to the ></div>)
code = code.replace(/\{\/\*\s*Text Element\s*\*\/\}\s*\{elem\.type === 'text' && \([\s\S]*?dangerouslySetInnerHTML=\{\{ __html: elem\.text \}\}\s*><\/div>\s*\)\}/g, "{/* Text Element */}\n              {elem.type === 'text' && (\n                <EditableTextElement\n                  elem={elem}\n                  isSelected={isSelected}\n                  scale={scale}\n                  onUpdateElement={onUpdateElement}\n                  onSelectElement={onSelectElement}\n                />\n              )}");

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
