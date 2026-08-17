const fs = require('fs');
let code = fs.readFileSync('src/components/editor/PdfEditor.tsx', 'utf8');
code = code.replace(
  "        if (changed) {\n          handleUpdateElement(updated);\n        }\n      }\n    }\n  };",
  "        if (changed) {\n          handleUpdateElement(updated);\n        }\n      }\n    } }\n  };"
);
fs.writeFileSync('src/components/editor/PdfEditor.tsx', code);
