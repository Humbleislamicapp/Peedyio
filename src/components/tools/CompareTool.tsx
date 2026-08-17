import React, { useState } from 'react';
import {
  GitCompare,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Minus,
  FileSearch,
  Layers
} from 'lucide-react';
import { PDFDocumentModel, DocumentDiffResult } from '../../types/pdf';
import { comparePdfDocuments } from '../../utils/pdfEngine';


interface CompareToolProps {
  initialDocs?: PDFDocumentModel[];
  document?: PDFDocumentModel;
  onBack: () => void;

}

export const CompareTool: React.FC<CompareToolProps> = ({
  initialDocs = [],
  onBack,
}) => {
  // Document A (Original) and Document B (Modified)
  const [docA, setDocA] = useState<PDFDocumentModel | null>(
    initialDocs[0] || null
  );
  const [docB, setDocB] = useState<PDFDocumentModel | null>(
    initialDocs.length > 1 ? initialDocs[1] : null
  );

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeDiffIndex, setActiveDiffIndex] = useState(0);
  const [diffResult, setDiffResult] = useState<DocumentDiffResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleRunComparison = () => {
    if (!docA || !docB) return;
    setIsComparing(true);
    setTimeout(() => {
      const res = comparePdfDocuments(docA, docB);
      setDiffResult(res);
      setIsComparing(false);
    }, 400);
  };



  const currentDiff = diffResult?.changes[activeDiffIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">

        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Visual PDF Comparison
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Compare two versions side-by-side with synchronized scrolling and visual change detection.
        </p>
      </div>

      {/* Document Selectors Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Document A (Original) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-slate-700">A</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Original Document
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {docA ? docA.name : 'Select or upload original'}
              </p>
            </div>
          </div>
        </div>

        {/* Document B (Revised) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">B</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Revised Document
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {docB ? docB.name : 'Select or upload revision'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRunComparison}
            disabled={!docA || !docB || isComparing}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isComparing ? 'Analyzing…' : 'Compare Now'}
          </button>
        </div>
      </div>

      {/* Difference Summary Drawer / Pill Bar */}
      {diffResult && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {diffResult.totalChanges} changes detected
              </h3>
              <p className="text-xs text-slate-500">
                {diffResult.summary}
              </p>
            </div>
          </div>

          {/* Jump to Diff Controls */}
          {diffResult.changes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Change {activeDiffIndex + 1} of {diffResult.changes.length}
              </span>
              <button
                onClick={() =>
                  setActiveDiffIndex(Math.max(0, activeDiffIndex - 1))
                }
                disabled={activeDiffIndex === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveDiffIndex(
                    Math.min(diffResult.changes.length - 1, activeDiffIndex + 1)
                  )
                }
                disabled={activeDiffIndex === diffResult.changes.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Synchronized Document Viewers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Document A (Original) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-slate-700 truncate max-w-[280px]">
              Original: {docA?.name}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Page {currentPageIndex + 1} of {docA?.pages.length || 1}
            </span>
          </div>

          {/* Rendered Page Mock */}
          <div className="w-full aspect-[3/4] max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-sm relative overflow-hidden text-xs">
            {docA?.pages[currentPageIndex]?.elements.map((el) => (
              <div
                key={el.id}
                className={`mb-3 p-1.5 rounded transition-all ${
                  currentDiff?.originalText && el.text?.includes(currentDiff.originalText.substring(0, 15))
                    ? 'bg-rose-50 border border-rose-300 text-rose-900'
                    : 'text-slate-800'
                }`}
              >
                {el.type === 'text' && (
                  <p className={el.fontWeight === 'bold' ? 'font-bold text-sm' : ''}>
                    {el.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Document B (Revised) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-blue-700 truncate max-w-[280px]">
              Revision: {docB?.name}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Page {currentPageIndex + 1} of {docB?.pages.length || 1}
            </span>
          </div>

          {/* Rendered Page Mock with Highlighting */}
          <div className="w-full aspect-[3/4] max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-sm relative overflow-hidden text-xs">
            {docB?.pages[currentPageIndex]?.elements.map((el) => {
              const isAddedOrChanged =
                currentDiff?.newText && el.text?.includes(currentDiff.newText.substring(0, 15));

              return (
                <div
                  key={el.id}
                  className={`mb-3 p-1.5 rounded transition-all ${
                    isAddedOrChanged
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium'
                      : 'text-slate-800'
                  }`}
                >
                  {el.type === 'text' && (
                    <p className={el.fontWeight === 'bold' ? 'font-bold text-sm' : ''}>
                      {el.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTool;
