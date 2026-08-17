import React, { useState } from 'react';
import {
  Copy,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Eye,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { generateBinaryPdf, downloadBlob, formatBytes } from '../../utils/pdfEngine';

interface ExtractToolProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
}

export const ExtractTool: React.FC<ExtractToolProps> = ({
  document: doc,
  onBack,
  onOpenInEditor,
}) => {
  const [selectedPageNumbers, setSelectedPageNumbers] = useState<number[]>([1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedDoc, setExtractedDoc] = useState<PDFDocumentModel | null>(null);

  const totalPages = doc?.pages?.length || 1;

  const togglePage = (pageNum: number) => {
    setSelectedPageNumbers((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedPageNumbers((doc?.pages || []).map((p) => p.pageNumber));
  };

  const selectNone = () => {
    setSelectedPageNumbers([]);
  };

  const selectOdd = () => {
    setSelectedPageNumbers((doc?.pages || []).filter((p) => p.pageNumber % 2 !== 0).map((p) => p.pageNumber));
  };

  const selectEven = () => {
    setSelectedPageNumbers((doc?.pages || []).filter((p) => p.pageNumber % 2 === 0).map((p) => p.pageNumber));
  };

  const handleExtract = async () => {
    if (selectedPageNumbers.length === 0 || !doc?.pages) return;
    setIsProcessing(true);

    try {
      const extractedPages = (doc?.pages || [])
        .filter((p) => selectedPageNumbers.includes(p.pageNumber))
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

      const newDoc: PDFDocumentModel = {
        id: `extracted_${Date.now()}`,
        name: `${doc.name.replace('.pdf', '')}_Extracted_${selectedPageNumbers.length}p.pdf`,
        size: Math.round((doc.size * selectedPageNumbers.length) / Math.max(1, totalPages)),
        lastModified: 'Just now',
        pageCount: extractedPages.length,
        pages: extractedPages,
        isSample: false,
        tags: ['Extracted'],
      };

      setExtractedDoc(newDoc);
      setIsProcessing(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch (err) {
      console.error('Extraction error:', err);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!extractedDoc) return;
    try {
      const bytes = await generateBinaryPdf(extractedDoc);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, extractedDoc.name);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Copy className="w-3.5 h-3.5 text-blue-600" />
          <span>Extract Pages</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Select Pages to Extract
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Click the pages you want in your new PDF document.
        </p>
      </div>

      {extractedDoc ? (
        /* Result */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pages Extracted!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Extracted {extractedDoc.pageCount} pages ({formatBytes(extractedDoc.size)}) into a clean new document.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Extracted PDF</span>
            </button>

            <button
              onClick={() => onOpenInEditor(extractedDoc)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Open in Editor</span>
            </button>
          </div>
        </div>
      ) : (
        /* Visual Selector Grid */
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Quick Select:</span>
              <button
                onClick={selectAll}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                All Pages
              </button>
              <button
                onClick={selectOdd}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                Odd Pages
              </button>
              <button
                onClick={selectEven}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                Even Pages
              </button>
              <button
                onClick={selectNone}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-600">
              Selected: <span className="text-slate-900 font-bold">{selectedPageNumbers.length}</span> of {totalPages}
            </div>
          </div>

          {/* Grid of Page Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(doc?.pages || []).map((p) => {
              const isSelected = selectedPageNumbers.includes(p.pageNumber);
              return (
                <div
                  key={p.pageNumber}
                  onClick={() => togglePage(p.pageNumber)}
                  className={`group relative rounded-xl border-2 p-3 bg-white transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      Page {p.pageNumber}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </div>

                  <div className="aspect-[3/4] bg-slate-50 border border-slate-100 rounded-lg p-3 flex flex-col justify-between">
                    <div className="space-y-1.5 opacity-60">
                      <div className="h-2 w-3/4 bg-slate-300 rounded-xs"></div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-xs"></div>
                      <div className="h-1.5 w-5/6 bg-slate-200 rounded-xs"></div>
                      <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs"></div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono text-center">
                      {p.elements?.length || 0} elements
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Ready to extract {selectedPageNumbers.length} pages?
              </p>
              <p className="text-xs text-slate-500">
                Pages [{selectedPageNumbers.join(', ')}] will be saved into your new PDF.
              </p>
            </div>

            <button
              onClick={handleExtract}
              disabled={selectedPageNumbers.length === 0 || isProcessing}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                selectedPageNumbers.length > 0 && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting…
                </span>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Extract {selectedPageNumbers.length} Pages</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ExtractTool;
