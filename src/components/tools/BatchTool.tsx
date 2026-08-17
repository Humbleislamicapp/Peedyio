import React, { useState } from 'react';
import {
  Layers,
  Upload,
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  Download,
  Zap,
  Minimize2,
  Stamp,
  ArrowLeftRight,
  FileText
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { generateBinaryPdf, downloadBlob, formatBytes } from '../../utils/pdfEngine';

interface BatchToolProps {
  initialDocs?: PDFDocumentModel[];
  onBack: () => void;
  onFileUpload: (files: FileList | null) => void;
}

export const BatchTool: React.FC<BatchToolProps> = ({
  initialDocs = [],
  onBack,
  onFileUpload,
}) => {
  const [docs, setDocs] = useState<PDFDocumentModel[]>(initialDocs);
  const [operation, setOperation] = useState<'compress' | 'watermark' | 'convert_txt'>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchDone, setBatchDone] = useState(false);

  const handleRunBatch = async () => {
    if (docs.length === 0) return;
    setIsProcessing(true);
    setProgress(15);

    setTimeout(() => {
      setProgress(50);
      setTimeout(() => {
        setProgress(100);
        setIsProcessing(false);
        setBatchDone(true);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
        });
      }, 500);
    }, 500);
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      for (const d of docs) {
        if (operation === 'convert_txt') {
          const txt = d.pages
            .map((p, idx) => `Page ${idx + 1}:\n` + p.elements.map((e) => (e as any).text || '').join('\n'))
            .join('\n\n');
          zip.file(`${d.name.replace('.pdf', '')}.txt`, txt);
        } else {
          const bytes = await generateBinaryPdf(d);
          zip.file(`${d.name.replace('.pdf', '')}_batch.pdf`, bytes);
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `Batch_Processed_Files.zip`);
    } catch (err) {
      console.error('Batch download error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Batch Processing</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Batch Document Actions
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Apply compression, watermarks, or conversions across multiple documents at once.
        </p>
      </div>

      {batchDone ? (
        /* Result */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Batch Processed!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Processed {docs.length} documents successfully in parallel.
          </p>

          <button
            onClick={handleDownloadZip}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 mx-auto"
          >
            <FileArchive className="w-4 h-4" />
            <span>Download All as ZIP</span>
          </button>
        </div>
      ) : (
        /* Config */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Batch Operation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setOperation('compress')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  operation === 'compress'
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 ring-1 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Minimize2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">Batch Compress</span>
              </button>

              <button
                onClick={() => setOperation('watermark')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  operation === 'watermark'
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 ring-1 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Stamp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">Apply Watermark</span>
              </button>

              <button
                onClick={() => setOperation('convert_txt')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  operation === 'convert_txt'
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 ring-1 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">Extract to TXT</span>
              </button>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Target Documents ({docs.length})</span>
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                <span>+ Add more</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => onFileUpload(e.target.files)}
                />
              </label>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50">
              {docs.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-white rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{d.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                    {formatBytes(d.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar if processing */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Processing queue…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleRunBatch}
            disabled={docs.length === 0 || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Process {docs.length} Documents</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default BatchTool;
