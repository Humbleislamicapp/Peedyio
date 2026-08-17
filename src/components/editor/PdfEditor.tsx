import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, ShieldCheck,
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Save,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Wrench
} from 'lucide-react';
import {
  PDFDocumentModel,
  PDFPageModel,
  PageElement,
  AnnotationTool,
  ShapeType,
  StampType
} from '../../types/pdf';
import { PdfCanvas } from './PdfCanvas';
import { EditorPagesSidebar } from "./EditorPagesSidebar";
import { FloatingToolbar } from "./FloatingToolbar";
// import { EditorSidebar } from './EditorSidebar';
import { generateBinaryPdf, downloadBlob, parseUploadedFile } from '../../utils/pdfEngine';

interface PdfEditorProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onSaveDocument: (doc: PDFDocumentModel) => void;
  onOpenExportModal: (doc?: PDFDocumentModel) => void;
  onProtectDocument?: () => void;
  onOpenSignModal: () => void;
  userSignatures?: {
    id: string;
    type: 'drawn' | 'typed' | 'image';
    dataUrl: string;
    signerName: string;
  }[];
  onDeleteSignature?: (id: string) => void;
  initialMode?: string;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({
  document: initialDoc,
  onBack,
  onSaveDocument,
  onOpenExportModal,
  onProtectDocument,
  onOpenSignModal,
  userSignatures = [],
  onDeleteSignature,
  initialMode = 'edit',
}) => {
  const [doc, setDoc] = useState<PDFDocumentModel>(initialDoc);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoom, setZoom] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100);
  const [activePanel, setActivePanel] = useState<string>(initialMode);
  const [activeTool, setActiveTool] = useState<AnnotationTool>(() => {
    if (initialMode === 'review') return 'comment';
    if (initialMode === 'fill') return 'addText';
    if (initialMode === 'sign') return 'sign';
    return 'select';
  });
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [docName, setDocName] = useState(initialDoc.name);
  const [rightSidebarMode, setRightSidebarMode] = useState<'pages' | 'review' | 'sign'>('pages');
  useEffect(() => {
    if (activeTool === 'comment') setRightSidebarMode('review');
    else if (activeTool === 'sign') setRightSidebarMode('sign');
    else setRightSidebarMode('pages');
  }, [activeTool]);

  useEffect(() => {
    if (selectedElementIds.length === 1) {
      const allElements = doc.pages.flatMap(p => p.elements || []);
      const selectedElem = allElements.find(e => e.id === selectedElementIds[0]);
      if (selectedElem?.type === 'comment') {
        setRightSidebarMode('review');
      }
    }
  }, [selectedElementIds, doc.pages]);
  const [isPagesCollapsed, setIsPagesCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isToolsCollapsed, setIsToolsCollapsed] = useState(false);
  const [selectedPagesForExtraction, setSelectedPagesForExtraction] = useState<number[]>([]);

  // History stack for undo / redo
  const [history, setHistory] = useState<PDFDocumentModel[]>([initialDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Tool settings state
  const [toolSettings, setToolSettings] = useState({
    textColor: '#111827',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'normal' as 'normal' | 'bold',
    textAlign: 'left' as 'left' | 'center' | 'right',
    textDecoration: 'none' as 'none' | 'underline' | 'line-through',
    shapeType: 'rect' as ShapeType,
    strokeColor: '#1E293B',
    fillColor: 'transparent',
    strokeWidth: 2,
    highlightColor: '#FEF08A',
    highlightStyle: 'highlight' as 'highlight' | 'underline' | 'strikethrough',
    drawColor: '#2563EB',
    drawWidth: 3,
    commentColor: '#FEF08A',
    stampType: 'APPROVED' as StampType,
    stampText: 'APPROVED',
    stampColor: '#16A34A',
    signatureDataUrl: userSignatures[0]?.dataUrl || '',
    signerName: userSignatures[0]?.signerName || 'John Doe',
    activeSignatureId: userSignatures[0]?.id || '',
  });

  const [pdfPassword, setPdfPassword] = useState<string | null>(null);

  useEffect(() => {
    if (userSignatures.length > 0) {
      setToolSettings(prev => {
        // If current active signature doesn't exist anymore, or there isn't one selected, pick the first
        const activeExists = userSignatures.some(s => s.id === prev.activeSignatureId);
        if (!activeExists) {
          return {
            ...prev,
            signatureDataUrl: userSignatures[0].dataUrl,
            signerName: userSignatures[0].signerName,
            activeSignatureId: userSignatures[0].id
          };
        }
        return prev;
      });
    } else {
      setToolSettings(prev => ({
        ...prev,
        signatureDataUrl: '',
        signerName: 'John Doe',
        activeSignatureId: ''
      }));
    }
  }, [userSignatures]);

  // Update doc with history tracking
  const pushDocChange = (updated: PDFDocumentModel) => {
    setSaveStatus('saving');
    setDoc(updated);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(updated);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);

    setTimeout(() => {
      onSaveDocument(updated);
      setSaveStatus('saved');
    }, 400);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevDoc = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(prevDoc);
      onSaveDocument(prevDoc);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextDoc = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(nextDoc);
      onSaveDocument(nextDoc);
    }
  };

  const currentPage = doc?.pages?.[currentPageIndex] || doc?.pages?.[0];

  // Page Operations
  const handleRotatePage = (index: number) => {
    if (!doc?.pages) return;
    const newPages = [...doc.pages];
    const currRot = newPages[index]?.rotation || 0;
    newPages[index] = {
      ...newPages[index],
      rotation: (currRot + 90) % 360,
    };
    pushDocChange({ ...doc, pages: newPages });
  };

  const handleDuplicatePage = (index: number) => {
    if (!doc?.pages) return;
    const pageToDup = doc.pages[index];
    if (!pageToDup) return;
    const duplicated: PDFPageModel = {
      ...pageToDup,
      pageNumber: (doc.pages.length || 0) + 1,
      elements: (pageToDup.elements || []).map((el) => ({
        ...el,
        id: `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };
    const newPages = [...doc.pages];
    newPages.splice(index + 1, 0, duplicated);
    // re-index page numbers
    const reindexed = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    pushDocChange({ ...doc, pages: reindexed, pageCount: reindexed.length });
    setCurrentPageIndex(index + 1);
  };

  const handleDeletePage = (index: number) => {
    if (!doc?.pages || doc.pages.length <= 1) return;
    const newPages = doc.pages
      .filter((_, idx) => idx !== index)
      .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    pushDocChange({ ...doc, pages: newPages, pageCount: newPages.length });
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    }
  };

  const handleMovePage = (fromIndex: number, toIndex: number) => {
    if (!doc?.pages || toIndex < 0 || toIndex >= doc.pages.length) return;
    const newPages = [...doc.pages];
    const [moved] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, moved);
    const reindexed = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    pushDocChange({ ...doc, pages: reindexed });
    setCurrentPageIndex(toIndex);
  };

  const handleUploadPages = async (file: File) => {
    try {
      const uploadedDoc = await parseUploadedFile(file);
      if (uploadedDoc && uploadedDoc.pages) {
        const currentPages = doc.pages || [];
        const newPages = [...currentPages, ...uploadedDoc.pages];
        const reindexed = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
        pushDocChange({ ...doc, pages: reindexed });
        setCurrentPageIndex(reindexed.length - 1);
      }
    } catch (err) {
      console.error('Failed to parse uploaded file:', err);
    }
  };

  // Element Operations on Current Page
  const handleSelectElement = (ids: string | string[] | null) => {
    if (!ids) { setSelectedElementIds([]); return; } const newIds = Array.isArray(ids) ? ids : [ids]; setSelectedElementIds(newIds);
    if (newIds.length === 1 && doc?.pages) { const id = newIds[0];
      let elem: PageElement | undefined;
      for (const page of doc.pages) {
        elem = page.elements?.find((el) => el.id === id);
        if (elem) break;
      }
      
      if (elem) {
        if (elem.type === 'text') setActiveTool('editText');
        else if (elem.type === 'shape') setActiveTool('shape');
        else if (elem.type === 'highlight') setActiveTool('highlight');
        else if (elem.type === 'comment') setActiveTool('comment');
        else if (elem.type === 'drawing') setActiveTool('draw');
      }
    }
  };

  const handleAddElement = (elem: PageElement) => {
    if (!doc?.pages || !currentPage) return;
    const newPages = [...doc.pages];
    newPages[currentPageIndex] = {
      ...currentPage,
      elements: [...(currentPage.elements || []), elem],
    };
    pushDocChange({ ...doc, pages: newPages });
  };

  const handleUpdateElements = (updatedElems: PageElement[]) => {
    if (!doc?.pages || !currentPage) return;
    const newPages = [...doc.pages];
    newPages[currentPageIndex] = {
      ...currentPage,
      elements: (currentPage.elements || []).map((el) => {
        const match = updatedElems.find(u => u.id === el.id);
        return match ? match : el;
      }),
    };
    pushDocChange({ ...doc, pages: newPages });
  };

  const handleUpdateElement = (updatedElem: PageElement) => {
    if (!doc?.pages || !currentPage) return;
    const newPages = [...doc.pages];
    newPages[currentPageIndex] = {
      ...currentPage,
      elements: (currentPage.elements || []).map((el) => (el.id === updatedElem.id ? updatedElem : el)),
    };
    pushDocChange({ ...doc, pages: newPages });
  };

  const handleDeleteElement = (id: string) => {
    if (!doc?.pages || !currentPage) return;
    const newPages = [...doc.pages];
    newPages[currentPageIndex] = {
      ...currentPage,
      elements: (currentPage.elements || []).filter((el) => el.id !== id),
    };
    pushDocChange({ ...doc, pages: newPages });
    handleSelectElement(null);
  };

  const handleApplyRedaction = (id: string) => {
    const elem = currentPage.elements.find((el) => el.id === id);
    if (elem && elem.type === 'redaction') {
      handleUpdateElement({
        ...elem,
        applied: true,
      });
    }
  };

  const handleUpdateToolSettings = (newSettings: Partial<typeof toolSettings>) => {
    // Intercept if there's a selection inside a contenteditable
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && document.activeElement?.getAttribute('contenteditable') === 'true') {
      if (newSettings.fontWeight) {
        document.execCommand('bold', false);
      }
      if (newSettings.textDecoration === 'underline') {
        document.execCommand('underline', false);
      }
      if (newSettings.textDecoration === 'line-through') {
        document.execCommand('strikeThrough', false);
      }
      if (newSettings.textColor) {
        document.execCommand('foreColor', false, newSettings.textColor);
      }
      if (newSettings.textAlign) {
        let align = newSettings.textAlign;
        if (align === 'left') document.execCommand('justifyLeft', false);
        if (align === 'center') document.execCommand('justifyCenter', false);
        if (align === 'right') document.execCommand('justifyRight', false);
      }
      
      setToolSettings((prev) => ({ ...prev, ...newSettings }));
      return;
    }

    setToolSettings((prev) => ({ ...prev, ...newSettings }));

    // If an element is currently selected, apply the relevant property changes to it immediately
    if (selectedElementIds.length > 0 && currentPage?.elements) {
      for (const selectedId of selectedElementIds) { const selectedElem = currentPage.elements.find((el) => el.id === selectedId);
      if (selectedElem) {
        let updated = { ...selectedElem };
        let changed = false;

        if (selectedElem.type === 'text') {
          if (newSettings.textColor) { updated.color = newSettings.textColor; changed = true; }
          if (newSettings.fontSize) { updated.fontSize = newSettings.fontSize; changed = true; }
          if (newSettings.fontWeight) { updated.fontWeight = newSettings.fontWeight; changed = true; }
          if (newSettings.fontFamily) { updated.fontFamily = newSettings.fontFamily; changed = true; }
          if (newSettings.textAlign) { updated.textAlign = newSettings.textAlign; changed = true; }
          if (newSettings.textDecoration) { updated.textDecoration = newSettings.textDecoration; changed = true; }
        } else if (selectedElem.type === 'highlight') {
          if (newSettings.highlightColor) { updated.color = newSettings.highlightColor; changed = true; }
          if (newSettings.highlightStyle) { updated.style = newSettings.highlightStyle; changed = true; }
        } else if (selectedElem.type === 'shape') {
          if (newSettings.shapeType) { updated.shapeType = newSettings.shapeType; changed = true; }
          if (newSettings.strokeColor) { updated.strokeColor = newSettings.strokeColor; changed = true; }
          if (newSettings.fillColor) { updated.fillColor = newSettings.fillColor; changed = true; }
          if (newSettings.strokeWidth) { updated.strokeWidth = newSettings.strokeWidth; changed = true; }
        } else if (selectedElem.type === 'stamp') {
          if (newSettings.stampColor) { updated.color = newSettings.stampColor; changed = true; }
          if (newSettings.stampText) { updated.text = newSettings.stampText; changed = true; }
        } else if (selectedElem.type === 'comment') {
          if (newSettings.highlightColor) { updated.color = newSettings.highlightColor; changed = true; }
        }

        if (changed) {
          handleUpdateElement(updated);
        }
      }
    } }
  };

  const handleInsertImage = (dataUrl: string) => {
    const imgElem: PageElement = {
      id: `img_${Date.now()}`,
      type: 'image',
      src: dataUrl,
      x: 20,
      y: 20,
      width: 40,
      height: 30,
      opacity: 1,
    };
    handleAddElement(imgElem);
    handleSelectElement(imgElem.id);
  };

  const handleFastDownload = async () => {
    try {
      const pdfBytes = await generateBinaryPdf(doc);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      let finalName = doc.name;
      if (!finalName.includes('_copy')) {
        finalName = finalName.replace('.pdf', '') + '_copy.pdf';
      } else if (!finalName.endsWith('.pdf')) {
        finalName = finalName + '.pdf';
      }
      downloadBlob(blob, finalName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleTogglePageSelection = (idx: number) => {
    setSelectedPagesForExtraction((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      } else {
        return [...prev, idx].sort((a, b) => a - b);
      }
    });
  };

  const handleExtractPages = async () => {
    if (selectedPagesForExtraction.length === 0) return;
    try {
      const extractedPages = selectedPagesForExtraction.map(idx => doc.pages[idx]).filter(Boolean);
      const extractedDoc: PDFDocumentModel = {
        ...doc,
        name: `${doc.name.replace('.pdf', '')}_extracted`,
        pages: extractedPages,
        pageCount: extractedPages.length
      };
      onOpenExportModal(extractedDoc);
      setSelectedPagesForExtraction([]);
    } catch (err) {
      console.error('Error extracting pages:', err);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeTag = document.activeElement?.tagName;
        if (selectedElementIds.length > 0 && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          selectedElementIds.forEach(id => handleDeleteElement(id));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedElementIds]);

  const mainScrollRef = useRef<HTMLElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keep track of manual scrolling vs programmatic scrolling
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    // Scroll to active page when current index changes programmatically
    if (!isProgrammaticScroll.current && pageRefs.current[currentPageIndex] && mainScrollRef.current) {
      isProgrammaticScroll.current = true;
      pageRefs.current[currentPageIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Reset after animation
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  }, [currentPageIndex]);

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    
    if (mainScrollRef.current) {
      const mainRect = mainScrollRef.current.getBoundingClientRect();
      const scrollCenter = mainRect.top + mainRect.height / 3; // Use top third as focal point

      let closestIndex = 0;
      let minDistance = Infinity;

      pageRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - scrollCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      if (closestIndex !== currentPageIndex && closestIndex >= 0) {
        setCurrentPageIndex(closestIndex);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden select-none">
      {/* Top Header / Bar */}
      <header className="bg-white border-b border-slate-200 px-2 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-wrap sm:flex-nowrap items-center justify-between z-30 shrink-0 gap-y-2">
        {/* Left: Back & Title & Save Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 order-1">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Inline Editable Document Name */}
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={docName}
              onChange={(e) => {
                setDocName(e.target.value);
                setDoc((prev) => ({ ...prev, name: e.target.value }));
              }}
              onBlur={() => onSaveDocument({ ...doc, name: docName })}
              className="text-sm font-bold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-lg px-2 py-1 truncate max-w-[200px] sm:max-w-xs transition-all outline-none border border-transparent focus:border-slate-200"
            />

            {/* Autosave badge */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              {saveStatus === 'saving' ? (
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Saved</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Undo, Redo, Page Nav, Zoom, Panel Toggles */}
        <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-1 sm:gap-2 order-3 sm:order-2">
          {/* Undo / Redo */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-md transition-colors ${
                historyIndex > 0
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md transition-colors ${
                historyIndex < history.length - 1
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigator */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
            <button
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>
              {currentPageIndex + 1} / {doc?.pages?.length || 1}
            </span>
            <button
              onClick={() => setCurrentPageIndex(Math.min((doc?.pages?.length || 1) - 1, currentPageIndex + 1))}
              disabled={currentPageIndex >= (doc?.pages?.length || 1) - 1}
              className="p-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 15))}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-medium text-slate-700 w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 15))}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Export */}
        <div className="flex items-center gap-2 order-2 sm:order-3">
          <button
            onClick={() => onOpenExportModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Center Canvas + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Floating Toolbar replacing left sidebar */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <FloatingToolbar 
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            toolSettings={toolSettings}
            onUpdateToolSettings={handleUpdateToolSettings}
            onInsertImage={handleInsertImage}
          />

          {/* Canvas Scroll Area */}
          <main
            ref={mainScrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-auto bg-slate-100 flex flex-col items-center gap-12 py-12 pt-32"
          >
          {doc?.pages?.map((page, idx) => (
            <div
              key={idx}
              ref={(el) => (pageRefs.current[idx] = el)}
              className="flex-shrink-0 relative shadow-2xl transition-all duration-300"
            >
              <PdfCanvas
                document={doc}
                page={page}
                zoom={zoom}
                activeTool={activeTool}
                selectedElementIds={selectedElementIds}
                toolSettings={toolSettings}
                pdfPassword={pdfPassword}
                onUnlockPassword={setPdfPassword}
                globalFormValues={doc.formValues}
                onUpdateFormValues={(values) => setDoc(prev => ({ ...prev, formValues: { ...prev.formValues, ...values } }))}
                onSelectElement={handleSelectElement}
                onUpdateElements={handleUpdateElements}
                onUpdateElement={(updatedElement) => {
                  // Make sure we update the specific page
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.map(e => e.id === updatedElement.id ? updatedElement : e)
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}
                onAddElement={(newElement) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: [...page.elements, newElement]
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}
                onDeleteElement={(id) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.filter(e => e.id !== id)
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}
                onDeleteElements={(ids) => {
                  const updatedPages = [...(doc.pages || [])];
                  updatedPages[idx] = {
                    ...page,
                    elements: page.elements.filter(e => !ids.includes(e.id))
                  };
                  const updatedDoc = { ...doc, pages: updatedPages };
                  pushDocChange(updatedDoc);
                }}
                onApplyRedaction={handleApplyRedaction}
                onSelectTool={setActiveTool}
              />
              
              {/* Page Number Indicator below canvas */}
              <div className="absolute -bottom-8 left-0 right-0 text-center text-sm font-semibold text-slate-400">
                Page {idx + 1}
              </div>
            </div>
          ))}
        </main>
        </div>

        <EditorPagesSidebar
          pages={doc?.pages || []}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onRotatePage={handleRotatePage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onMovePage={handleMovePage}
          onUploadPages={handleUploadPages}
          selectedPagesForExtraction={selectedPagesForExtraction}
          onTogglePageSelection={handleTogglePageSelection}
          onExtractPages={handleExtractPages}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          toolSettings={toolSettings}
          onUpdateToolSettings={handleUpdateToolSettings}
          onOpenSignModal={onOpenSignModal}
          onInsertImage={handleInsertImage}
          userSignatures={userSignatures}
          onDeleteSignature={onDeleteSignature}
          isPagesCollapsed={isPagesCollapsed}
          sidebarMode={rightSidebarMode}
          onSetSidebarMode={setRightSidebarMode}
          onTogglePagesCollapsed={() => setIsPagesCollapsed((prev) => !prev)}
          isToolsCollapsed={isToolsCollapsed}
          onToggleToolsCollapsed={() => setIsToolsCollapsed((prev) => !prev)}
        />
      </div>
    </div>
  );
};
