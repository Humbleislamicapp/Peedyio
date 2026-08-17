import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

# Add MoreVertical to lucide imports
code = re.sub(r"import\s*\{\s*(.*?)\s*\}\s*from\s*'lucide-react';", lambda m: "import { " + m.group(1) + ", MoreVertical, ShieldCheck } from 'lucide-react';" if "MoreVertical" not in m.group(1) else m.group(0), code)

# Add onProtectDocument to props
code = code.replace("onOpenExportModal: (doc?: PDFDocumentModel) => void;", "onOpenExportModal: (doc?: PDFDocumentModel) => void;\n  onProtectDocument?: () => void;")
code = code.replace("onOpenExportModal,", "onOpenExportModal,\n  onProtectDocument,")

# Add state for dropdown
code = code.replace("const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');", "const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');\n  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);")

# Update Right side of header
old_right = """        {/* Right: Export & Download */}
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

new_right = """        {/* Right: Export & Download */}
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
          
          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (onProtectDocument) onProtectDocument();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    Protect & Sign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>"""

code = code.replace(old_right, new_right)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

