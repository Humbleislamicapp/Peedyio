const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

code = code.replace(
  "onKeyDown={(e) => e.stopPropagation()}\\n                  onInput={(e) => {\\n                    // Optionally save to a ref or directly mutate elem.text to avoid losing it\\n                    // Mutating elem is anti-pattern but works if we just want to stash it for onBlur\\n                    e.currentTarget.setAttribute('data-latest-text', e.currentTarget.innerHTML);\\n                  }}",
  "onKeyDown={(e) => e.stopPropagation()}"
);

code = code.replace(
  "text: e.currentTarget.getAttribute('data-latest-text') || e.currentTarget.innerHTML || 'Type text here...', // use innerHTML for rich text",
  "text: e.currentTarget.innerHTML || 'Type text here...',"
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
