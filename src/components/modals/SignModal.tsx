import React, { useState, useRef } from 'react';
import {
  X,
  PenTool,
  Type,
  Upload,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (signatureData: {
    type: 'drawn' | 'typed' | 'image';
    dataUrl: string;
    signerName: string;
  }) => void;
}

export const SignModal: React.FC<SignModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
}) => {
  const [tab, setTab] = useState<'type' | 'draw' | 'upload'>('type');
  const [typedName, setTypedName] = useState('Jane Doe');
  const [selectedFont, setSelectedFont] = useState<'greatvibes' | 'caveat'>('greatvibes');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    if (tab === 'draw' && canvasRef.current) {
      onSaveSignature({
        type: 'drawn',
        dataUrl: canvasRef.current.toDataURL(),
        signerName: typedName,
      });
      onClose();
    } else if (tab === 'type') {
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        tempCanvas.width = 600;
        tempCanvas.height = 200;
        
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        // Match the selected font
        if (selectedFont === 'greatvibes') {
          ctx.font = '72px "Great Vibes", cursive';
        } else {
          ctx.font = '72px Caveat, cursive';
        }
        
        // Wait briefly for font to be loaded if possible, fallback to drawing immediately
        await document.fonts.ready;
        ctx.fillText(typedName || 'Signatory', tempCanvas.width / 2, tempCanvas.height / 2);
        
        onSaveSignature({
          type: 'typed',
          dataUrl: tempCanvas.toDataURL(),
          signerName: typedName || 'Signatory',
        });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Create Signature</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              onClick={() => setTab('type')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'type' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
              }`}
            >
              Type
            </button>
            <button
              onClick={() => setTab('draw')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'draw' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
              }`}
            >
              Draw
            </button>
          </div>

          {tab === 'type' ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Your Full Legal Name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setSelectedFont('greatvibes')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedFont === 'greatvibes'
                      ? 'border-zinc-900 bg-zinc-50 font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <p className="font-signature-greatvibes text-xl text-zinc-900 truncate">
                    {typedName || 'Signature'}
                  </p>
                  <span className="text-[10px] text-zinc-400">Classic</span>
                </button>

                <button
                  onClick={() => setSelectedFont('caveat')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedFont === 'caveat'
                      ? 'border-zinc-900 bg-zinc-50 font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <p className="font-signature-caveat text-xl text-zinc-900 truncate">
                    {typedName || 'Signature'}
                  </p>
                  <span className="text-[10px] text-zinc-400">Casual</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700">Draw below</label>
                <button
                  onClick={handleClear}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="border border-zinc-300 rounded-xl p-1 bg-zinc-50">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={130}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-32 bg-white rounded-lg cursor-crosshair touch-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Use Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
};
