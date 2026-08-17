import React, { useState, useRef } from 'react';
import {
  PenTool,
  Type,
  Upload,
  RotateCcw,
  CheckCircle2,
  Download,
  ArrowLeft,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel, PageElement } from '../../types/pdf';
import { generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';

interface SignToolProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
}

export const SignTool: React.FC<SignToolProps> = ({
  document: doc,
  onBack,
  onOpenInEditor,
}) => {
  const [signTab, setSignTab] = useState<'type' | 'draw' | 'upload'>('type');
  const [typedName, setTypedName] = useState('Alex Mercer');
  const [selectedFont, setSelectedFont] = useState<'greatvibes' | 'caveat'>('greatvibes');
  const [isSigned, setIsSigned] = useState(false);
  const [signedDoc, setSignedDoc] = useState<PDFDocumentModel | null>(null);

  // Drawing canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleApplySignature = () => {
    if (!doc?.pages || doc.pages.length === 0) return;
    // Stamp signature on the last page of the document
    const lastPageIndex = (doc.pages.length || 1) - 1;
    const lastPage = doc.pages[lastPageIndex];
    if (!lastPage) return;

    const sigElement: PageElement = {
      id: `sig_applied_${Date.now()}`,
      type: 'signature',
      x: 15,
      y: 75,
      width: 32,
      height: 12,
      signatureDataUrl: signTab === 'draw' && canvasRef.current ? canvasRef.current.toDataURL() : '',
      signerName: typedName || 'Authorized Signatory',
      dateString: new Date().toISOString().split('T')[0],
      signatureStyle: signTab === 'draw' ? 'drawn' : 'typed',
    };

    const newPages = [...doc.pages];
    newPages[lastPageIndex] = {
      ...lastPage,
      elements: [...(lastPage.elements || []), sigElement],
    };

    const newDoc: PDFDocumentModel = {
      ...doc,
      id: `signed_${Date.now()}`,
      name: `${doc.name.replace('.pdf', '')}_Signed.pdf`,
      lastModified: 'Just now',
      pages: newPages,
      tags: ['Signed'],
    };

    setSignedDoc(newDoc);
    setIsSigned(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
    });
  };

  const handleDownload = async () => {
    if (!signedDoc) return;
    try {
      const bytes = await generateBinaryPdf(signedDoc);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, signedDoc.name);
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
          <PenTool className="w-3.5 h-3.5 text-blue-600" />
          <span>E-Sign Solution</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Sign Your PDF
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create and stamp a verifiable digital signature on <span className="font-semibold text-slate-800">{doc.name}</span>.
        </p>
      </div>

      {isSigned && signedDoc ? (
        /* Signed Result */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Document Signed!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Signature stamped on Page {signedDoc?.pages?.length || 1} with timestamp audit metadata.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed PDF</span>
            </button>

            <button
              onClick={() => onOpenInEditor(signedDoc)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Review in Editor</span>
            </button>
          </div>
        </div>
      ) : (
        /* Sign Creation Card */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
          {/* Method Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSignTab('type')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                signTab === 'type' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Type</span>
            </button>
            <button
              onClick={() => setSignTab('draw')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                signTab === 'draw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => setSignTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                signTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

          {/* Type Signature */}
          {signTab === 'type' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Calligraphy Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedFont('greatvibes')}
                    className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      selectedFont === 'greatvibes'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="font-signature-greatvibes text-2xl text-slate-900 truncate">
                      {typedName || 'Your Signature'}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Classic Script</span>
                  </button>

                  <button
                    onClick={() => setSelectedFont('caveat')}
                    className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      selectedFont === 'caveat'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="font-signature-caveat text-2xl text-slate-900 truncate">
                      {typedName || 'Your Signature'}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Modern Cursive</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Draw Signature */}
          {signTab === 'draw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Draw in the box</label>
                <button
                  onClick={handleClearCanvas}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-1">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-36 bg-white rounded-lg cursor-crosshair touch-none"
                />
              </div>
            </div>
          )}

          {/* Upload Signature */}
          {signTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 mb-1">
                Upload transparent signature image
              </p>
              <p className="text-[11px] text-slate-400 mb-4">PNG or JPG with light background</p>
              <label className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer">
                <span>Browse File</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          )}

          {/* Stamping details */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date: {new Date().toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Target: Page {doc?.pages?.length || 1}
            </span>
          </div>

          <button
            onClick={handleApplySignature}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Signed PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default SignTool;
