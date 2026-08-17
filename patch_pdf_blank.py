import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

blank_old = """    const blankPage: PDFPageModel = {
      pageNumber: pagesCount + 1,
      rotation: 0,"""

blank_new = """    const blankPage: PDFPageModel = {
      pageNumber: pagesCount + 1,
      isBlank: true,
      rotation: 0,"""

code = code.replace(blank_old, blank_new)
with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

effect_old = """      if (!document?.rawBytes || !pdfCanvasRef.current) return;
      
      try {"""

effect_new = """      if (!document?.rawBytes || !pdfCanvasRef.current || page.isBlank) return;
      
      try {"""

code = code.replace(effect_old, effect_new)

# Hide the canvas if it's a blank page
render_old = """        {/* Actual PDF rendering layer */}
        <canvas
          ref={pdfCanvasRef}"""

render_new = """        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <canvas
            ref={pdfCanvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
          />
        )}"""
code = code.replace(render_old, render_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

