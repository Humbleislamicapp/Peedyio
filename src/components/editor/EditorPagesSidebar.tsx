import React, { useState, useRef } from 'react';
import {
  MousePointer,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Highlighter,
  Underline,
  Strikethrough,
  PenTool,
  MessageSquare,
  Stamp,
  CheckCircle2,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  RotateCw,
  ArrowUp,
  ArrowDown,
  PanelRightClose,
  PanelRightOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Wrench,
  Settings2,
  Share2
} from 'lucide-react';
import {
  PDFPageModel,
  AnnotationTool,
  ShapeType,
  StampType
} from '../../types/pdf';

interface EditorSidebarProps {
  pages: PDFPageModel[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onUploadPages: (file: File) => void;
  selectedPagesForExtraction?: number[];
  onTogglePageSelection?: (index: number) => void;
  onExtractPages?: () => void;
  activeTool: AnnotationTool;
  onSelectTool: (tool: AnnotationTool) => void;
  toolSettings: {
    textColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    shapeType: ShapeType;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    highlightColor: string;
    highlightStyle: 'highlight' | 'underline' | 'strikethrough';
    drawColor: string;
    drawWidth: number;
    stampType: StampType;
    stampText: string;
    stampColor: string;
    signatureDataUrl?: string;
    signerName?: string;
    activeSignatureId?: string;
  };
  onUpdateToolSettings: (settings: Partial<any>) => void;
  onOpenSignModal: () => void;
  onInsertImage: (dataUrl: string) => void;
  userSignatures?: {
    id: string;
    type: 'drawn' | 'typed' | 'image';
    dataUrl: string;
    signerName: string;
  }[];
  onDeleteSignature?: (id: string) => void;
  sidebarMode?: 'pages' | 'review' | 'sign';
  onSetSidebarMode?: (mode: 'pages' | 'review' | 'sign') => void;
  isPagesCollapsed?: boolean;
  onTogglePagesCollapsed?: () => void;
  isToolsCollapsed?: boolean;
  onToggleToolsCollapsed?: () => void;
}

export const EditorPagesSidebar: React.FC<EditorSidebarProps> = ({
  pages,
  currentPageIndex,
  onSelectPage,
  onRotatePage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  onUploadPages,
  selectedPagesForExtraction = [],
  onTogglePageSelection,
  onExtractPages,
  activeTool,
  onSelectTool,
  toolSettings,
  onUpdateToolSettings,
  onOpenSignModal,
  onInsertImage,
  userSignatures = [],
  onDeleteSignature,
  sidebarMode = 'pages',
  onSetSidebarMode,
  isPagesCollapsed = false,
  onTogglePagesCollapsed,
  isToolsCollapsed = false,
  onToggleToolsCollapsed,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pagesInputRef = useRef<HTMLInputElement>(null);

  const handlePagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPages) {
      onUploadPages(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onInsertImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const signFields = (pages || []).flatMap((p, i) => p.elements?.filter(e => e.type === 'signature').map(e => ({ pageIndex: i, element: e })) || []);
  const reviewItems = (pages || []).flatMap((p, i) => p.elements?.filter(e => e.type === 'comment').map(e => ({ pageIndex: i, element: e })) || []);

  const [currentSignIndex, setCurrentSignIndex] = useState(0);

  React.useEffect(() => {
    if (sidebarMode === 'sign' && signFields.length > 0) {
      onSelectPage(signFields[0].pageIndex);
      setCurrentSignIndex(0);
    }
  }, [sidebarMode]);

  const handleNextSign = () => {
    if (currentSignIndex < signFields.length - 1) {
      const nextIndex = currentSignIndex + 1;
      setCurrentSignIndex(nextIndex);
      onSelectPage(signFields[nextIndex].pageIndex);
    }
  };

  const handlePrevSign = () => {
    if (currentSignIndex > 0) {
      const prevIndex = currentSignIndex - 1;
      setCurrentSignIndex(prevIndex);
      onSelectPage(signFields[prevIndex].pageIndex);
    }
  };

  const stampPresets: { type: StampType; text: string; color: string }[] = [
    { type: 'APPROVED', text: 'APPROVED', color: '#16A34A' },
    { type: 'CONFIDENTIAL', text: 'CONFIDENTIAL', color: '#DC2626' },
    { type: 'DRAFT', text: 'DRAFT', color: '#D97706' },
    { type: 'URGENT', text: 'URGENT', color: '#EA580C' },
    { type: 'PAID', text: 'PAID IN FULL', color: '#059669' },
    { type: 'VOID', text: 'VOID', color: '#64748B' },
  ];

  return (
    <div className="flex h-full border-l border-slate-200 bg-white transition-all duration-200">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        type="file"
        accept=".pdf,image/*"
        ref={pagesInputRef}
        className="hidden"
        onChange={handlePagesUpload}
      />

      {/* Pages Strip */}
      {isPagesCollapsed ? (
        <div className="w-12 border-l border-slate-200 flex flex-col items-center py-3 bg-slate-50 justify-between">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onTogglePagesCollapsed}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Expand Pages Panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
            <div className="h-px w-6 bg-slate-200" />
            <button
              onClick={() => pagesInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Add pages from another file"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={onTogglePagesCollapsed}
            className="cursor-pointer flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900"
            title="Pages"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight transform -rotate-90 origin-center whitespace-nowrap py-3">
              Pages ({pages?.length || 0})
            </span>
          </div>

          <div className="text-[10px] font-mono font-semibold text-slate-400">
            {currentPageIndex + 1}/{pages?.length || 1}
          </div>
        </div>
      ) : (
        <div className="w-56 border-l border-slate-200 flex flex-col h-full bg-slate-50 transition-all">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {sidebarMode === 'review' ? (
                <>
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Review</span>
                </>
              ) : sidebarMode === 'sign' ? (
                <>
                  <PenTool className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Sign Document</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">
                    Pages ({pages?.length || 0})
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {sidebarMode === 'pages' && (
                <button
                  onClick={() => pagesInputRef.current?.click()}
                  className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                  title="Add pages from another file"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              {onTogglePagesCollapsed && (
                <button
                  onClick={onTogglePagesCollapsed}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                  title="Collapse Pages Panel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {sidebarMode === 'pages' && (
              <>

            {selectedPagesForExtraction.length > 0 && onExtractPages && (
              <div className="mb-2">
                <button
                  onClick={onExtractPages}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Extract {selectedPagesForExtraction.length} {selectedPagesForExtraction.length === 1 ? 'Page' : 'Pages'}
                </button>
              </div>
            )}
            {(pages || []).map((page, idx) => {
              const isSelected = idx === currentPageIndex;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectPage(idx)}
                  className={`group relative p-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-white shadow-sm ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Mini page representation */}
                  <div className="aspect-[3/4] bg-white border border-slate-100 rounded-md p-1.5 flex flex-col justify-between overflow-hidden relative shadow-2xs">
                    {onTogglePageSelection && (
                      <div className="absolute top-1 left-1 z-10" onClick={(e) => { e.stopPropagation(); onTogglePageSelection(idx); }}>
                        <input type="checkbox" checked={selectedPagesForExtraction.includes(idx)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" readOnly />
                      </div>
                    )}
                    <div className="absolute inset-0 pt-6 px-1.5 pb-4 pointer-events-none overflow-hidden">
                      {page.elements?.map(el => {
                        if (el.type === 'text') {
                          return <div key={el.id} className="absolute bg-slate-200/50 rounded-sm" style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%` }} />
                        }
                        if (el.type === 'shape') {
                          return <div key={el.id} className="absolute border border-slate-400/50" style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%`, borderRadius: el.shapeType === 'circle' ? '50%' : '1px' }} />
                        }
                        if (el.type === 'highlight') {
                          return <div key={el.id} className="absolute bg-yellow-200/50" style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%` }} />
                        }
                        return null;
                      })}
                      {(!page.elements || page.elements.length === 0) && (
                        <div className="space-y-1 opacity-60">
                          <div className="h-1.5 w-3/4 bg-slate-400 rounded-xs"></div>
                          <div className="h-1 w-full bg-slate-200 rounded-xs"></div>
                          <div className="h-1 w-5/6 bg-slate-200 rounded-xs"></div>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-[9px] font-bold z-10">
                      <span className={isSelected ? 'text-blue-600' : 'text-slate-400'}>{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        {page.rotation !== 0 && (
                          <span className="text-[8px] text-slate-600">{page.rotation}°</span>
                        )}
                        {page.elements?.some(e => e.type === 'comment' && !(e as any).isPrivateNote) && (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="w-2 h-2 text-blue-600" />
                          </div>
                        )}
                        {page.elements?.some(e => e.type === 'comment' && (e as any).isPrivateNote) && (
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-100 flex items-center justify-center">
                            <EyeOff className="w-2 h-2 text-amber-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Page Quick Actions on Hover */}
                  <div className="mt-1.5 flex items-center justify-between px-0.5">
                    <span className="text-[11px] font-medium text-slate-600">Page {idx + 1}</span>

                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRotatePage(idx);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePage(idx);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {(pages?.length || 0) > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePage(idx);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete page"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded border border-slate-200 shadow-xs">
                    {idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovePage(idx, idx - 1);
                        }}
                        className="p-0.5 text-slate-500 hover:text-slate-900"
                        title="Move up"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {idx < (pages?.length || 0) - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovePage(idx, idx + 1);
                        }}
                        className="p-0.5 text-slate-500 hover:text-slate-900"
                        title="Move down"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </>
            )}

            {sidebarMode === 'review' && (
              <div className="flex flex-col gap-3">
                {reviewItems.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No comments or notes yet.</p>
                  </div>
                ) : (
                  reviewItems.map((item, idx) => {
                    const isPrivate = (item.element as any).isPrivateNote;
                    return (
                      <div 
                        key={idx}
                        onClick={() => onSelectPage(item.pageIndex)}
                        className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer shadow-2xs group transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isPrivate ? (
                              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <div className={`w-2 h-2 rounded-full ${(item.element as any).resolved ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            )}
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Page {item.pageIndex + 1}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{(item.element as any).createdAt || 'Just now'}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium line-clamp-3">{(item.element as any).text}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{(item.element as any).author || 'Reviewer'}</span>
                          {!(item.element as any).resolved && !isPrivate && (
                            <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">Unresolved</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}            {sidebarMode === 'sign' && (
              <div className="flex flex-col gap-4">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <h3 className="text-xs font-bold text-purple-900 mb-1">Your Signatures</h3>
                  <p className="text-[10px] text-purple-700 leading-tight mb-3">
                    Select a signature to use. Click on the document to stamp it.
                  </p>
                  
                  <div className="space-y-2">
                    {userSignatures.map((sig) => (
                      <div 
                        key={sig.id}
                        onClick={() => {
                          onUpdateToolSettings({ signatureDataUrl: sig.dataUrl, signerName: sig.signerName, activeSignatureId: sig.id });
                          onSelectTool('sign');
                        }}
                        className={`group relative flex items-center justify-center p-2 rounded-lg border-2 bg-white cursor-pointer transition-all ${
                          toolSettings.activeSignatureId === sig.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <img src={sig.dataUrl} alt="Signature" className="max-h-12 object-contain" />
                        
                        {onDeleteSignature && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSignature(sig.id);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-slate-100/80 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete Signature"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {userSignatures.length < 2 && (
                      <button
                        onClick={onOpenSignModal}
                        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-purple-400 transition-colors text-slate-500 hover:text-purple-600"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-xs font-bold">Add Signature</span>
                        <span className="text-[9px] text-slate-400 font-medium">({2 - userSignatures.length} remaining)</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 px-1">Quick Stamps</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {stampPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onUpdateToolSettings({ stampType: preset.type, stampText: preset.text, stampColor: preset.color });
                          onSelectTool('stamp');
                        }}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all ${
                          toolSettings.stampType === preset.type 
                            ? 'border-slate-400 bg-slate-100 shadow-sm text-slate-800' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                        style={{
                          color: toolSettings.stampType === preset.type ? preset.color : undefined
                        }}
                      >
                        {preset.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
