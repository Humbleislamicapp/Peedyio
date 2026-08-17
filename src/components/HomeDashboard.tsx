import React, { useState } from 'react';
import { MessageSquare, Zap, User, FormInput,
  Edit3,
  Layers,
  Scissors,
  Copy,
  Minimize2,
  GitCompare,
  ArrowLeftRight,
  PenTool,
  Highlighter,
  ScanText,
  Lock,
  EyeOff,
  Upload,
  FileText,
  Star,
  MoreVertical,
  Download,
  Trash2,
  Shield,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus
} from 'lucide-react';
import { PDFDocumentModel } from '../types/pdf';
import { formatBytes, generateBinaryPdf, downloadBlob } from '../utils/pdfEngine';

interface HomeDashboardProps {
  onDeleteDocument: (id: string) => void;
  onDuplicateDocument: (doc: PDFDocumentModel) => void;
  onProtectDocument?: (doc: PDFDocumentModel) => void;
  recentDocuments: PDFDocumentModel[];
  onOpenDocument: (doc: PDFDocumentModel) => void;
  onSelectTool: (toolId: string, doc?: PDFDocumentModel) => void;
  onFileUpload: (files: FileList | null) => void;
  onNewBlankDocument: () => void;
  searchFilter?: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onDeleteDocument,
  onDuplicateDocument,
  onProtectDocument,
  recentDocuments,
  onOpenDocument,
  onSelectTool,
  onFileUpload,
  onNewBlankDocument,
  searchFilter = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);

  // Top 4 Spotlight Cards matching Sleek Interface specification
    const spotlightCards = [
    { id: 'edit_hub', title: 'Edit', iconBg: 'bg-blue-50 text-blue-600', icon: Edit3, desc: 'Text, images & annotations' },
    { id: 'review_hub', title: 'Review', iconBg: 'bg-emerald-50 text-emerald-600', icon: MessageSquare, desc: 'Comments & collaboration' },
    { id: 'fill_hub', title: 'Fill', iconBg: 'bg-indigo-50 text-indigo-600', icon: FormInput, desc: 'Form fields & checkboxes' },
    { id: 'sign_hub', title: 'Sign', iconBg: 'bg-amber-50 text-amber-600', icon: PenTool, desc: 'Signatures & workflows' },
  ];

  // Extended tools suite
  const allTools: Array<{id: string, title: string, desc: string, icon: any, color: string, badge?: string}> = [
    { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one.', icon: Layers, color: 'text-blue-500' },
    { id: 'split', title: 'Split PDF', desc: 'Separate one page or a whole set.', icon: Scissors, color: 'text-rose-500' },
    { id: 'extract', title: 'Extract Pages', desc: 'Pull specific pages from a file.', icon: Copy, color: 'text-emerald-500' },
    { id: 'convert', title: 'Convert PDF', desc: 'Convert to Word, Excel, and more.', icon: ArrowLeftRight, color: 'text-indigo-500', badge: 'PRO' },
    { id: 'compress', title: 'Compress PDF', desc: 'Reduce file size without quality loss.', icon: Minimize2, color: 'text-amber-500' },
    { id: 'compare', title: 'Compare PDF', desc: 'Spot differences between two files.', icon: GitCompare, color: 'text-cyan-500' },
    { id: 'ocr', title: 'OCR PDF', desc: 'Make scanned text searchable.', icon: ScanText, color: 'text-fuchsia-500', badge: 'PRO' },
    { id: 'protect', title: 'Protect & Redact', desc: 'Add passwords, redact info.', icon: Lock, color: 'text-slate-500' },
  ];

  
  const handleDownload = async (doc: PDFDocumentModel, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const pdfBytes = await generateBinaryPdf(doc);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, doc.name);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download PDF. See console for details.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const filteredDocs = searchFilter
    ? recentDocuments.filter((d) =>
        d.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : recentDocuments;

  const filteredTools = searchFilter
    ? allTools.filter(
        (t) =>
          t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : allTools;

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col bg-slate-50 items-center">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Hero Header */}
        <div className="mb-8 text-center mt-4 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Let Peedy sort out your PDF.</h1>
          <p className="text-base text-slate-500 mt-3 mb-6">Drop a file in, or pick a tool below.</p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-medium text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Free to start
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-medium text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% private
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-blue-500" />
              No sign-up required
            </div>
          </div>
        </div>

        {/* Spotlight Action Cards */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {spotlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectTool(card.id)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-center cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${card.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center gap-1 mt-1 mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>
                  {('badge' in card && card.badge === 'PRO') && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                      <Lock className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{card.desc}</p>
              </button>
            );
          })}
        </div>
        
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full bg-white border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 sm:p-14 text-center gap-4 transition-all mb-10 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/40 scale-[1.02]'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2 transition-transform group-hover:scale-105">
            <Upload className="w-10 h-10 stroke-[1.75]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-xl text-slate-800">
              Drag & Drop files here
            </p>
            <p className="text-base text-slate-400 mt-1">
              or click to browse from device
            </p>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs cursor-pointer transition-all active:scale-95">
            <span>Browse Computer</span>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.docx"
              className="hidden"
              onChange={(e) => onFileUpload(e.target.files)}
            />
          </label>
          <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs text-slate-500 font-medium uppercase tracking-wider border border-slate-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Processed on your device</span>
          </div>
        </div>

        {/* Recent Files */}
        <div className="w-full flex flex-col max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Recent Files</h3>
            <button
              onClick={() => onSelectTool('library')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all
            </button>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No documents found</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload a PDF to begin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDocs.slice(0, 4).map((doc, idx) => {
                // Color variations for recent file badges
                const badgeColor =
                  idx % 3 === 0
                    ? 'bg-red-50 text-red-500'
                    : idx % 3 === 1
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-slate-100 text-slate-500';

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                    onClick={() => onOpenDocument(doc)}
                  >
                    {/* File icon box */}
                    <div
                      className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold text-sm ${badgeColor}`}
                    >
                      <FileText className="w-6 h-6" />
                      <span className="text-[10px] mt-1 font-mono">{doc.pageCount}p</span>
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-tighter mt-1 truncate">
                          {doc.lastModified} • {formatBytes(doc.size)}
                        </p>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuDocId === doc.id && (
                          <div className="absolute right-0 top-10 w-36 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10 py-1 text-xs animate-in fade-in zoom-in-95">
                            <button onClick={(e) => { e.stopPropagation(); handleDownload(doc, e); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"><Download className="w-3.5 h-3.5"/> Download</button>
                            <button onClick={(e) => { e.stopPropagation(); onDuplicateDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"><Copy className="w-3.5 h-3.5"/> Duplicate</button>
                            {onProtectDocument && <button onClick={(e) => { e.stopPropagation(); onProtectDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"><Shield className="w-3.5 h-3.5"/> Protect</button>}
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        </div>
    </div>
  );
};
export default HomeDashboard;
