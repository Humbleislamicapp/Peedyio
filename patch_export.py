import re

with open('src/components/modals/ExportModal.tsx', 'r') as f:
    code = f.read()

import_old = "import { PDFDocumentModel } from '../../types/pdf';"
import_new = """import { PDFDocumentModel } from '../../types/pdf';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';"""
code = code.replace(import_old, import_new)

body_top_old = """export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const [fileName, setFileName] = useState(doc.name);"""

body_top_new = """export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const { currentUser, usageLimit, incrementExportCount, signInWithGoogle } = useAuth();
  const [fileName, setFileName] = useState(doc.name);"""

code = code.replace(body_top_old, body_top_new)

export_old = """      } else {
        const bytes = await generateBinaryPdf(doc);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const nameToSave = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        downloadBlob(blob, nameToSave);
      }
      setIsExporting(false);
      onClose();"""

export_new = """      } else {
        const bytes = await generateBinaryPdf(doc);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const nameToSave = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        downloadBlob(blob, nameToSave);
      }
      
      if (currentUser) {
        await incrementExportCount();
      }
      
      setIsExporting(false);
      onClose();"""

code = code.replace(export_old, export_new)

# Add usage info and block export if over limit
footer_old = """        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isExporting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export & Download</span>
              </>
            )}
          </button>
        </div>"""

footer_new = """        {/* Footer & Usage */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex-1">
            {!currentUser ? (
              <p className="text-[11px] text-zinc-500">
                Sign in to track limits and sync files.
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-zinc-600">Free Exports:</span>
                <span className={`text-[11px] font-bold ${(usageLimit?.exportsCount || 0) >= 5 ? 'text-rose-600' : 'text-zinc-800'}`}>
                  {usageLimit?.exportsCount || 0} / 5 used today
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            
            {!currentUser ? (
              <button
                onClick={async () => { await signInWithGoogle(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : null}

            <button
              onClick={handleExport}
              disabled={isExporting || (currentUser ? (usageLimit?.exportsCount || 0) >= 5 : false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-xs"
            >
              {isExporting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export & Download</span>
                </>
              )}
            </button>
          </div>
        </div>"""

code = code.replace(footer_old, footer_new)

with open('src/components/modals/ExportModal.tsx', 'w') as f:
    f.write(code)

