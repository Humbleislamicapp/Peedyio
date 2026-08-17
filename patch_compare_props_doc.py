import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

code = code.replace("  initialDocs?: PDFDocumentModel[];", "  initialDocs?: PDFDocumentModel[];\n  document?: PDFDocumentModel;")

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

