const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "text: e.currentTarget.innerText || 'Type text here...',",
  "text: e.currentTarget.innerHTML || 'Type text here...', // use innerHTML for rich text"
);

code = code.replace(
  ">\\n                  {elem.text}\\n                </div>",
  " dangerouslySetInnerHTML={{ __html: elem.text }} />"
);

// Fallback in case of formatting mismatch
code = code.replace(
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5\"\n                >\n                  {elem.text}",
  "className=\"w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5\"\n                  dangerouslySetInnerHTML={{ __html: elem.text }}"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
