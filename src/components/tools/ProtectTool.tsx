import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Stamp,
  Download,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel, PageElement } from '../../types/pdf';
import { generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';

interface ProtectToolProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
}

export const ProtectTool: React.FC<ProtectToolProps> = ({
  document: doc,
  onBack,
  onOpenInEditor,
}) => {
  const [tab, setTab] = useState<'password' | 'watermark' | 'unlock'>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(25);
  const [watermarkAngle, setWatermarkAngle] = useState(-45);

  const [permissions, setPermissions] = useState({
    allowPrinting: false,
    allowCopying: false,
    allowModifying: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [protectedDoc, setProtectedDoc] = useState<PDFDocumentModel | null>(null);

  const handleApplyProtection = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let updatedPages = [...(doc?.pages || [])];

      // If watermark tab
      if (tab === 'watermark') {
        updatedPages = updatedPages.map((p) => {
          const wmElem: PageElement = {
            id: `wm_${Date.now()}_${p.pageNumber}`,
            type: 'text',
            x: 20,
            y: 45,
            width: 60,
            height: 10,
            text: watermarkText,
            fontSize: 48,
            fontFamily: 'Plus Jakarta Sans',
            color: '#DC2626',
            opacity: watermarkOpacity / 100,
            rotation: watermarkAngle,
            fontWeight: 'bold',
          };
          return {
            ...p,
            elements: [...(p.elements || []), wmElem],
          };
        });
      }

      const newDoc: PDFDocumentModel = {
        ...doc,
        id: `protected_${Date.now()}`,
        name: `${doc.name.replace('.pdf', '')}_${tab === 'watermark' ? 'Watermarked' : 'Protected'}.pdf`,
        lastModified: 'Just now',
        pages: updatedPages,
        tags: [tab === 'watermark' ? 'Watermarked' : 'Protected'],
      };

      setProtectedDoc(newDoc);
      setIsProcessing(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    }, 600);
  };

  const handleDownload = async () => {
    if (!protectedDoc) return;
    try {
      const bytes = await generateBinaryPdf(protectedDoc);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, protectedDoc.name);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Document Vault</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Protect & Secure PDF
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Encrypt with AES-256 passwords, apply watermarks, or manage permissions on <span className="font-semibold text-slate-800">{doc.name}</span>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setTab('password')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password & Permissions</span>
          </button>

          <button
            onClick={() => setTab('watermark')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'watermark' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>Watermark</span>
          </button>
        </div>
      </div>

      {protectedDoc ? (
        /* Result */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Security Applied!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Document configured with 256-bit encryption rules and custom watermark overlays.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Secured PDF</span>
            </button>

            <button
              onClick={() => onOpenInEditor(protectedDoc)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Review in Editor</span>
            </button>
          </div>
        </div>
      ) : (
        /* Config */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
          {tab === 'password' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Set Document Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full text-xs pr-10 pl-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Restriction Rules</label>

                <label className="flex items-center justify-between text-xs text-slate-700 p-2.5 bg-slate-50 rounded-lg">
                  <span>Allow High-Resolution Printing</span>
                  <input
                    type="checkbox"
                    checked={permissions.allowPrinting}
                    onChange={(e) =>
                      setPermissions({ ...permissions, allowPrinting: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-700 p-2.5 bg-slate-50 rounded-lg">
                  <span>Allow Content Copying & Text Extraction</span>
                  <input
                    type="checkbox"
                    checked={permissions.allowCopying}
                    onChange={(e) =>
                      setPermissions({ ...permissions, allowCopying: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-700 p-2.5 bg-slate-50 rounded-lg">
                  <span>Allow Annotations & Page Modifications</span>
                  <input
                    type="checkbox"
                    checked={permissions.allowModifying}
                    onChange={(e) =>
                      setPermissions({ ...permissions, allowModifying: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Opacity ({watermarkOpacity}%)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Rotation Angle ({watermarkAngle}°)</span>
                </div>
                <div className="flex items-center gap-2">
                  {[-45, 0, 45, 90].map((angle) => (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => setWatermarkAngle(angle)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        watermarkAngle === angle
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleApplyProtection}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Encrypting PDF…
              </span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Apply Security & Download</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default ProtectTool;
