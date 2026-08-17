import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

overlay_old = """        {/* Password or Error Overlay */}
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
        )}"""

overlay_new = """        {/* Password or Error Overlay */}
        {pdfRenderError && (
          <div className={`absolute ${pdfRenderError.includes('font') ? 'top-4 right-4 z-50 max-w-xs' : 'inset-0 z-10 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm'}`}>
            <div className={`bg-white p-4 rounded-xl shadow-xl text-center border border-slate-200 ${pdfRenderError.includes('font') ? 'flex flex-col items-start text-left' : 'max-w-sm'}`}>
               {!pdfRenderError.includes('font') && (
                 <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
               )}
               <h3 className="font-bold text-slate-800 mb-1">
                 {isPasswordProtected ? 'Password Protected' : (pdfRenderError.includes('font') ? 'Missing Fonts' : 'Rendering Error')}
               </h3>
               <p className={`text-slate-500 ${pdfRenderError.includes('font') ? 'text-xs' : 'text-sm'}`}>{pdfRenderError}</p>
               {pdfRenderError.includes('font') && (
                 <button onClick={() => setPdfRenderError(null)} className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700">Dismiss</button>
               )}
            </div>
          </div>
        )}"""

code = code.replace(overlay_old, overlay_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

