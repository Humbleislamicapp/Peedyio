import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

rc_old = """        const renderContext = {
          canvasContext: context,
          viewport: pdfPage.getViewport({ scale: pixelRatio }),
        };"""

rc_new = """        const renderContext: any = {
          canvasContext: context,
          viewport: pdfPage.getViewport({ scale: pixelRatio }),
        };"""

code = code.replace(rc_old, rc_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

