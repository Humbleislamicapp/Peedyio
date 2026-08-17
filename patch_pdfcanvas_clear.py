import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

target = """    const renderPdf = async () => {
      if (!document?.rawBytes || !pdfCanvasRef.current || page.isBlank) return;"""

replacement = """    const renderPdf = async () => {
      if (!document?.rawBytes || !pdfCanvasRef.current || page.isBlank) {
        if (pdfCanvasRef.current) {
          const ctx = pdfCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, pdfCanvasRef.current.width, pdfCanvasRef.current.height);
          }
        }
        return;
      }"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

