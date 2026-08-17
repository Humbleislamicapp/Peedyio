import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

active_old = """  const [activePanel, setActivePanel] = useState<string>(initialMode);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');"""

active_new = """  const [activePanel, setActivePanel] = useState<string>(initialMode);
  const [activeTool, setActiveTool] = useState<AnnotationTool>(() => {
    if (initialMode === 'review') return 'comment';
    if (initialMode === 'fill') return 'text';
    if (initialMode === 'sign') return 'sign';
    return 'select';
  });"""

code = code.replace(active_old, active_new)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

