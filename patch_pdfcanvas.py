import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

target = "const loadingTask = pdfjsLib.getDocument({ data: document.rawBytes });"
replacement = "const loadingTask = pdfjsLib.getDocument({ data: document.rawBytes.slice(0) });"

code = code.replace(target, replacement)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

