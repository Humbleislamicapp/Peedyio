import React, { useState } from 'react';
import {
  Scissors,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
  FileArchive,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { splitDocument, generateBinaryPdf, downloadBlob, formatBytes } from '../../utils/pdfEngine';

interface SplitToolProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
}

export const SplitTool: React.FC<SplitToolProps> = ({
  document: doc,
  onBack,
  onOpenInEditor,
}) => {
  const [splitType, setSplitType] = useState<'every_page' | 'ranges' | 'max_pages'>('every_page');
  const [pageRanges, setPageRanges] = useState('1-2, 3-4');
  const [maxPages, setMaxPages] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitResults, setSplitResults] = useState<PDFDocumentModel[] | null>(null);

  const totalPages = doc?.pages?.length || 1;

  // Calculate expected number of files
  const calculateOutputCount = () => {
    if (splitType === 'every_page') return totalPages;
    if (splitType === 'max_pages') return Math.ceil(totalPages / Math.max(1, maxPages));
    if (splitType === 'ranges') {
      return pageRanges.split(',').filter((s) => s.trim().length > 0).length || 1;
    }
    return 1;
  };

  const expectedCount = calculateOutputCount();

  const handleSplit = async () => {
    if (!doc?.pages) return;
    setIsProcessing(true);
    try {
      const results = splitDocument(doc, splitType, {
        pageRanges,
        maxPagesPerDoc: maxPages,
      });
      setSplitResults(results);
      setIsProcessing(false);

      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Split error:', err);
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!splitResults) return;
    try {
      const zip = new JSZip();
      for (const item of splitResults) {
        const bytes = await generateBinaryPdf(item);
        zip.file(item.name, bytes);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      downloadBlob(content, `${doc.name.replace('.pdf', '')}_Split_Files.zip`);
    } catch (err) {
      console.error('Zip generation error:', err);
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
          <Scissors className="w-3.5 h-3.5 text-blue-600" />
          <span>Split Utility</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Split PDF Document
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Extract individual pages or ranges from <span className="font-semibold text-slate-800">{doc.name}</span> ({totalPages} {totalPages === 1 ? 'page' : 'pages'}).
        </p>
      </div>

      {splitResults ? (
        /* Results View */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Split Complete!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Created {splitResults.length} separate PDF files from your original document.
          </p>

          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto text-left border border-slate-100 rounded-xl p-3 bg-slate-50">
            {splitResults.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-md border border-slate-200/80">
                <span className="font-medium text-slate-800 truncate max-w-[240px]">{r.name}</span>
                <span className="text-slate-500">{r.pages?.length || 1} {(r.pages?.length || 1) === 1 ? 'page' : 'pages'}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadZip}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <FileArchive className="w-4 h-4" />
              <span>Download All as ZIP</span>
            </button>

            <button
              onClick={() => onOpenInEditor(splitResults[0])}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Open First Part</span>
            </button>
          </div>
        </div>
      ) : (
        /* Configuration View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-4">How do you want to split?</h3>

          {/* Split Mode Selector */}
          <div className="space-y-3 mb-6">
            <label
              onClick={() => setSplitType('every_page')}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                splitType === 'every_page'
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="splitOption"
                checked={splitType === 'every_page'}
                onChange={() => setSplitType('every_page')}
                className="mt-1 accent-blue-600"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Every Single Page</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Creates {totalPages} individual 1-page PDF files.
                </p>
              </div>
            </label>

            <label
              onClick={() => setSplitType('ranges')}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                splitType === 'ranges'
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="splitOption"
                checked={splitType === 'ranges'}
                onChange={() => setSplitType('ranges')}
                className="mt-1 accent-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Custom Page Ranges</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify exact ranges (e.g. 1-2, 3-4).
                </p>

                {splitType === 'ranges' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="e.g. 1-2, 3-4"
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </label>

            <label
              onClick={() => setSplitType('max_pages')}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                splitType === 'max_pages'
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="splitOption"
                checked={splitType === 'max_pages'}
                onChange={() => setSplitType('max_pages')}
                className="mt-1 accent-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Maximum Pages per Document</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Split into chunks of fixed page sizes.
                </p>

                {splitType === 'max_pages' && (
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={maxPages}
                      onChange={(e) => setMaxPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-24 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-600">pages per PDF</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Expected Output Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Estimated Result
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                Your {totalPages}-page PDF will become {expectedCount} {expectedCount === 1 ? 'PDF' : 'PDFs'}
              </p>
            </div>
            <Scissors className="w-5 h-5 text-slate-400" />
          </div>

          {/* Submit Action */}
          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Splitting PDF…
              </span>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Split PDF</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default SplitTool;
