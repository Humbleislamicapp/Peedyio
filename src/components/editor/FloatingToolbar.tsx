import React, { useRef, useState } from 'react';
import { 
  MousePointer2, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle,
  Minus,
  ArrowRight,
  Highlighter, 
  PenTool, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Strikethrough,
  Underline
} from 'lucide-react';
import { AnnotationTool, ShapeType } from '../../types/pdf';

interface FloatingToolbarProps {
  activeTool: AnnotationTool;
  onSelectTool: (tool: AnnotationTool) => void;
  toolSettings: {
    textColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    textAlign: 'left' | 'center' | 'right';
    textDecoration: 'none' | 'underline' | 'line-through';
    shapeType: ShapeType;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    highlightColor: string;
    drawColor: string;
    commentColor: string;
    drawWidth: number;
  };
  onUpdateToolSettings: (settings: Partial<FloatingToolbarProps['toolSettings']>) => void;
  onInsertImage: (dataUrl: string) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  activeTool,
  onSelectTool,
  toolSettings,
  onUpdateToolSettings,
  onInsertImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showColorDropdown, setShowColorDropdown] = useState(false);

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ToolButton = ({ 
    tool, 
    icon: Icon, 
    label, 
    hasOptions,
    customColor,
    activeColor
  }: { 
    tool: AnnotationTool; 
    icon: React.ElementType; 
    label: string; 
    hasOptions?: boolean;
    customColor?: string;
    activeColor?: string;
  }) => {
    const isActive = activeTool === tool;
    const defaultColor = isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';
    const combinedColor = isActive 
      ? (activeColor || defaultColor) 
      : (customColor || defaultColor);
    
    return (
      <button
        onClick={() => onSelectTool(tool)}
        className={`relative flex flex-col items-center justify-center p-1.5 min-w-[52px] rounded-lg transition-colors ${combinedColor}`}
        title={label}
      >
        <div className="flex items-center">
          <Icon className="w-4 h-4" />
          {hasOptions && (
            <ChevronDown className={`w-3 h-3 ml-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
          )}
        </div>
        <span className="text-[9px] font-medium mt-1 leading-none tracking-tight">{label}</span>
      </button>
    );
  };

  const hasSecondaryRow = ['addText', 'editText', 'shape', 'highlight', 'draw', 'comment'].includes(activeTool);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {/* Primary Row */}
      <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                {/* Mobile-friendly Basic Tools */}
        <div className="flex items-center gap-0.5 px-1">
          <ToolButton tool="select" icon={MousePointer2} label="Select" />
        </div>
        
        <div className="hidden md:block w-px h-5 bg-slate-200 mx-1" />

        {/* Edit Group - Desktop Only */}
        <div className="hidden md:flex items-center gap-0.5 px-1">
          <ToolButton tool="addText" icon={Type} label="Text" hasOptions />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center p-1.5 min-w-[52px] rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Insert Image"
          >
            <div className="flex items-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium mt-1 leading-none tracking-tight">Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <ToolButton tool="shape" icon={Square} label="Shape" hasOptions />
        </div>
        
        <div className="hidden md:block w-px h-5 bg-slate-200 mx-1" />
        
        {/* Review Group - Desktop Only */}
        <div className="hidden md:flex items-center gap-0.5 px-1">
          <ToolButton tool="highlight" icon={Highlighter} label="Highlight" hasOptions />
          <ToolButton tool="draw" icon={PenTool} label="Pen" hasOptions />
          <ToolButton tool="comment" icon={MessageSquare} label="Comment" />
        </div>

        <div className="hidden md:block w-px h-5 bg-slate-200 mx-1" />

        {/* Sign Group */}
        <div className="flex items-center gap-0.5 px-1">
          <ToolButton tool="sign" icon={CheckCircle2} label="Sign" />
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Redact Group */}
        <div className="flex items-center gap-0.5 px-1">
          <ToolButton 
            tool="redact" 
            icon={ShieldAlert} 
            label="Redact" 
            customColor="text-red-500 hover:bg-red-50" 
            activeColor="bg-red-100 text-red-700" 
          />
        </div>
      </div>

      {/* Secondary Row */}
      {hasSecondaryRow && (
        <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm gap-6">
          
          {(activeTool === 'addText' || activeTool === 'editText') && (
            <>
              {/* Selected Font */}
              <div className="flex flex-col gap-0.5 min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-medium">Selected Font</span>
                <select
                  value={toolSettings.fontFamily}
                  onChange={(e) => onUpdateToolSettings({ fontFamily: e.target.value })}
                  className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer appearance-none"
                >
                  <option value="Helvetica Neue">Helvetica Neue</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col gap-0.5 min-w-[70px]">
                <span className="text-[10px] text-slate-400 font-medium">Font Size</span>
                <select
                  value={toolSettings.fontSize}
                  onChange={(e) => onUpdateToolSettings({ fontSize: Number(e.target.value) })}
                  className="text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer appearance-none"
                >
                  <option value={12}>12px</option>
                  <option value={16}>16px</option>
                  <option value={24}>24px</option>
                  <option value={32}>32px</option>
                  <option value={48}>48px</option>
                  <option value={64}>64px</option>
                </select>
              </div>

              {/* Color Dropdown */}
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <div style={{ backgroundColor: toolSettings.textColor }} className="w-5 h-5 rounded-full border border-slate-300" />
                </button>
                {showColorDropdown && (
                  <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex gap-1 z-50">
                    {['#111827', '#4B5563', '#DC2626', '#2563EB', '#059669', '#7C3AED'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onUpdateToolSettings({ textColor: c });
                          setShowColorDropdown(false);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          toolSettings.textColor === c ? 'bg-slate-200' : 'hover:bg-slate-100'
                        }`}
                      >
                        <div style={{ backgroundColor: c }} className="w-5 h-5 rounded-full border border-slate-200/50" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-1" />

              {/* Alignment */}
              <div className="flex items-center gap-1">
                {[
                  { value: 'left', icon: AlignLeft, label: 'Align Left' },
                  { value: 'center', icon: AlignCenter, label: 'Align Center' },
                  { value: 'right', icon: AlignRight, label: 'Align Right' },
                ].map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onUpdateToolSettings({ textAlign: a.value as any })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      toolSettings.textAlign === a.value ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={a.label}
                  >
                    <a.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-1" />

              {/* Text Styles */}
              <div className="flex items-center gap-1">
                <button
                  onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ fontWeight: toolSettings.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    toolSettings.fontWeight === 'bold' ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'underline' ? 'none' : 'underline' })}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    toolSettings.textDecoration === 'underline' ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()} onClick={() => onUpdateToolSettings({ textDecoration: toolSettings.textDecoration === 'line-through' ? 'none' : 'line-through' })}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    toolSettings.textDecoration === 'line-through' ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {activeTool === 'shape' && (
            <>
              <div className="flex items-center gap-2">
                {[
                  { type: 'rect' as ShapeType, icon: Square, label: 'Rectangle' },
                  { type: 'circle' as ShapeType, icon: Circle, label: 'Circle' },
                  { type: 'line' as ShapeType, icon: Minus, label: 'Line' },
                  { type: 'arrow' as ShapeType, icon: ArrowRight, label: 'Arrow' },
                ].map((s) => (
                  <button
                    key={s.type}
                    onClick={() => onUpdateToolSettings({ shapeType: s.type })}
                    className={`p-1.5 rounded-md transition-colors ${
                      toolSettings.shapeType === s.type ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title={s.label}
                  >
                    <s.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Border</span>
                <div className="flex items-center gap-2">
                  {['#1E293B', '#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateToolSettings({ strokeColor: c })}
                      className={`p-1 rounded-md transition-colors ${
                        toolSettings.strokeColor === c ? 'bg-slate-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div style={{ backgroundColor: c }} className="w-5 h-5 rounded-full border border-slate-200/50" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fill</span>
                <div className="flex items-center gap-2">
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
                      title={f.label}
                      className={`p-1 rounded-md transition-colors ${
                        toolSettings.fillColor === f.color ? 'bg-slate-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div style={{ backgroundColor: f.color === 'transparent' ? '#FFFFFF' : f.color }} className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {f.color === 'transparent' ? '✕' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTool === 'highlight' && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Color</span>
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
                    title={h.label}
                    className={`p-1 rounded-md transition-colors ${
                      toolSettings.highlightColor === h.color ? 'bg-slate-200' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div style={{ backgroundColor: h.color }} className="w-5 h-5 rounded-md border border-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'comment' && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Color</span>
              <div className="flex items-center gap-2">
                {[
                  { color: '#FEF08A', label: 'Yellow' },
                  { color: '#BFDBFE', label: 'Blue' },
                  { color: '#BBF7D0', label: 'Green' },
                  { color: '#FBCFE8', label: 'Pink' },
                  { color: '#DDD6FE', label: 'Purple' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => onUpdateToolSettings({ commentColor: c.color })}
                    title={c.label}
                    className={`p-1 rounded-md transition-colors ${
                      toolSettings.commentColor === c.color ? 'bg-slate-200' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div style={{ backgroundColor: c.color }} className="w-5 h-5 rounded-md border border-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'draw' && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Color</span>
                <div className="flex items-center gap-2">
                  {['#111827', '#4B5563', '#DC2626', '#2563EB', '#059669', '#7C3AED'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateToolSettings({ drawColor: c })}
                      className={`p-1 rounded-md transition-colors ${
                        toolSettings.drawColor === c ? 'bg-slate-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div style={{ backgroundColor: c }} className="w-5 h-5 rounded-full border border-slate-200/50" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Size</span>
                <div className="flex items-center gap-2">
                  {[
                    { value: 0.5, label: '.5pt' },
                    { value: 1, label: '1pt' },
                    { value: 2, label: '2pt' }
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => onUpdateToolSettings({ drawWidth: s.value })}
                      title={s.label}
                      className={`p-1 rounded-md transition-colors ${
                        toolSettings.drawWidth === s.value ? 'bg-slate-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded border border-transparent">
                        <div
                          className="bg-slate-800 rounded-full"
                          style={{ width: `${Math.max(2, s.value * 2)}px`, height: `${Math.max(2, s.value * 2)}px` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
