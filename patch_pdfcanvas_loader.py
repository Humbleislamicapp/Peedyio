import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

target = """        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <canvas
            ref={pdfCanvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
          />
        )}"""

replacement = """        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <>
            {isRendering && document?.rawBytes && (
              <div className="absolute inset-0 z-[1] bg-slate-100/50 animate-pulse flex items-center justify-center pointer-events-none rounded-sm">
                <div className="w-8 h-8 text-slate-300">
                  <svg className="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}
            <canvas
              ref={pdfCanvasRef}
              className={`absolute inset-0 z-0 pointer-events-none w-full h-full object-contain transition-opacity duration-300 ${isRendering && document?.rawBytes ? 'opacity-0' : 'opacity-100'}`}
            />
          </>
        )}"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

