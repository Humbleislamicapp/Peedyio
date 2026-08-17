import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

target = """          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Options</span>
          </button>"""

replacement = """          <button
            onClick={() => onOpenExportModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Options</span>
          </button>"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

