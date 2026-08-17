import React, { useState } from 'react';
import {
  X,
  Download,
  Lock,
  Zap,
  CheckCircle2,
  Minimize2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { generateBinaryPdf, downloadBlob, formatBytes } from '../../utils/pdfEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PDFDocumentModel;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const { currentUser, usageLimit, incrementExportCount, signInWithGoogle } = useAuth();
  const [fileName, setFileName] = useState(() => {
    let name = doc.name;
    if (!name.includes('_copy')) {
      name = name.replace('.pdf', '') + '_copy.pdf';
    }
    return name;
  });
  
  React.useEffect(() => {
    if (isOpen) {
      let name = doc.name;
      if (!name.includes('_copy')) {
        name = name.replace('.pdf', '') + '_copy.pdf';
      }
      setFileName(name);
    }
  }, [isOpen, doc.name]);
  
  // Guest limit tracking
  const [guestCount, setGuestCount] = useState(() => {
    return parseInt(localStorage.getItem('guestExports') || '0', 10);
  });
  const [isExporting, setIsExporting] = useState(false);
  const [password, setPassword] = useState('');
  
  // Settings
  const [isFormatTxt, setIsFormatTxt] = useState(false);
  
  const [enableCompression, setEnableCompression] = useState(false);
  const [compressionPreset, setCompressionPreset] = useState<'smaller' | 'balanced' | 'best'>('balanced');
  
  const [enablePassword, setEnablePassword] = useState(false);
  if (!isOpen) return null;

  let estimatedSize = doc.size;
  if (isFormatTxt) {
    estimatedSize = 2400; // rough estimate
  } else if (enableCompression) {
    if (compressionPreset === 'smaller') estimatedSize = Math.round(doc.size * 0.3);
    else if (compressionPreset === 'balanced') estimatedSize = Math.round(doc.size * 0.5);
    else estimatedSize = Math.round(doc.size * 0.8);
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (isFormatTxt) {
        const textLines = (doc?.pages || [])
          .map((p, i) => `=== PAGE ${i + 1} ===\n` + (p.elements || []).filter((e) => e.type === 'text').map((e) => (e as any).text).join('\n'))
          .join('\n\n');
        const blob = new Blob([textLines], { type: 'text/plain;charset=utf-8' });
        downloadBlob(blob, fileName.endsWith('.txt') ? fileName : `${fileName.replace('.pdf', '')}.txt`);
      } else {
        const bytes = await generateBinaryPdf(doc, password);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const nameToSave = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        downloadBlob(blob, nameToSave);
      }
      
      if (currentUser) {
        await incrementExportCount();
      } else {
        const newCount = guestCount + 1;
        setGuestCount(newCount);
        localStorage.setItem('guestExports', newCount.toString());
      }
      
      setIsExporting(false);
      onClose();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Export Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* File Name Field */}
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium text-zinc-900"
            />
          </div>

          {/* Core Format */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsFormatTxt(false)}
              className={`flex-1 p-3 rounded-xl border text-left transition-all ${!isFormatTxt ? 'border-zinc-900 bg-zinc-50/90 shadow-2xs' : 'border-zinc-200 hover:border-zinc-300'}`}
            >
              <p className="text-xs font-bold text-zinc-900">PDF Document</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Standard PDF format</p>
            </button>
            <button
              onClick={() => setIsFormatTxt(true)}
              className={`flex-1 p-3 rounded-xl border text-left transition-all ${isFormatTxt ? 'border-zinc-900 bg-zinc-50/90 shadow-2xs' : 'border-zinc-200 hover:border-zinc-300'}`}
            >
              <p className="text-xs font-bold text-zinc-900">Plain Text</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Extracted text only</p>
            </button>
          </div>

          {/* Optimize / Compress (Only for PDF) */}
          {!isFormatTxt && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setEnableCompression(!enableCompression)}>
                <div className="flex items-center gap-2">
                  <Minimize2 className="w-4 h-4 text-zinc-600" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Reduce file size</p>
                    <p className="text-[10px] text-zinc-500">Optimize for web and email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableCompression}
                  onChange={(e) => setEnableCompression(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                />
              </div>

              {enableCompression && (
                <div className="pt-3 border-t border-zinc-200/60 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex bg-white rounded-lg border border-zinc-200 p-1">
                    <button
                      onClick={() => setCompressionPreset('smaller')}
                      className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md transition-colors ${compressionPreset === 'smaller' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      Smaller file
                    </button>
                    <button
                      onClick={() => setCompressionPreset('balanced')}
                      className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md transition-colors ${compressionPreset === 'balanced' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      Balanced
                    </button>
                    <button
                      onClick={() => setCompressionPreset('best')}
                      className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md transition-colors ${compressionPreset === 'best' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      Best quality
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-[11px] text-zinc-500">Live preview</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 line-through">{formatBytes(doc.size)}</span>
                      <span className="text-xs font-bold text-emerald-600">~{formatBytes(estimatedSize)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password Protection */}
          {!isFormatTxt && (
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password Protection
              </label>
              <input
                type="text"
                placeholder="Leave blank for no password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium text-zinc-900"
              />
            </div>
          )}

          {/* Summary / Original Size */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
            <span>Estimated output size:</span>
            <span className="font-bold text-zinc-900">
              {formatBytes(estimatedSize)} ({doc?.pages?.length || 1} {(doc?.pages?.length || 1) === 1 ? 'page' : 'pages'})
            </span>
          </div>
        </div>

        {/* Footer & Usage */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex-1">
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
              disabled={isExporting || (currentUser ? (usageLimit?.exportsCount || 0) >= 5 : guestCount >= 2)}
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
        </div>
      </div>
    </div>
  );
};
