const fs = require('fs');
let code = fs.readFileSync('src/components/editor/FloatingToolbar.tsx', 'utf8');

// Add preventDefault on buttons in toolbar to preserve text selection
// We'll just replace `onClick={` with `onMouseDown={(e) => e.preventDefault()} onClick={` for the specific formatting buttons.
code = code.replace(
  "onClick={() => onUpdateToolSettings({ fontWeight: toolSettings.fontWeight === 'bold' ? 'normal' : 'bold' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ fontWeight: toolSettings.fontWeight === 'bold' ? 'normal' : 'bold' })}"
);

code = code.replace(
  "onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'underline' ? 'none' : 'underline' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'underline' ? 'none' : 'underline' })}"
);

code = code.replace(
  "onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'line-through' ? 'none' : 'line-through' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'line-through' ? 'none' : 'line-through' })}"
);

code = code.replace(
  "onClick={() => onUpdateToolSettings({ textAlign: 'left' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textAlign: 'left' })}"
);

code = code.replace(
  "onClick={() => onUpdateToolSettings({ textAlign: 'center' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textAlign: 'center' })}"
);

code = code.replace(
  "onClick={() => onUpdateToolSettings({ textAlign: 'right' })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textAlign: 'right' })}"
);

// We need to do it for colors too, but color is a list of buttons
code = code.replace(
  "onClick={() => onUpdateToolSettings({ textColor: c })}",
  "onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textColor: c })}"
);

fs.writeFileSync('src/components/editor/FloatingToolbar.tsx', code);
