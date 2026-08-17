import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

bad_code = """        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <canvas
            ref={pdfCanvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
          />
        )}
          className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
        />"""

good_code = """        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <canvas
            ref={pdfCanvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
          />
        )}"""

code = code.replace(bad_code, good_code)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

