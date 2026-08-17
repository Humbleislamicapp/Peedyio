import React, { useState } from 'react';
import { Upload, FileText, ShieldCheck, Edit3 } from 'lucide-react';
import { PDFDocumentModel } from '../types/pdf';

interface EditHubProps {
  title?: string;
  description?: string;
  icon?: any;
  iconBg?: string;
  recentDocuments: PDFDocumentModel[];
  onOpenDocument: (doc: PDFDocumentModel) => void;
  onFileUpload: (files: FileList | null) => void;
  onNewBlankDocument?: () => void;
}

export const EditHub: React.FC<EditHubProps> = ({
  title = '{title}',
  description = '{description}',
  icon: Icon = Edit3,
  iconBg = 'bg-blue-100 text-blue-600',
  recentDocuments,
  onOpenDocument,
  onFileUpload,
  onNewBlankDocument,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm ${iconBg}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      </div>

            <div className="flex flex-col gap-8 mb-10">
        {/* Drag & Drop Zone (Top) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full bg-white border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 sm:p-12 text-center gap-4 transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/40 scale-[1.01]'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
          }`}
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-1 transition-transform group-hover:scale-105">
            <Upload className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg text-slate-800">
              Drag & Drop files here
            </p>
            <p className="text-sm text-slate-400 mt-1">
              or click to browse from device
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95">
              <span>Browse Computer</span>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.docx"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
              />
            </label>
          </div>
          <div className="mt-2 flex items-center gap-2 px-4 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium uppercase tracking-wider border border-slate-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Processed on your device</span>
          </div>
        </div>
      

        {/* Recent Files (Bottom) */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Recent Files</h3>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center w-full">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No documents found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload a PDF to begin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentDocuments.slice(0, 3).map((doc, idx) => {
                const badgeColor =
                  idx % 3 === 0
                    ? 'bg-red-50 text-red-500'
                    : idx % 3 === 1
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-slate-100 text-slate-500';

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer group"
                    onClick={() => onOpenDocument(doc)}
                  >
                    {/* File icon box */}
                    <div
                      className={`w-10 h-12 rounded flex flex-col items-center justify-center shrink-0 font-bold text-xs ${badgeColor}`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-[8px] mt-0.5 font-mono">{doc.pageCount}p</span>
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-400 uppercase tracking-tighter mt-0.5 truncate">
                        {doc.lastModified} • {formatBytes(doc.size)}
                      </p>
                    </div>

                    {/* Quick action button */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDocument(doc);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
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
export default EditHub;
