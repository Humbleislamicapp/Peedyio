import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

# Add imports for pdfjs
import_old = "import { PDFDocumentModel } from '../../types/pdf';"
import_new = """import { PDFDocumentModel } from '../../types/pdf';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();"""
code = code.replace(import_old, import_new)

# Add ref and state
state_old = "  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);"
state_new = """  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfRenderError, setPdfRenderError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isRendering, setIsRendering] = useState(false);"""
code = code.replace(state_old, state_new)

# Add rendering effect
effect_insert = """  // Handle PDF rendering
  useEffect(() => {
    let active = true;
    const renderPdf = async () => {
      if (!document?.rawBytes || !pdfCanvasRef.current) return;
      
      try {
        setIsRendering(true);
        setPdfRenderError(null);
        
        const loadingTask = pdfjsLib.getDocument({ data: document.rawBytes });
        
        // Handle password protected PDFs
        loadingTask.onPassword = (updatePassword, reason) => {
          if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
            setPdfRenderError("This PDF is password protected. Enter password to view.");
            setIsPasswordProtected(true);
            // We can't render it currently without a password UI, so we just abort
          }
        };

        const pdf = await loadingTask.promise;
        
        if (!active) return;
        
        // PDF.js pages are 1-indexed
        const pdfPage = await pdf.getPage(page.pageNumber);
        
        if (!active) return;
        
        const viewport = pdfPage.getViewport({ scale: zoom / 100 });
        const canvas = pdfCanvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // We match our canvas to the actual viewport size (at 1x) to ensure pixel accuracy
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        canvas.width = baseViewport.width;
        canvas.height = baseViewport.height;
        
        // Scale context up to zoom level
        // Actually, if our container handles the zoom via CSS, we just render the canvas at 1x resolution.
        // Wait, for crispness we might want to render at scale and let CSS size it down.
        // For simplicity and matching standard viewers, we'll render at standard scale.
        // Or better: render at scale * window.devicePixelRatio for crispness
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = baseViewport.width * pixelRatio;
        canvas.height = baseViewport.height * pixelRatio;
        
        const renderContext = {
          canvasContext: context,
          viewport: pdfPage.getViewport({ scale: pixelRatio }),
        };
        
        await pdfPage.render(renderContext).promise;
        
      } catch (err: any) {
        console.error('Error rendering PDF page:', err);
        if (err.name === 'PasswordException') {
            setPdfRenderError("This PDF is password protected.");
            setIsPasswordProtected(true);
        } else if (err.name === 'MissingPDFException') {
            setPdfRenderError("Invalid or missing PDF data.");
        } else {
            // Check for missing font error
            if (err.message?.includes('font')) {
               setPdfRenderError("Some fonts in this document aren't available — text may appear in a substitute font.");
               // It might still render partially, so we don't block
            } else {
               setPdfRenderError("Failed to render PDF page. " + (err.message || ''));
            }
        }
      } finally {
        if (active) setIsRendering(false);
      }
    };
    
    renderPdf();
    
    return () => { active = false; };
  }, [document?.rawBytes, page.pageNumber, zoom]);

"""

# Insert effect just before `const handleCanvasMouseDown =`
code = code.replace("  const handleCanvasMouseDown =", effect_insert + "  const handleCanvasMouseDown =")

# Insert canvas in render
canvas_old = """      >
        {/* Drawing Overlay Canvas for Pen */}"""
canvas_new = """      >
        {/* Actual PDF rendering layer */}
        <canvas
          ref={pdfCanvasRef}
          className="absolute inset-0 z-0 pointer-events-none w-full h-full object-contain"
        />
        
        {/* Password or Error Overlay */}
        {pdfRenderError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm text-center border border-slate-200">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
               </div>
               <h3 className="font-bold text-slate-800 mb-2">{isPasswordProtected ? 'Password Protected' : 'Rendering Error'}</h3>
               <p className="text-sm text-slate-500">{pdfRenderError}</p>
            </div>
          </div>
        )}

        {/* Drawing Overlay Canvas for Pen */}"""
code = code.replace(canvas_old, canvas_new)

# Wait! The text elements in sample PDFs will overlap with actual PDF rendered text if `rawBytes` are provided?
# The PDF `rawBytes` are only provided for uploaded files. Uploaded files currently generate DUMMY text elements.
# If we have `rawBytes`, we should render the PDF. But wait, if `document.rawBytes` exists, we should probably hide the dummy "Imported PDF content layer" text elements so they don't overlap.
# Let's hide text elements that are `isOriginal` if we have rawBytes!
# Or better, we can filter them in the render loop.

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

