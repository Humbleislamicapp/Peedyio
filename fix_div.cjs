const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5\"\n                  dangerouslySetInnerHTML={{ __html: elem.text }}\n                </div>",
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5\"\n                  dangerouslySetInnerHTML={{ __html: elem.text }}\n                ></div>"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
