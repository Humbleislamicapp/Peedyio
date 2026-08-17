with open('src/components/editor/EditorToolsSidebar.tsx', 'r') as f:
    code = f.read()

# Make sure all icons are imported
imports_to_add = ['MousePointer', 'Type', 'Image as ImageIcon', 'Square', 'Highlighter', 'PenTool', 'MessageSquare', 'Stamp', 'CheckCircle2']

import_lines = []
for line in code.split('\\n'):
    if 'from \\'lucide-react\\'' in line or 'from "lucide-react"' in line:
        pass # Not dealing with multi-line easily

# Better to just use regex to replace the lucide-react import block with a comprehensive one
import re
match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', code)
if match:
    existing_imports = match.group(1).replace('\\n', ' ').split(',')
    existing_imports = [i.strip() for i in existing_imports if i.strip()]
    
    needed = ['MousePointer', 'Type', 'Image as ImageIcon', 'Square', 'Highlighter', 'PenTool', 'MessageSquare', 'Stamp', 'CheckCircle2']
    for n in needed:
        if n not in existing_imports and n.split(' as ')[0] not in existing_imports:
            existing_imports.append(n)
            
    new_import = "import { " + ", ".join(existing_imports) + " } from 'lucide-react';"
    code = code[:match.start()] + new_import + code[match.end():]
    
    with open('src/components/editor/EditorToolsSidebar.tsx', 'w') as f:
        f.write(code)

