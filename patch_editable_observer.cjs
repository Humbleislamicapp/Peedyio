const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const replacement = `
  React.useEffect(() => {
    if (domRef.current && elem.text !== textRef.current) {
      domRef.current.innerHTML = elem.text;
      textRef.current = elem.text;
    }
  }, [elem.text]);

  React.useEffect(() => {
    if (!domRef.current) return;
    const observer = new MutationObserver(() => {
      if (domRef.current) {
        textRef.current = domRef.current.innerHTML;
      }
    });
    observer.observe(domRef.current, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);
`;

code = code.replace(
  "  // Sync prop changes if they come from outside\\n  React.useEffect(() => {\\n    if (domRef.current && elem.text !== textRef.current) {\\n      domRef.current.innerHTML = elem.text;\\n      textRef.current = elem.text;\\n    }\\n  }, [elem.text]);",
  replacement
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
