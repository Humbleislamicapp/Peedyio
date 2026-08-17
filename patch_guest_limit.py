import re

with open('src/components/modals/ExportModal.tsx', 'r') as f:
    code = f.read()

body_top_old = """export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const { currentUser, usageLimit, incrementExportCount, signInWithGoogle } = useAuth();
  const [fileName, setFileName] = useState(doc.name);"""

body_top_new = """export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const { currentUser, usageLimit, incrementExportCount, signInWithGoogle } = useAuth();
  const [fileName, setFileName] = useState(doc.name);
  
  // Guest limit tracking
  const [guestCount, setGuestCount] = useState(() => {
    return parseInt(localStorage.getItem('guestExports') || '0', 10);
  });"""

code = code.replace(body_top_old, body_top_new)

export_old = """      if (currentUser) {
        await incrementExportCount();
      }
      
      setIsExporting(false);
      onClose();"""

export_new = """      if (currentUser) {
        await incrementExportCount();
      } else {
        const newCount = guestCount + 1;
        setGuestCount(newCount);
        localStorage.setItem('guestExports', newCount.toString());
      }
      
      setIsExporting(false);
      onClose();"""

code = code.replace(export_old, export_new)

footer_old = """          <div className="flex-1">
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
              disabled={isExporting || (currentUser ? (usageLimit?.exportsCount || 0) >= 5 : false)}"""

footer_new = """          <div className="flex-1">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-zinc-600">Guest Exports:</span>
                <span className={`text-[11px] font-bold ${guestCount >= 2 ? 'text-rose-600' : 'text-zinc-800'}`}>
                  {guestCount} / 2 used
                </span>
              </div>
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
            
            {!currentUser && guestCount >= 2 ? (
              <button
                onClick={async () => { await signInWithGoogle(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in to continue
              </button>
            ) : null}

            <button
              onClick={handleExport}
              disabled={isExporting || (currentUser ? (usageLimit?.exportsCount || 0) >= 5 : guestCount >= 2)}"""

code = code.replace(footer_old, footer_new)

with open('src/components/modals/ExportModal.tsx', 'w') as f:
    f.write(code)

