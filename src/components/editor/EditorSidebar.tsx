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
  PanelLeftClose,
  PanelLeftOpen,
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
  onAddBlankPage: () => void;
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
  };
  onUpdateToolSettings: (settings: Partial<EditorSidebarProps['toolSettings']>) => void;
  onOpenSignModal: () => void;
  onInsertImage: (dataUrl: string) => void;
  isPagesCollapsed?: boolean;
  onTogglePagesCollapsed?: () => void;
  isToolsCollapsed?: boolean;
  onToggleToolsCollapsed?: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  pages,
  currentPageIndex,
  onSelectPage,
  onRotatePage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  onAddBlankPage,
  selectedPagesForExtraction = [],
  onTogglePageSelection,
  onExtractPages,
  activeTool,
  onSelectTool,
  toolSettings,
  onUpdateToolSettings,
  onOpenSignModal,
  onInsertImage,
  isPagesCollapsed = false,
  onTogglePagesCollapsed,
  isToolsCollapsed = false,
  onToggleToolsCollapsed,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const stampPresets: { type: StampType; text: string; color: string }[] = [
    { type: 'APPROVED', text: 'APPROVED', color: '#16A34A' },
    { type: 'CONFIDENTIAL', text: 'CONFIDENTIAL', color: '#DC2626' },
    { type: 'DRAFT', text: 'DRAFT', color: '#D97706' },
    { type: 'URGENT', text: 'URGENT', color: '#EA580C' },
    { type: 'PAID', text: 'PAID IN FULL', color: '#059669' },
    { type: 'VOID', text: 'VOID', color: '#64748B' },
  ];

  return (
    <div className="flex h-full border-r border-slate-200 bg-white transition-all duration-200">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Pages Strip */}
      {isPagesCollapsed ? (
        <div className="w-12 border-r border-slate-200 flex flex-col items-center py-3 bg-slate-50 justify-between">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onTogglePagesCollapsed}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Expand Pages Panel"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
            <div className="h-px w-6 bg-slate-200" />
            <button
              onClick={onAddBlankPage}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Add blank page"
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
        <div className="w-56 border-r border-slate-200 flex flex-col h-full bg-slate-50 transition-all">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                Pages ({pages?.length || 0})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onAddBlankPage}
                className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                title="Add blank page"
              >
                <Plus className="w-4 h-4" />
              </button>
              {onTogglePagesCollapsed && (
                <button
                  onClick={onTogglePagesCollapsed}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                  title="Collapse Pages Panel"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                    <div className="mt-auto flex items-center justify-between text-[9px] font-bold text-slate-400 z-10">
                      <span>{idx + 1}</span>
                      {page.rotation !== 0 && (
                        <span className="text-[8px] text-slate-600">{page.rotation}°</span>
                      )}
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
          </div>
        </div>
      )}

      {/* Right Tools Palette */}
      {isToolsCollapsed ? (
        <div className="w-12 flex flex-col items-center py-3 bg-white justify-between border-r border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleToolsCollapsed}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Expand Tools Panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
            <div className="h-px w-6 bg-slate-200" />

            {/* Quick tool icons in collapsed mode */}
            <button
              onClick={() => onSelectTool('select')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'select'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Select / Move"
            >
              <MousePointer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('addText')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'addText' || activeTool === 'editText'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Add Text"
            >
              <Type className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('shape')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'shape'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Shapes"
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('highlight')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'highlight'
                  ? 'bg-zinc-900 text-white'
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('draw')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'draw'
                  ? 'bg-zinc-900 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              title="Freehand Pen"
            >
              <PenTool className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('comment')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'comment'
                  ? 'bg-zinc-900 text-white'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Sticky Note"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('stamp')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'stamp'
                  ? 'bg-zinc-900 text-white'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
              title="Stamp"
            >
              <Stamp className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSignModal}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
              title="Sign Document"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTool('redact')}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === 'redact'
                  ? 'bg-zinc-900 text-white'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
              title="Redaction"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={onToggleToolsCollapsed}
            className="cursor-pointer flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900"
            title="Edit & Tools"
          >
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight transform -rotate-90 origin-center whitespace-nowrap py-3">
              Tools
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[220px] flex flex-col h-full bg-white overflow-y-auto border-r border-slate-200">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-900 tracking-tight">Edit & Annotate</span>
            </div>
            {onToggleToolsCollapsed && (
              <button
                onClick={onToggleToolsCollapsed}
                className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Collapse Tools Panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-3 space-y-4">
            {/* Main Tool Categories */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onSelectTool('select')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'select'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span>Select / Move</span>
              </button>

              <button
                onClick={() => onSelectTool('addText')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'addText' || activeTool === 'editText'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Add Text</span>
              </button>

              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
                <span>Insert Image</span>
              </button>

              <button
                onClick={() => onSelectTool('shape')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'shape'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Shapes</span>
              </button>

              <button
                onClick={() => onSelectTool('highlight')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'highlight'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                <span>Highlight</span>
              </button>

              <button
                onClick={() => onSelectTool('draw')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'draw'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-blue-500" />
                <span>Freehand Pen</span>
              </button>

              <button
                onClick={() => onSelectTool('comment')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'comment'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sticky Note</span>
              </button>

              <button
                onClick={() => onSelectTool('stamp')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'stamp'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Stamp className="w-3.5 h-3.5 text-rose-500" />
                <span>Stamps</span>
              </button>

              <button
                onClick={onOpenSignModal}
                className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-semibold">Sign Document</span>
              </button>

              <button
                onClick={() => onSelectTool('redact')}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === 'redact'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Permanent Redaction</span>
              </button>
            </div>

            <hr className="border-zinc-100" />

            {/* Contextual Properties based on selected tool */}
            {(activeTool === 'addText' || activeTool === 'editText') && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Text Properties
                </span>

                <div>
                  <label className="text-xs text-zinc-600 mb-1 block">Font Size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="9"
                      max="36"
                      value={toolSettings.fontSize}
                      onChange={(e) => onUpdateToolSettings({ fontSize: Number(e.target.value) })}
                      className="flex-1 accent-zinc-900"
                    />
                    <span className="text-xs font-mono text-zinc-700 w-6">
                      {toolSettings.fontSize}px
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-600 mb-1 block">Color</label>
                  <div className="flex items-center gap-2">
                    {['#111827', '#4B5563', '#DC2626', '#2563EB', '#059669', '#7C3AED'].map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateToolSettings({ textColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border border-zinc-200 transition-transform ${
                          toolSettings.textColor === c ? 'scale-110 ring-2 ring-zinc-900 ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'shape' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Shape Type
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'rect' as ShapeType, icon: Square, label: 'Rect' },
                    { id: 'circle' as ShapeType, icon: Circle, label: 'Circle' },
                    { id: 'line' as ShapeType, icon: Minus, label: 'Line' },
                    { id: 'arrow' as ShapeType, icon: ArrowRight, label: 'Arrow' },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => onUpdateToolSettings({ shapeType: s.id })}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 text-[10px] ${
                          toolSettings.shapeType === s.id
                            ? 'border-zinc-900 bg-zinc-100 font-bold'
                            : 'border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-zinc-700" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 mb-1 block">Border Color</label>
                  <div className="flex items-center gap-1.5">
                    {['#1E293B', '#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED'].map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateToolSettings({ strokeColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-zinc-200 transition-transform ${
                          toolSettings.strokeColor === c ? 'scale-125 ring-2 ring-zinc-900 ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-600 mb-1 block">Fill Color</label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { color: 'transparent', label: 'None' },
                      { color: '#FEF08A', label: 'Yellow' },
                      { color: '#BFDBFE', label: 'Blue' },
                      { color: '#BBF7D0', label: 'Green' },
                      { color: '#FBCFE8', label: 'Pink' },
                      { color: '#E2E8F0', label: 'Slate' },
                    ].map((f) => (
                      <button
                        key={f.color}
                        onClick={() => onUpdateToolSettings({ fillColor: f.color })}
                        style={{ backgroundColor: f.color === 'transparent' ? '#FFFFFF' : f.color }}
                        className={`w-5 h-5 rounded border border-zinc-300 text-[8px] font-bold flex items-center justify-center transition-transform ${
                          toolSettings.fillColor === f.color ? 'scale-125 ring-2 ring-zinc-900 ring-offset-1' : ''
                        }`}
                        title={f.label}
                      >
                        {f.color === 'transparent' ? '✕' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-600 mb-1 block">Border Width</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={toolSettings.strokeWidth || 2}
                      onChange={(e) => onUpdateToolSettings({ strokeWidth: Number(e.target.value) })}
                      className="flex-1 accent-zinc-900"
                    />
                    <span className="text-xs font-mono text-zinc-700 w-6">
                      {toolSettings.strokeWidth || 2}px
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'highlight' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Highlight Palette
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { color: '#FEF08A', label: 'Yellow' },
                    { color: '#BBF7D0', label: 'Green' },
                    { color: '#BAE6FD', label: 'Blue' },
                    { color: '#FBCFE8', label: 'Pink' },
                    { color: '#FED7AA', label: 'Orange' },
                  ].map((h) => (
                    <button
                      key={h.color}
                      onClick={() => onUpdateToolSettings({ highlightColor: h.color })}
                      style={{ backgroundColor: h.color }}
                      className={`w-7 h-7 rounded-lg border border-zinc-300 transition-transform ${
                        toolSettings.highlightColor === h.color
                          ? 'scale-110 ring-2 ring-zinc-900 ring-offset-1'
                          : ''
                      }`}
                      title={h.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTool === 'stamp' && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Predefined Stamps
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {stampPresets.map((st) => (
                    <button
                      key={st.type}
                      onClick={() =>
                        onUpdateToolSettings({
                          stampType: st.type,
                          stampText: st.text,
                          stampColor: st.color,
                        })
                      }
                      style={{ borderColor: st.color, color: st.color }}
                      className={`p-1.5 rounded-md border-2 text-[10px] font-bold tracking-wider uppercase transition-transform ${
                        toolSettings.stampType === st.type ? 'bg-zinc-50 scale-105 shadow-xs' : 'bg-white'
                      }`}
                    >
                      {st.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

