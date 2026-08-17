import React, { useState } from 'react';
import {
  Folder,
  Search,
  Plus,
  LayoutGrid,
  List,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Tag,
  Shield,
  Eye,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { PDFDocumentModel } from '../../types/pdf';
import { formatBytes, generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';

interface DocumentLibraryProps {
  documents: PDFDocumentModel[];
  onOpenDocument: (doc: PDFDocumentModel) => void;
  onDeleteDocument: (id: string) => void;
  onDuplicateDocument: (doc: PDFDocumentModel) => void;
  onNewBlankDocument: () => void;
  onFileUpload: (files: FileList | null) => void;
  onProtectDocument?: (doc: PDFDocumentModel) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onDuplicateDocument,
  onNewBlankDocument,
  onFileUpload,
  onProtectDocument,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);

  const filteredDocs = documents.filter((d) => {
    return d.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalBytes = documents.reduce((acc, d) => acc + d.size, 0);

  const handleDownload = async (doc: PDFDocumentModel, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const bytes = await generateBinaryPdf(doc);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, doc.name);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Document Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 flex items-center gap-2">
            <span>{documents.length} documents stored locally</span>
            <span>•</span>
            <span className="font-semibold text-zinc-700">{formatBytes(totalBytes)} used</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" /> 100% Private On-Device
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex-1 sm:flex-none">
            <Plus className="w-4 h-4" />
            <span>Upload PDF</span>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
              className="hidden"
              onChange={(e) => onFileUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-3 sm:p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* Grid/List View Toggle */}
        <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List of Documents */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-md mx-auto">
          <Folder className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-800">No documents found</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search filter or upload a new PDF file.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="group bg-white rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-md transition-all p-4 cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="aspect-[3/4] bg-zinc-50 rounded-xl border border-zinc-100 p-4 mb-3 flex flex-col justify-between relative overflow-hidden group-hover:bg-zinc-100/50 transition-colors">
                <div className="space-y-1.5 opacity-70">
                  <div className="h-2 w-3/4 bg-zinc-700 rounded-xs" />
                  <div className="h-1.5 w-full bg-zinc-300 rounded-xs" />
                  <div className="h-1.5 w-5/6 bg-zinc-300 rounded-xs" />
                  <div className="h-1.5 w-2/3 bg-zinc-300 rounded-xs" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 border border-zinc-200 text-zinc-600 shadow-2xs">
                    {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {formatBytes(doc.size)}
                  </span>
                </div>
              </div>

              {/* Document Meta */}
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="text-xs font-bold text-zinc-900 truncate flex-1 group-hover:text-zinc-800" title={doc.name}>
                    {doc.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{doc.lastModified}</span>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenuDocId === doc.id && (
                      <div className="absolute right-0 bottom-6 w-36 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-10 py-1 text-xs animate-in fade-in zoom-in-95">
                        <button onClick={(e) => { e.stopPropagation(); handleDownload(doc, e); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download</button>
                        <button onClick={(e) => { e.stopPropagation(); onDuplicateDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Copy className="w-3.5 h-3.5"/> Duplicate</button>
                        {onProtectDocument && <button onClick={(e) => { e.stopPropagation(); onProtectDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Shield className="w-3.5 h-3.5"/> Protect</button>}
                        <div className="h-px bg-zinc-100 my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 shadow-xs overflow-hidden">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-11 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'} • {formatBytes(doc.size)} • Modified {doc.lastModified}
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuDocId === doc.id && (
                  <div className="absolute right-0 top-10 w-36 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-10 py-1 text-xs animate-in fade-in zoom-in-95">
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(doc, e); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download</button>
                    <button onClick={(e) => { e.stopPropagation(); onDuplicateDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Copy className="w-3.5 h-3.5"/> Duplicate</button>
                    {onProtectDocument && <button onClick={(e) => { e.stopPropagation(); onProtectDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Shield className="w-3.5 h-3.5"/> Protect</button>}
                    <div className="h-px bg-zinc-100 my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
