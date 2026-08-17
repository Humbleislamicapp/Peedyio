const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfCanvas.tsx', 'utf8');

const editableComponent = `
const EditableTextElement = ({ elem, isSelected, scale, onUpdateElement, onSelectElement }: any) => {
  const textRef = React.useRef(elem.text);
  const domRef = React.useRef<HTMLDivElement>(null);

  // Sync prop changes if they come from outside
  React.useEffect(() => {
    if (domRef.current && elem.text !== textRef.current) {
      domRef.current.innerHTML = elem.text;
      textRef.current = elem.text;
    }
  }, [elem.text]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    textRef.current = e.currentTarget.innerHTML;
  };

  const handleBlur = () => {
    onUpdateElement({
      ...elem,
      text: textRef.current || 'Type text here...',
    });
  };

  return (
    <div
      ref={(el) => {
        domRef.current = el;
        if (el && isSelected && window.document.activeElement !== el && !el.dataset.autofocused && elem.text === 'Type text here...') {
          el.dataset.autofocused = 'true';
          el.focus();
          const range = window.document.createRange();
          const sel = window.getSelection();
          if (el.childNodes.length > 0) {
            range.selectNodeContents(el);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        fontSize: \`\${(elem.fontSize || 13) * scale}px\`,
        fontFamily: elem.fontFamily || 'Helvetica Neue',
        color: elem.color || '#111827',
        fontWeight: elem.fontWeight || 'normal',
        textAlign: elem.textAlign || 'left',
        textDecoration: elem.textDecoration || 'none',
        lineHeight: 1.4,
      }}
      className="w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5"
      dangerouslySetInnerHTML={{ __html: textRef.current }}
    />
  );
};
`;

code = code.replace(
  "import React, { useState, useRef, useEffect } from 'react';",
  "import React, { useState, useRef, useEffect } from 'react';\n" + editableComponent
);

fs.writeFileSync('src/components/editor/PdfCanvas.tsx', code);
