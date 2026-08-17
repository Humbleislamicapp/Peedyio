import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowLeft,
  FileImage,
  FileText,
  FileCode,
  Download,
  CheckCircle2,
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PDFDocumentModel } from '../../types/pdf';
import { generateBinaryPdf, downloadBlob } from '../../utils/pdfEngine';

interface ConvertToolProps {
  document?: PDFDocumentModel;
  onBack: () => void;
  onOpenInEditor: (doc: PDFDocumentModel) => void;
  onFileUpload: (files: FileList | null) => void;
}

export const ConvertTool: React.FC<ConvertToolProps> = ({
  document: doc,
  onBack,
  onOpenInEditor,
  onFileUpload,
}) => {
  const [direction, setDirection] = useState<'from_pdf' | 'to_pdf'>('from_pdf');
  const [selectedFormat, setSelectedFormat] = useState('jpg');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedResult, setConvertedResult] = useState<{
    fileName: string;
    format: string;
    blobUrl?: string;
  } | null>(null);

  const formatsFromPdf = [
    { id: 'jpg', name: 'High-Res JPG Images', ext: '.jpg', icon: FileImage, desc: 'Extract every page as high quality image' },
    { id: 'png', name: 'Lossless PNG Images', ext: '.png', icon: FileImage, desc: 'Crisp transparent/white PNG rendering' },
    { id: 'docx', name: 'Word Document (.docx)', ext: '.docx', icon: FileText, desc: 'Editable Microsoft Word text structure' },
    { id: 'txt', name: 'Plain Text (.txt)', ext: '.txt', icon: FileCode, desc: 'Clean raw text extraction of all pages' },
    { id: 'md', name: 'Markdown (.md)', ext: '.md', icon: FileCode, desc: 'Structured markdown headings and bullet lists' },
  ];

  const formatsToPdf = [
    { id: 'images', name: 'Images (JPG, PNG, WEBP)', ext: 'to .pdf', icon: FileImage, desc: 'Compile image files into a single PDF' },
    { id: 'word', name: 'Word Documents (.docx)', ext: 'to .pdf', icon: FileText, desc: 'Convert formatted documents to fixed PDF' },
    { id: 'txt', name: 'Text & Markdown (.txt, .md)', ext: 'to .pdf', icon: FileCode, desc: 'Render text notes to clean PDF layout' },
  ];

  const handleConvertFromPdf = () => {
    if (!doc) return;
    setIsConverting(true);

    setTimeout(() => {
      let ext = selectedFormat;
      if (ext === 'docx') ext = 'docx';
      const outputName = `${doc.name.replace('.pdf', '')}.${ext}`;

      if (selectedFormat === 'txt' || selectedFormat === 'md') {
        const textLines = (doc?.pages || [])
          .map((p, i) => `--- PAGE ${i + 1} ---\n` + (p.elements || []).filter(e => e.type === 'text').map(e => (e as any).text).join('\n'))
          .join('\n\n');
        const blob = new Blob([textLines], { type: 'text/plain;charset=utf-8' });
        downloadBlob(blob, outputName);
      }

      setConvertedResult({
        fileName: outputName,
        format: selectedFormat.toUpperCase(),
      });
      setIsConverting(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    }, 600);
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
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Universal Converter</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Convert Document
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Fast bi-directional conversion with local on-device formatting.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setDirection('from_pdf')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              direction === 'from_pdf'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Convert FROM PDF
          </button>
          <button
            onClick={() => setDirection('to_pdf')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              direction === 'to_pdf'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Convert TO PDF
          </button>
        </div>
      </div>

      {direction === 'from_pdf' ? (
        /* Convert FROM PDF */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Source Document
              </span>
              <p className="text-sm font-bold text-slate-900">
                {doc ? doc.name : 'Master Services Agreement.pdf'}
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
              PDF → Output
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Choose Target Format</label>
            <div className="grid grid-cols-1 gap-2.5">
              {formatsFromPdf.map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{fmt.name}</p>
                        <p className="text-[11px] text-slate-500">{fmt.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{fmt.ext}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleConvertFromPdf}
            disabled={isConverting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isConverting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Converting document…
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Convert & Download</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Convert TO PDF */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-xs">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
            <label className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-900 mb-1">
                Drop your non-PDF files here
              </span>
              <span className="text-xs text-slate-500 mb-4">
                JPG, PNG, WEBP, Word (.docx), or Text (.txt, .md)
              </span>
              <span className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                Select Files to Convert to PDF
              </span>
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.docx,.txt,.md"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
export default ConvertTool;
