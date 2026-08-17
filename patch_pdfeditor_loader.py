import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

target = """    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden select-none">"""

replacement = """    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden select-none">
      {isMakingEditable && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4 shadow-sm" />
          <h3 className="text-xl font-bold text-slate-800">Making Document Editable...</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-sm text-center">
            Extracting text elements and rebuilding layout. Depending on the document size, this may take a moment.
          </p>
        </div>
      )}"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

