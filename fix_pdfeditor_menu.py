import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

header_right_old = """        {/* Right: Export & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Options</span>
          </button>
          <button
            onClick={handleFastDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>"""

header_right_new = """        {/* Right: Export & Download & More */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export Options</span>
          </button>
          <button
            onClick={handleFastDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors shadow-2xs cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 py-1 text-xs animate-in fade-in zoom-in-95">
              <button 
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  if (onProtectDocument) onProtectDocument();
                }} 
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" /> 
                Protect & Permissions
              </button>
            </div>
          )}
        </div>"""

code = code.replace(header_right_old, header_right_new)

# Make sure MoreVertical and ShieldCheck are imported
if "MoreVertical" not in code:
    code = code.replace("import {", "import { MoreVertical, ShieldCheck,", 1)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

