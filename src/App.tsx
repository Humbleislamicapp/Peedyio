import React, { useState, useEffect } from 'react';
import { PDFDocumentModel, ViewMode, PDFPageModel } from './types/pdf';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { PdfEditor } from './components/editor/PdfEditor';
import { MergeTool } from './components/tools/MergeTool';
import { SplitTool } from './components/tools/SplitTool';
import { ExtractTool } from './components/tools/ExtractTool';
import { EditHub } from './components/EditHub';
import { CompareTool } from './components/tools/CompareTool';
import { ConvertTool } from './components/tools/ConvertTool';
import { SignTool } from './components/tools/SignTool';
import { OcrTool } from './components/tools/OcrTool';
import { ProtectTool } from './components/tools/ProtectTool';

import { BatchTool } from './components/tools/BatchTool';
import { DocumentLibrary } from './components/library/DocumentLibrary';
import { ExportModal } from './components/modals/ExportModal';
import { PricingModal } from './components/modals/PricingModal';
import { EnterpriseContactModal } from './components/modals/EnterpriseContactModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { SignModal } from './components/modals/SignModal';
import { parseUploadedFile, formatBytes } from './utils/pdfEngine';
import { FileText, Layers, Scissors, Copy, Minimize2, PenTool, Lock, ArrowLeftRight, GitCompare, ScanText, Sparkles, Plus, Edit3, MessageSquare, FormInput } from 'lucide-react';





export function App() {
  const [documents, setDocuments] = useState<PDFDocumentModel[]>([]);
  const [currentDocument, setCurrentDocument] = useState<PDFDocumentModel | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showEnterpriseContact, setShowEnterpriseContact] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTargetDocument, setExportTargetDocument] = useState<PDFDocumentModel | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // User signature state
  const [initialEditorMode, setInitialEditorMode] = useState<string>('edit');
  const [userSignatures, setUserSignatures] = useState<{
    id: string;
    type: 'drawn' | 'typed' | 'image';
    dataUrl: string;
    signerName: string;
  }[]>(() => {
    try {
      const stored = localStorage.getItem('peedy_user_signatures');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse stored signatures", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('peedy_user_signatures', JSON.stringify(userSignatures));
    } catch (e) {
      console.warn("Failed to store signatures", e);
    }
  }, [userSignatures]);

  // Calculate storage usage
  const totalStorageBytes = documents.reduce((acc, d) => acc + (d.size || 0), 0);
  const storageLimitBytes = 50 * 1024 * 1024; // 50 MB simulated local quota
  const storagePercent = Math.min(100, Math.round((totalStorageBytes / storageLimitBytes) * 100)) || 0;

  // Handle uploading any files (PDF, image, text, docx)
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: PDFDocumentModel[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsedDoc = await parseUploadedFile(file);
        newDocs.push(parsedDoc);
      } catch (err) {
        console.error('Failed to parse file:', file.name, err);
      }
    }

    if (newDocs.length > 0) {
      setDocuments((prev) => [...newDocs, ...prev]);
      setCurrentDocument(newDocs[0]);
      if (activeView === 'dashboard' || activeView === 'edit_hub') {
        setActiveView('editor');
      }
    }
  };

  // Create a clean new blank document
  const handleCreateBlankDocument = () => {
    const blankDoc: PDFDocumentModel = {
      id: `doc_new_${Date.now()}`,
      name: 'Untitled Document.pdf',
      size: 42000,
      lastModified: 'Just now',
      pageCount: 1,
      pages: [
        {
          pageNumber: 1,
          rotation: 0,
          width: 595,
          height: 842,
          elements: [
            {
              id: `title_${Date.now()}`,
              type: 'text',
              x: 8,
              y: 8,
              width: 84,
              height: 6,
              text: 'Untitled Document',
              fontSize: 22,
              fontFamily: 'Plus Jakarta Sans',
              color: '#0F172A',
              fontWeight: 'bold',
            },
            {
              id: `body_${Date.now()}`,
              type: 'text',
              x: 8,
              y: 16,
              width: 84,
              height: 10,
              text: 'Start typing or drop text and visual elements onto the page.',
              fontSize: 12,
              fontFamily: 'Plus Jakarta Sans',
              color: '#64748B',
              fontWeight: 'normal',
            },
          ],
        },
      ],
      isSample: false,
      tags: ['Draft'],
    };

    setDocuments((prev) => [blankDoc, ...prev]);
    setCurrentDocument(blankDoc);
    setActiveView('editor');
  };

  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    
    // If we're in a tool hub, navigate directly to that tool instead of the editor
    if (activeView === 'split_hub') {
      setActiveView('split');
      return;
    } else if (activeView === 'extract_hub') {
      setActiveView('extract');
      return;
    } else if (activeView === 'protect_hub') {
      setActiveView('protect');
      return;
    } else if (activeView === 'ocr_hub') {
      setActiveView('ocr');
      return;
    } else if (activeView === 'convert_hub') {
      setActiveView('convert');
      return;
    } else if (activeView === 'compare_hub') {
      setActiveView('compare');
      return;
    }
    
    if (activeView === 'review_hub') {
      setInitialEditorMode('review');
    } else if (activeView === 'fill_hub') {
      setInitialEditorMode('fill');
    } else if (activeView === 'sign_hub') {
      setInitialEditorMode('sign');
    } else {
      setInitialEditorMode('edit');
    }
    setActiveView('editor');
  };

  const handleSelectTool = (toolId: string, targetDoc?: PDFDocumentModel) => {
    if (targetDoc) {
      setCurrentDocument(targetDoc);
    }
    const hasDoc = targetDoc || currentDocument;
    switch (toolId) {
      case 'merge':
        setActiveView('merge');
        break;
      case 'batch':
        setActiveView('batch');
        break;
      case 'split':
        setActiveView(hasDoc ? 'split' : 'split_hub');
        break;
      case 'extract':
        setActiveView(hasDoc ? 'extract' : 'extract_hub');
        break;
      case 'protect':
        setActiveView(hasDoc ? 'protect' : 'protect_hub');
        break;
      case 'ocr':
        setActiveView(hasDoc ? 'ocr' : 'ocr_hub');
        break;
      case 'convert':
        setActiveView(hasDoc ? 'convert' : 'convert_hub');
        break;
      case 'sign':
        setActiveView(hasDoc ? 'sign' : 'sign_hub');
        break;
      case 'compress':
        setActiveView('batch');
        break;
      case 'compare':
        setActiveView(hasDoc ? 'compare' : 'compare_hub');
        break;
            case 'review_hub':
        setActiveView('review_hub');
        break;
      case 'fill_hub':
        setActiveView('fill_hub');
        break;
      case 'sign_hub':
        setActiveView('sign_hub');
        break;
      case 'ask_peedy':
        setActiveView('ask_peedy');
        break;
      case 'library':
        setActiveView('library');
        break;
      case 'editor':
      case 'edit':
        setActiveView('edit_hub');
        break;
      default:
        setActiveView('dashboard');
        break;
    }
  };

  const handleSaveDocument = (updatedDoc: PDFDocumentModel) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    setCurrentDocument(updatedDoc);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDuplicateDocument = (doc: PDFDocumentModel) => {
    const dup: PDFDocumentModel = {
      ...doc,
      id: `dup_${Date.now()}`,
      name: `${doc.name.replace('.pdf', '')} (Copy).pdf`,
      lastModified: 'Just now',
    };
    setDocuments((prev) => [dup, ...prev]);
  };

  const handleSelectTemplate = (templateDoc: PDFDocumentModel) => {
    const newDoc: PDFDocumentModel = {
      ...templateDoc,
      id: `tpl_instance_${Date.now()}`,
      lastModified: 'Just now',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocument(newDoc);
    setActiveView('editor');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden select-none">
      {/* Mobile Sidebar Navigation */}
      {activeView !== 'editor' && (
        <Sidebar
          currentView={activeView}
          onNavigate={(view) => setActiveView(view)}
          storageUsedPercent={storagePercent}
          storageUsedFormatted={formatBytes(totalStorageBytes)}
          totalDocsCount={documents.length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenPricing={() => setShowPricing(true)}
          onOpenFeedback={() => setShowFeedback(true)}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Top Header */}
        {activeView !== 'editor' && (
          <Header
            currentView={activeView}
            onNavigate={(view) => setActiveView(view)}
            onFileUpload={handleFileUpload}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onOpenPricing={() => setShowPricing(true)}
            onOpenFeedback={() => setShowFeedback(true)}
          />
        )}

                                {/* View Router */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeView === 'ask_peedy' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-purple-200/50">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ask Peedy AI</h1>
              <p className="text-slate-500 mt-3 max-w-md text-base leading-relaxed">
                Describe what you want to do with your PDFs and Peedy will handle it automatically. Ask questions, summarise documents, extract data, and more.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => setShowPricing(true)} className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Unlock Unlimited AI
                </button>
                <button onClick={() => setActiveView('dashboard')} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors shadow-2xs">
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

                              {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub', 'split_hub', 'extract_hub', 'protect_hub', 'ocr_hub', 'convert_hub', 'compare_hub'].includes(activeView as string) && (
            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                activeView === 'split_hub' ? 'Split PDF Document' :
                activeView === 'extract_hub' ? 'Extract Pages' :
                activeView === 'protect_hub' ? 'Protect PDF' :
                activeView === 'ocr_hub' ? 'OCR PDF' :
                activeView === 'convert_hub' ? 'Convert PDF' :
                activeView === 'compare_hub' ? 'Compare PDF' :
                'PDF Tool'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                activeView === 'split_hub' ? 'Separate one page or a whole set for easy conversion into independent PDF files.' :
                activeView === 'extract_hub' ? 'Pull specific pages from a file to create a new PDF document instantly.' :
                activeView === 'protect_hub' ? 'Add passwords and restrict permissions to secure your document.' :
                activeView === 'ocr_hub' ? 'Make scanned text selectable and searchable.' :
                activeView === 'convert_hub' ? 'Convert your PDF to Word, Excel, and other formats instantly.' :
                activeView === 'compare_hub' ? 'Spot visual and text differences between two PDF files instantly.' :
                'Select a file to continue.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                activeView === 'split_hub' ? Scissors :
                activeView === 'extract_hub' ? Copy :
                activeView === 'protect_hub' ? Lock :
                activeView === 'ocr_hub' ? ScanText :
                activeView === 'convert_hub' ? ArrowLeftRight :
                activeView === 'compare_hub' ? GitCompare :
                FileText
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'split_hub' ? 'bg-rose-100 text-rose-600' :
                activeView === 'extract_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'protect_hub' ? 'bg-slate-100 text-slate-600' :
                activeView === 'ocr_hub' ? 'bg-fuchsia-100 text-fuchsia-600' :
                activeView === 'convert_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'compare_hub' ? 'bg-cyan-100 text-cyan-600' :
                'bg-blue-100 text-blue-600'
              }
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onFileUpload={handleFileUpload}
              onNewBlankDocument={handleCreateBlankDocument}
            />
          )}

          {activeView === 'dashboard' && (
            <HomeDashboard
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onSelectTool={handleSelectTool}
              onFileUpload={handleFileUpload}
              onNewBlankDocument={handleCreateBlankDocument}
              searchFilter={searchQuery}
              onDeleteDocument={handleDeleteDocument}
              onDuplicateDocument={handleDuplicateDocument}
              onProtectDocument={(doc) => {
                setExportTargetDocument(doc);
                handleSelectTool('protect');
              }}
            />
          )}

          {activeView === 'editor' && (
            <PdfEditor
              document={(exportTargetDocument || currentDocument)!}
              initialMode={initialEditorMode}
              onBack={() => setActiveView('dashboard')}
              onSaveDocument={handleSaveDocument}
              onOpenExportModal={(doc) => { setExportTargetDocument(doc || null); setIsExportModalOpen(true); }}
              onOpenSignModal={() => setIsSignModalOpen(true)}
              onProtectDocument={() => handleSelectTool('protect')}
              userSignatures={userSignatures}
              onDeleteSignature={(id) => setUserSignatures(prev => prev.filter(s => s.id !== id))}
            />
          )}

          {activeView === 'merge' && (
            <MergeTool
              initialDocs={documents}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeView === 'split' && (
            <SplitTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'extract' && (
            <ExtractTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'sign' && (
            <SignTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'protect' && (
            <ProtectTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}
          {activeView === 'convert' && (
            <ConvertTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'compare' && (
            <CompareTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'ocr' && (
            <OcrTool
              document={(exportTargetDocument || currentDocument)!}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'library' && (
            <DocumentLibrary
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
              onDuplicateDocument={handleDuplicateDocument}
              onNewBlankDocument={handleCreateBlankDocument}
              onFileUpload={handleFileUpload}
              onProtectDocument={(doc) => {
                setExportTargetDocument(doc);
                setActiveView('protect');
              }}
            />
          )}

          {activeView === 'batch' && (
            <BatchTool
              initialDocs={documents}
              onBack={() => setActiveView('dashboard')}
              onFileUpload={handleFileUpload}
            />
          )}
        </div>

        {/* Privacy Toast / Footer from Design Specification */}
        {activeView !== 'editor' && (
          <footer className="bg-white px-6 sm:px-8 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span>Privacy First: We don't store your files on our servers.</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
              <span className="hidden sm:inline">v2.4.0 (Stable)</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFeedback(true)}
                className="text-slate-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Contact us
              </button>
            </div>
          </footer>
        )}
      </main>

      {/* Global Modals */}
      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)} 
          onEnterpriseClick={() => setShowEnterpriseContact(true)} 
        />
      )}
      
      {showEnterpriseContact && (
        <EnterpriseContactModal 
          onClose={() => setShowEnterpriseContact(false)} 
        />
      )}

      {showFeedback && (
        <FeedbackModal 
          onClose={() => setShowFeedback(false)} 
        />
      )}
      {(exportTargetDocument || currentDocument) && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={(exportTargetDocument || currentDocument)!}
        />
      )}

      <SignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSaveSignature={(sig) => {
          setUserSignatures(prev => {
            if (prev.length >= 2) {
              return [...prev.slice(1), { ...sig, id: Date.now().toString() }];
            }
            return [...prev, { ...sig, id: Date.now().toString() }];
          });
        }}
      />
    </div>
  );
}
export default App;
