import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

canvas_old = """              <PdfCanvas
                page={page}
                zoom={zoom}"""

canvas_new = """              <PdfCanvas
                document={doc}
                page={page}
                zoom={zoom}"""

code = code.replace(canvas_old, canvas_new)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

