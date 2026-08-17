import React, { useState } from 'react';
import {
  Layers,
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { mergeDocuments, generateBinaryPdf, downloadBlob, formatBytes } from '../../utils/pdfEngine';

interface MergeToolProps {
  initialDocs?: PDFDocumentModel[];
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
  onFileUpload: (files: FileList | null) => void;
}

export const MergeTool: React.FC<MergeToolProps> = ({
  initialDocs = [],
  onBack,
  onOpenInEditor,
  onFileUpload,
}) => {
  const [selectedDocs, setSelectedDocs] = useState<PDFDocumentModel[]>(initialDocs);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedDoc, setMergedDoc] = useState<PDFDocumentModel | null>(null);

  const totalPages = selectedDocs.reduce((acc, d) => acc + (d.pages?.length || 1), 0);
  const totalSize = selectedDocs.reduce((acc, d) => acc + (d.size || 0), 0);

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedDocs.length) return;
    const items = [...selectedDocs];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setSelectedDocs(items);
  };

  const handleRemove = (id: string) => {
    setSelectedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMerge = async () => {
    if (selectedDocs.length < 2) return;
    setIsProcessing(true);

    try {
      const merged = await mergeDocuments(selectedDocs);
      setMergedDoc(merged);
      setIsProcessing(false);

      // Trigger delightful celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch (err) {
      console.error('Error merging docs:', err);
      setIsProcessing(false);
    }
  };

  const handleDownloadMerged = async () => {
    if (!mergedDoc) return;
    try {
      const bytes = await generateBinaryPdf(mergedDoc);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, mergedDoc.name);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Merge Engine</span>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Merge Multiple PDFs
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Combine separate files into a single organized PDF. Drag to reorder documents in the exact order you want them merged.
        </p>
      </div>

      {mergedDoc ? (
        /* Success & Download State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Documents Merged!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Combined {selectedDocs.length} files into a single {mergedDoc.pageCount}-page document ({formatBytes(mergedDoc.size)}).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadMerged}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Merged PDF</span>
            </button>

            <button
              onClick={() => onOpenInEditor(mergedDoc)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Open in Editor</span>
            </button>
          </div>

          <button
            onClick={() => setMergedDoc(null)}
            className="mt-6 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Merge another set of documents
          </button>
        </div>
      ) : (
        /* File Management & Order List */
        <div className="space-y-6">
          {/* Multi-file Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white rounded-2xl p-6 sm:p-8 text-center transition-colors">
            <label className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-900 mb-1">
                Add more PDF files
              </span>
              <span className="text-xs text-slate-500 mb-3">
                Drop files here or click to browse
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors">
                Browse Files
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
              />
            </label>
          </div>

          {/* Reorderable Document Cards */}
          {selectedDocs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Merge Order ({selectedDocs.length} files)
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  Total {totalPages} pages • {formatBytes(totalSize)}
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedDocs.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>

                      <div className="w-9 h-11 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'} • {formatBytes(doc.size)}
                        </p>
                      </div>
                    </div>

                    {/* Order buttons & remove */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMove(idx, idx + 1)}
                        disabled={idx === selectedDocs.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRemove(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Summary Bar & Action */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Expected Result
                  </span>
                  <p className="text-base font-bold text-slate-900">
                    {selectedDocs.length} files • {totalPages} pages → 1 PDF
                  </p>
                </div>

                <button
                  onClick={handleMerge}
                  disabled={selectedDocs.length < 2 || isProcessing}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                    selectedDocs.length >= 2 && !isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Merging documents…
                    </span>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>Merge & Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
