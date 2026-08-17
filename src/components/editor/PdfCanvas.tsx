import React, { useState, useRef, useEffect, useCallback } from 'react';

const EditableTextElement = ({ elem, isSelected, scale, onUpdateElement, onSelectElement }: any) => {
  const textRef = React.useRef(elem.text);
  const domRef = React.useRef<HTMLDivElement>(null);

  // Sync prop changes if they come from outside
  React.useEffect(() => {
    if (domRef.current && elem.text !== textRef.current) {
      domRef.current.innerHTML = elem.text;
      textRef.current = elem.text;
    }
  }, [elem.text]);

  React.useEffect(() => {
    if (!domRef.current) return;
    const observer = new MutationObserver(() => {
      if (domRef.current) {
        textRef.current = domRef.current.innerHTML;
      }
    });
    observer.observe(domRef.current, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    textRef.current = e.currentTarget.innerHTML;
  };

  const handleBlur = () => {
    onUpdateElement({
      ...elem,
      text: textRef.current || 'Type text here...',
    });
  };

  return (
    <div
      ref={(el) => {
        domRef.current = el;
        if (el && isSelected && window.document.activeElement !== el && !el.dataset.autofocused && elem.text === 'Type text here...') {
          el.dataset.autofocused = 'true';
          el.focus();
          const range = window.document.createRange();
          const sel = window.getSelection();
          if (el.childNodes.length > 0) {
            range.selectNodeContents(el);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        fontSize: `${(elem.fontSize || 13) * scale}px`,
        fontFamily: elem.fontFamily || 'Helvetica Neue',
        color: elem.color || '#111827',
        fontWeight: elem.fontWeight || 'normal',
        textAlign: elem.textAlign || 'left',
        textDecoration: elem.textDecoration || 'none',
        lineHeight: 1.4,
      }}
      className="w-full h-full outline-none whitespace-pre-wrap break-words cursor-text p-0.5 select-text"
      dangerouslySetInnerHTML={{ __html: textRef.current }}
    />
  );
};

import {
  PDFPageModel,
  PageElement,
  AnnotationTool,
  ShapeType,
  StampType,
  DrawingPoint
} from '../../types/pdf';
import {
  Trash2,

  Copy,
  RotateCw,
  Check,
  X,
  Sparkles,
  Maximize2,
  Pin,
  MessageSquare,
  Square,
  Circle,
  Palette,
  GripHorizontal
} from 'lucide-react';

import { PDFDocumentModel } from '../../types/pdf';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface PdfCanvasProps {
  document?: PDFDocumentModel;
  page: PDFPageModel;
  zoom: number; // percentage (e.g. 100)
  activeTool: AnnotationTool;
  selectedElementIds: string[];
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
  };
  onSelectElement: (id: string | string[] | null) => void;
  onUpdateElement: (updatedElem: PageElement) => void;
  onAddElement: (newElem: PageElement) => void;
  onDeleteElement: (id: string) => void;
  onDeleteElements?: (ids: string[]) => void;
  onUpdateFormValues?: (values: Record<string, any>) => void;
  globalFormValues?: Record<string, any>;
  onApplyRedaction: (elemId: string) => void;
  onSelectTool?: (tool: AnnotationTool) => void;
  onDuplicateElement?: (id: string) => void;
  pdfPassword?: string | null;
  onUnlockPassword?: (password: string) => void;
}

export const PdfCanvas: React.FC<PdfCanvasProps> = ({
  document,
  page,
  zoom,
  activeTool,
  selectedElementIds,
  toolSettings,
  pdfPassword,
  onUnlockPassword,
  onSelectElement,
  onUpdateElement,
  onUpdateElements,
  onAddElement,
  onDeleteElement,
  onDeleteElements,
  onUpdateFormValues,
  globalFormValues,
  onApplyRedaction,
  onSelectTool,
  onDuplicateElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfRenderError, setPdfRenderError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordCallback, setPasswordCallback] = useState<((password: string) => void) | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const [pdfFormFields, setPdfFormFields] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleFormValueChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    if (onUpdateFormValues) {
      onUpdateFormValues({ [fieldName]: value });
    }
  };

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[]>([]);

  // Dragging state for moving existing elements
  const [arrowDragState, setArrowDragState] = useState<{sourceId: string, currentX: number, currentY: number} | null>(null);
  const [dragState, setDragState] = useState<{
    elementIds: string[];
    startX: number;
    startY: number;
    initialPositions: { id: string; x: number; y: number; width: number; height: number }[];
  } | null>(null);

  // Resizing state for resizing existing elements
  const [resizeState, setResizeState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startElemX: number;
    startElemY: number;
    handle: 'se' | 'e' | 's' | 'sw' | 'ne' | 'nw';
  } | null>(null);

  // Creation Drag State for drawing shapes, highlight, redaction, text, or notes over the document
  const [creationDrag, setCreationDrag] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    tool: AnnotationTool;
  } | null>(null);

  // Calculate scaled dimensions
  const scale = zoom / 100;
  const pageWidth = (page?.width || 595) * scale;
  const pageHeight = (page?.height || 842) * scale;

  // Handle pointer down on canvas to start drawing a shape, highlight, redaction, or text
  // Handle PDF rendering
  useEffect(() => {
    let active = true;
    const renderPdf = async () => {
      if (!document?.rawBytes || !pdfCanvasRef.current || page.isBlank) {
        if (pdfCanvasRef.current) {
          const ctx = pdfCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, pdfCanvasRef.current.width, pdfCanvasRef.current.height);
          }
        }
        return;
      }
      
      try {
        setIsRendering(true);
        setPdfRenderError(null);
        
        const loadingTask = pdfjsLib.getDocument({ 
          data: document.rawBytes.slice(0),
          password: pdfPassword || undefined
        });
        
        // Handle password protected PDFs
        loadingTask.onPassword = (updatePassword, reason) => {
          if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
            setPdfRenderError("This PDF is password protected. Enter password to view.");
            setIsPasswordProtected(true);
            setPasswordCallback(() => updatePassword);
          } else if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
            setPdfRenderError("Incorrect password. Please try again.");
            setIsPasswordProtected(true);
            setPasswordCallback(() => updatePassword);
          }
        };

        const pdf = await loadingTask.promise;
        
        if (!active) return;
        
        // PDF.js pages are 1-indexed
        const targetPageNum = page.originalPageNumber || page.pageNumber;
        const pdfPage = await pdf.getPage(targetPageNum);
        
        if (!active) return;
        
        const viewport = pdfPage.getViewport({ scale: zoom / 100 });
        const canvas = pdfCanvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // We match our canvas to the actual viewport size (at 1x) to ensure pixel accuracy
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        canvas.width = baseViewport.width;
        canvas.height = baseViewport.height;
        
        // Scale context up to zoom level
        // Actually, if our container handles the zoom via CSS, we just render the canvas at 1x resolution.
        // Wait, for crispness we might want to render at scale and let CSS size it down.
        // For simplicity and matching standard viewers, we'll render at standard scale.
        // Or better: render at scale * window.devicePixelRatio for crispness
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = baseViewport.width * pixelRatio;
        canvas.height = baseViewport.height * pixelRatio;
        
        const renderContext: any = {
          canvasContext: context,
          viewport: pdfPage.getViewport({ scale: pixelRatio }),
        };
        
        await pdfPage.render(renderContext).promise;
        
        if (!active) return;

        // Fetch form field annotations
        try {
          const annotations = await pdfPage.getAnnotations();
          const formFields = annotations.filter((a: any) => a.subtype === 'Widget' && a.fieldType);
          
          const mappedFields = formFields.map((a: any) => {
            const p1 = baseViewport.convertToViewportPoint(a.rect[0], a.rect[1]);
            const p2 = baseViewport.convertToViewportPoint(a.rect[2], a.rect[3]);
            const vx1 = p1[0];
            const vy1 = p1[1];
            const vx2 = p2[0];
            const vy2 = p2[1];
            
            const x = (Math.min(vx1, vx2) / baseViewport.width) * 100;
            const y = (Math.min(vy1, vy2) / baseViewport.height) * 100;
            const w = (Math.abs(vx2 - vx1) / baseViewport.width) * 100;
            const h = (Math.abs(vy2 - vy1) / baseViewport.height) * 100;
            
            return {
              id: a.id,
              fieldType: a.fieldType, // 'Tx' (Text), 'Btn' (Checkbox/Radio/Button), 'Ch' (Dropdown/Choice)
              fieldName: a.fieldName || a.id,
              fieldValue: a.fieldValue || '',
              x, y, w, h,
              multiLine: a.multiLine || false,
              required: a.fieldFlags ? (a.fieldFlags & 2) !== 0 : false,
              checkBox: a.checkBox || false,
              radioButton: a.radioButton || false,
              options: a.options || [],
            };
          });

          // Sort fields to establish a logical visual Tab order (Top to Bottom, Left to Right)
          mappedFields.sort((a: any, b: any) => {
            if (Math.abs(a.y - b.y) > 2) {
              return a.y - b.y; // Primary sort by Y
            }
            return a.x - b.x; // Secondary sort by X
          });

          setPdfFormFields(mappedFields);

          // Initialize form values
          const initialValues: Record<string, any> = {};
          mappedFields.forEach((f: any) => {
            // For checkboxes, fieldValue often contains the export value when checked
            initialValues[f.id] = f.fieldValue;
          });
          setFormValues((prev) => ({ ...prev, ...initialValues }));
          if (onUpdateFormValues) {
            onUpdateFormValues(initialValues);
          }

        } catch (annotErr) {
          console.error("Failed to fetch annotations:", annotErr);
        }

      } catch (err: any) {
        console.error('Error rendering PDF page:', err);
        if (err.name === 'PasswordException') {
            setPdfRenderError("This PDF is password protected.");
            setIsPasswordProtected(true);
        } else if (err.name === 'MissingPDFException') {
            setPdfRenderError("Invalid or missing PDF data.");
        } else {
            // Check for missing font error
            if (err.message?.includes('font')) {
               setPdfRenderError("Some fonts in this document aren't available — text may appear in a substitute font.");
               // It might still render partially, so we don't block
            } else {
               setPdfRenderError("Failed to render PDF page. " + (err.message || ''));
            }
        }
      } finally {
        if (active) setIsRendering(false);
      }
    };
    
    renderPdf();
    
    return () => { active = false; };
  }, [document?.rawBytes, page.pageNumber, zoom, pdfPassword]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'draw') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = ((e.clientX - rect.left) / pageWidth) * 100;
    const startY = ((e.clientY - rect.top) / pageHeight) * 100;

    setCreationDrag({
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      tool: activeTool,
    });
  };

  // Drawing Canvas logic for freehand pen
  const handleMouseDownDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'draw') return;
    const rect = drawingCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startPt = {
      x: ((e.clientX - rect.left) / pageWidth) * 100,
      y: ((e.clientY - rect.top) / pageHeight) * 100,
    };
    setIsDrawing(true);
    setCurrentStroke([startPt]);
  };

  const handleMouseMoveDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== 'draw') return;
    const rect = drawingCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pt = {
      x: ((e.clientX - rect.left) / pageWidth) * 100,
      y: ((e.clientY - rect.top) / pageHeight) * 100,
    };
    setCurrentStroke((prev) => [...prev, pt]);

    // Live draw on canvas
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = toolSettings.drawColor || '#2563EB';
        ctx.lineWidth = (toolSettings.drawWidth || 3) * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        currentStroke.forEach((p, idx) => {
          const px = (p.x / 100) * canvas.width;
          const py = (p.y / 100) * canvas.height;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
    }
  };

  const handleMouseUpDrawing = () => {
    if (!isDrawing || activeTool !== 'draw') return;
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      const xs = currentStroke.map(p => p.x);
      const ys = currentStroke.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      
      const padding = 0.5; // add a little padding
      const x = Math.max(0, minX - padding);
      const y = Math.max(0, minY - padding);
      const width = Math.max(1, maxX - minX + padding * 2);
      const height = Math.max(1, maxY - minY + padding * 2);

      const newDrawing: PageElement = {
        id: `draw_${Date.now()}`,
        type: 'drawing',
        x,
        y,
        width,
        height,
        points: currentStroke.map(pt => ({
          x: pt.x - x,
          y: pt.y - y
        })),
        color: toolSettings.drawColor || '#2563EB',
        strokeWidth: toolSettings.drawWidth || 3,
      };
      onAddElement(newDrawing);
    }
    setCurrentStroke([]);
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Element Dragging & Repositioning Initiation
  const handleElemMouseDown = (e: React.MouseEvent, elem: PageElement) => {
    // If user is actively drawing with pen, let canvas handle it
    if (activeTool === 'draw') return;

    // Don't initiate drag if clicking an interactive control inside the element
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.closest('[contenteditable="true"]') ||
      target.closest('.no-drag')
    ) {
      e.stopPropagation();
      onSelectElement(elem.id);
      return;
    }

    e.stopPropagation();
    onSelectElement(elem.id);

    // Switch tool to select so user can immediately move and manipulate
    if (activeTool !== 'select' && activeTool !== 'editText') {
      onSelectTool?.('select');
    }

    let elemWidth = elem.width;
    let elemHeight = elem.height;

    // Auto-expand comment if it's currently collapsed (width <= 5)
    if (elem.type === 'comment' && elem.width <= 5) {
      elemWidth = 26;
      elemHeight = 15;
      onUpdateElement({
        ...elem,
        width: elemWidth,
        height: elemHeight
      });
    }

    const idsToDrag = selectedElementIds.includes(elem.id) ? selectedElementIds : [elem.id];
    setDragState({
      elementIds: idsToDrag,
      startX: e.clientX,
      startY: e.clientY,
      initialPositions: (page?.elements || []).filter(el => idsToDrag.includes(el.id)).map(el => ({ id: el.id, x: el.x, y: el.y, width: el.width || 20, height: el.height || 10 }))
    });
  };

  // Resizing Initiation
  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    elem: PageElement,
    handle: 'se' | 'e' | 's' | 'sw' | 'ne' | 'nw'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectElement(elem.id);

    setResizeState({
      elementId: elem.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: elem.width,
      startHeight: elem.height,
      startElemX: elem.x,
      startElemY: elem.y,
      handle,
    });
  };

  // Global Mouse Move and Mouse Up Listeners for Dragging, Resizing, and Shape/Highlight Creation
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      // 1. Handling Shape / Highlight / Text / Redaction Creation Drag
      if (arrowDragState) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const currentX = ((e.clientX - rect.left) / pageWidth) * 100;
          const currentY = ((e.clientY - rect.top) / pageHeight) * 100;
          setArrowDragState(prev => prev ? { ...prev, currentX, currentY } : null);
        }
        return;
      }
      
      if (creationDrag) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const currentX = ((e.clientX - rect.left) / pageWidth) * 100;
          const currentY = ((e.clientY - rect.top) / pageHeight) * 100;
          setCreationDrag((prev) => (prev ? { ...prev, currentX, currentY } : null));
        }
      }

      // 2. Handling Drag / Move of existing elements
      if (dragState) {
        const deltaX = ((e.clientX - dragState.startX) / pageWidth) * 100;
        const deltaY = ((e.clientY - dragState.startY) / pageHeight) * 100;

        const updates = dragState.initialPositions.map((pos) => {
          let newX = pos.x + deltaX;
          let newY = pos.y + deltaY;
          
          newX = Math.max(0, Math.min(newX, 100 - pos.width));
          newY = Math.max(0, Math.min(newY, 100 - pos.height));

          const target = (page?.elements || []).find((el) => el.id === pos.id);
          if (!target) return null;
          return {
            ...target,
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
          };
        }).filter(Boolean);

        if (updates.length > 0) {
          if (onUpdateElements && updates.length > 1) {
            onUpdateElements(updates);
          } else {
            updates.forEach(u => onUpdateElement(u));
          }
        }
      }

      // 3. Handling Resizing of existing elements
      if (resizeState) {
        const deltaX = ((e.clientX - resizeState.startX) / pageWidth) * 100;
        const deltaY = ((e.clientY - resizeState.startY) / pageHeight) * 100;

        const target = (page?.elements || []).find((el) => el.id === resizeState.elementId);
        if (!target) return;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startElemX;
        let newY = resizeState.startElemY;

        if (resizeState.handle === 'se') {
          newWidth = Math.max(4, Math.min(100 - newX, resizeState.startWidth + deltaX));
          newHeight = Math.max(2, Math.min(100 - newY, resizeState.startHeight + deltaY));
        } else if (resizeState.handle === 'e') {
          newWidth = Math.max(4, Math.min(100 - newX, resizeState.startWidth + deltaX));
        } else if (resizeState.handle === 's') {
          newHeight = Math.max(2, Math.min(100 - newY, resizeState.startHeight + deltaY));
        }

        onUpdateElement({
          ...target,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newWidth * 10) / 10,
          height: Math.round(newHeight * 10) / 10,
        });
      }
    };

    const handleWindowMouseUp = () => {
      if (arrowDragState) {
        const sourceElem = page.elements.find(e => e.id === arrowDragState.sourceId);
        if (sourceElem && sourceElem.type === 'comment') {
           onUpdateElement({
             ...sourceElem,
             arrowTarget: { x: arrowDragState.currentX, y: arrowDragState.currentY }
           });
        }
        setArrowDragState(null);
        return;
      }

      // Complete Shape / Highlight / Text / Redaction Creation
      if (creationDrag) {
        const minX = Math.min(creationDrag.startX, creationDrag.currentX);
        const minY = Math.min(creationDrag.startY, creationDrag.currentY);
        const width = Math.abs(creationDrag.currentX - creationDrag.startX);
        const height = Math.abs(creationDrag.currentY - creationDrag.startY);
        const isDrag = width > 1.5 || height > 1.5;

        const id = `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        let newElement: PageElement | null = null;

        if (creationDrag.tool === 'select') {
          if (isDrag) {
            const minX = Math.min(creationDrag.startX, creationDrag.currentX);
            const minY = Math.min(creationDrag.startY, creationDrag.currentY);
            const maxX = Math.max(creationDrag.startX, creationDrag.currentX);
            const maxY = Math.max(creationDrag.startY, creationDrag.currentY);
            
            const selectedIds = (page?.elements || []).filter(el => {
              const elRight = el.x + (el.width || 0);
              const elBottom = el.y + (el.height || 0);
              return !(el.x > maxX || elRight < minX || el.y > maxY || elBottom < minY);
            }).map(el => el.id);
            
            if (selectedIds.length > 0) {
              onSelectElement(selectedIds);
            } else {
              onSelectElement(null); onSelectTool?.('select');
            }
          } else {
            onSelectElement(null); onSelectTool?.('select');
          }
        }
        
          if (creationDrag.tool === 'shape') {
          const isLine = toolSettings.shapeType === 'line' || toolSettings.shapeType === 'arrow';
          newElement = {
            id,
            type: 'shape',
            shapeType: toolSettings.shapeType || 'rect',
            x: isDrag ? minX : Math.max(0, Math.min(80, creationDrag.startX - 10)),
            y: isDrag ? minY : Math.max(0, Math.min(80, creationDrag.startY - 5)),
            width: isDrag ? Math.max(2, width) : (isLine ? 30 : 20),
            height: isDrag ? Math.max(1, height) : (isLine ? 3 : 15),
            strokeColor: toolSettings.strokeColor || '#1E293B',
            fillColor: toolSettings.fillColor || 'transparent',
            strokeWidth: toolSettings.strokeWidth || 2,
          };
        } else if (creationDrag.tool === 'highlight') {
          newElement = {
            id,
            type: 'highlight',
            style: toolSettings.highlightStyle || 'highlight',
            x: isDrag ? minX : Math.max(0, Math.min(70, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(95, creationDrag.startY)),
            width: isDrag ? Math.max(3, width) : 35,
            height: isDrag ? Math.max(1.5, height) : 3.5,
            color: toolSettings.commentColor || '#FEF08A',
            opacity: 0.45,
          };
        } else if (creationDrag.tool === 'addText' || creationDrag.tool === 'editText') {
          newElement = {
            id,
            type: 'text',
            x: isDrag ? minX : Math.max(0, Math.min(75, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(90, creationDrag.startY)),
            width: isDrag ? Math.max(10, width) : 30,
            height: isDrag ? Math.max(3, height) : 6,
            text: 'Type text here...',
            fontSize: 14,
            fontFamily: 'Helvetica Neue',
            color: '#111827',
            fontWeight: 'normal',
            textAlign: 'left',
            textDecoration: 'none',
          };
        } else if (creationDrag.tool === 'comment') {
          newElement = {
            id,
            type: 'comment',
            x: isDrag ? minX : Math.max(0, Math.min(72, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(80, creationDrag.startY)),
            width: isDrag ? Math.max(15, width) : 26,
            height: isDrag ? Math.max(8, height) : 15,
            author: 'Reviewer',
            text: 'Add your note here...',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            resolved: false,
            color: toolSettings.commentColor || '#FEF08A',
          };
        } else if (creationDrag.tool === 'redact') {
          newElement = {
            id,
            type: 'redaction',
            x: isDrag ? minX : Math.max(0, Math.min(70, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(90, creationDrag.startY)),
            width: isDrag ? Math.max(3, width) : 30,
            height: isDrag ? Math.max(2, height) : 5,
            applied: false,
            reason: 'Confidential Information',
          };
        } else if (creationDrag.tool === 'stamp') {
          newElement = {
            id,
            type: 'stamp',
            stampType: toolSettings.stampType || 'APPROVED',
            text: toolSettings.stampText || 'APPROVED',
            x: isDrag ? minX : Math.max(0, Math.min(75, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(90, creationDrag.startY)),
            width: isDrag ? Math.max(15, width) : 26,
            height: isDrag ? Math.max(6, height) : 9,
            color: toolSettings.stampColor || '#16A34A',
          };
        } else if (creationDrag.tool === 'sign') {
          newElement = {
            id,
            type: 'signature',
            x: isDrag ? minX : Math.max(0, Math.min(75, creationDrag.startX)),
            y: isDrag ? minY : Math.max(0, Math.min(90, creationDrag.startY)),
            width: isDrag ? Math.max(15, width) : 26,
            height: isDrag ? Math.max(6, height) : 9,
            signerName: toolSettings.signerName || 'John Doe',
            signatureDataUrl: toolSettings.signatureDataUrl,
          };
        }

        if (newElement) {
          onAddElement(newElement);
          onSelectElement(newElement.id);
          onSelectTool?.('select');
        }

        setCreationDrag(null);
      }

      setDragState(null);
      setResizeState(null);
    };

    if (dragState || resizeState || creationDrag || arrowDragState) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [
    dragState,
    resizeState,
    creationDrag,
    arrowDragState,
    page,
    pageWidth,
    pageHeight,
    toolSettings,
    onAddElement,
    onSelectElement,
    onSelectTool,
    onUpdateElement,
  ]);

  // Keyboard navigation & deletion for selected elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementIds || selectedElementIds.length === 0) return;

      const activeTag = document.activeElement?.tagName;
      const isEditingText =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // Always allow Escape to deselect
      if (e.key === 'Escape') {
        onSelectElement(null); onSelectTool?.('select');
        return;
      }

      if (isEditingText) return;

      const target = (page?.elements || []).find((el) => el.id === selectedElementIds[0]);
      if (!target) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (onDeleteElements && selectedElementIds.length > 1) { onDeleteElements(selectedElementIds); } else { selectedElementIds.forEach(id => onDeleteElement(id)); }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 3 : 0.5;
        let newX = target.x;
        let newY = target.y;

        if (e.key === 'ArrowLeft') newX = Math.max(0, target.x - step);
        if (e.key === 'ArrowRight') newX = Math.min(100 - target.width, target.x + step);
        if (e.key === 'ArrowUp') newY = Math.max(0, target.y - step);
        if (e.key === 'ArrowDown') newY = Math.min(100 - target.height, target.y + step);

        onUpdateElement({
          ...target,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, page, onDeleteElement, onSelectElement, onUpdateElement]);

  const handleDuplicate = (id: string) => {
    const target = (page?.elements || []).find((el) => el.id === id);
    if (!target) return;

    const dupId = `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const duplicated: PageElement = {
      ...target,
      id: dupId,
      x: Math.min(90, target.x + 3),
      y: Math.min(90, target.y + 3),
    };
    onAddElement(duplicated);
    onSelectElement(dupId);
  };

  const getCanvasCursor = () => {
    if (activeTool === 'select') return 'default';
    if (activeTool === 'draw') return 'crosshair';
    if (activeTool === 'shape' || activeTool === 'highlight' || activeTool === 'redact') return 'crosshair';
    if (activeTool === 'addText' || activeTool === 'editText') return 'text';
    if (activeTool === 'comment') return 'cell';
    return 'crosshair';
  };

  return (
    <div
      className="flex justify-center p-6 sm:p-10 select-none min-h-full items-center"
      onClick={() => {
        if (activeTool === 'select') { onSelectElement(null); }
      }}
    >
      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        style={{
          width: `${pageWidth}px`,
          height: `${pageHeight}px`,
          transform: `rotate(${page?.rotation || 0}deg)`,
          cursor: getCanvasCursor(),
        }}
        className="canvas-background relative bg-white shadow-xl border border-slate-200/90 rounded-sm transition-shadow overflow-visible group"
      >
        {/* Actual PDF rendering layer */}
        {!page.isBlank && (
          <>
            {isRendering && document?.rawBytes && (
              <div className="absolute inset-0 z-[1] bg-slate-100/50 animate-pulse flex items-center justify-center pointer-events-none rounded-sm">
                <div className="w-8 h-8 text-slate-300">
                  <svg className="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}
            <canvas
              ref={pdfCanvasRef}
              className={`absolute inset-0 z-0 pointer-events-none w-full h-full object-contain transition-opacity duration-300 ${isRendering && document?.rawBytes ? 'opacity-0' : 'opacity-100'}`}
            />
          </>
        )}
        
        {/* Password or Error Overlay */}
        {pdfRenderError && (
          <div className={`absolute ${pdfRenderError.includes('font') ? 'top-4 right-4 z-50 max-w-xs' : 'inset-0 z-10 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm'}`}>
            <div className={`bg-white p-4 rounded-xl shadow-xl text-center border border-slate-200 ${pdfRenderError.includes('font') ? 'flex flex-col items-start text-left' : 'max-w-sm'}`}>
               {!pdfRenderError.includes('font') && (
                 <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
               )}
               <h3 className="font-bold text-slate-800 mb-1">
                 {isPasswordProtected ? 'Password Protected' : (pdfRenderError.includes('font') ? 'Missing Fonts' : 'Rendering Error')}
               </h3>
               <p className={`text-slate-500 mb-4 ${pdfRenderError.includes('font') ? 'text-xs' : 'text-sm'}`}>{pdfRenderError}</p>
               
               {isPasswordProtected ? (
                 <form onSubmit={(e) => {
                   e.preventDefault();
                   if (passwordCallback && passwordInput) {
                     setIsRendering(true);
                     setPdfRenderError(null);
                     passwordCallback(passwordInput);
                      if (onUnlockPassword) onUnlockPassword(passwordInput);
                   }
                 }} className="flex gap-2">
                   <input
                     type="password"
                     value={passwordInput}
                     onChange={(e) => setPasswordInput(e.target.value)}
                     className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Enter password..."
                     autoFocus
                   />
                   <button
                     type="submit"
                     disabled={!passwordInput.trim()}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                   >
                     Unlock
                   </button>
                 </form>
               ) : (
                 pdfRenderError.includes('font') && (
                   <button onClick={() => setPdfRenderError(null)} className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700">Dismiss</button>
                 )
               )}
            </div>
          </div>
        )}

        {/* Drawing Overlay Canvas for Pen */}
        {activeTool === 'draw' && (
          <canvas
            ref={drawingCanvasRef}
            width={pageWidth}
            height={pageHeight}
            onMouseDown={handleMouseDownDrawing}
            onMouseMove={handleMouseMoveDrawing}
            onMouseUp={handleMouseUpDrawing}
            className="absolute inset-0 z-30 cursor-crosshair"
          />
        )}

        {/* Live Shape / Highlight / Redaction / Text Creation Preview */}
        {creationDrag && (() => {
          const minX = Math.min(creationDrag.startX, creationDrag.currentX);
          const minY = Math.min(creationDrag.startY, creationDrag.currentY);
          const width = Math.abs(creationDrag.currentX - creationDrag.startX);
          const height = Math.abs(creationDrag.currentY - creationDrag.startY);

          if (creationDrag.tool === 'select') {
            return (
              <div
                className="absolute pointer-events-none z-50 bg-blue-500/10 border-2 border-dashed border-blue-500"
                style={{
                  left: `${minX}%`,
                  top: `${minY}%`,
                  width: `${Math.max(0.1, width)}%`,
                  height: `${Math.max(0.1, height)}%`,
                }}
              />
            );
          }
          if (creationDrag.tool === 'shape') {
            const isLine = toolSettings.shapeType === 'line' || toolSettings.shapeType === 'arrow';
            return (
              <div
                className="absolute pointer-events-none z-50 transition-none"
                style={{
                  left: `${minX}%`,
                  top: `${minY}%`,
                  width: `${Math.max(1, width)}%`,
                  height: `${Math.max(1, height)}%`,
                }}
              >
                <svg className="w-full h-full overflow-visible">
                  {toolSettings.shapeType === 'rect' && (
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      stroke={toolSettings.strokeColor || '#1E293B'}
                      strokeWidth={toolSettings.strokeWidth || 2}
                      fill={toolSettings.fillColor || 'transparent'}
                      strokeDasharray="4 2"
                    />
                  )}
                  {toolSettings.shapeType === 'circle' && (
                    <ellipse
                      cx="50%"
                      cy="50%"
                      rx="49%"
                      ry="49%"
                      stroke={toolSettings.strokeColor || '#1E293B'}
                      strokeWidth={toolSettings.strokeWidth || 2}
                      fill={toolSettings.fillColor || 'transparent'}
                      strokeDasharray="4 2"
                    />
                  )}
                  {toolSettings.shapeType === 'line' && (
                    <line
                      x1={creationDrag.startX <= creationDrag.currentX ? '0%' : '100%'}
                      y1={creationDrag.startY <= creationDrag.currentY ? '0%' : '100%'}
                      x2={creationDrag.startX <= creationDrag.currentX ? '100%' : '0%'}
                      y2={creationDrag.startY <= creationDrag.currentY ? '100%' : '0%'}
                      stroke={toolSettings.strokeColor || '#1E293B'}
                      strokeWidth={toolSettings.strokeWidth || 2}
                    />
                  )}
                  {toolSettings.shapeType === 'arrow' && (
                    <g>
                      <defs>
                        <marker
                          id="preview-arrow"
                          markerWidth="8"
                          markerHeight="8"
                          refX="6"
                          refY="4"
                          orient="auto"
                        >
                          <polygon points="0 0, 8 4, 0 8" fill={toolSettings.strokeColor || '#1E293B'} />
                        </marker>
                      </defs>
                      <line
                        x1={creationDrag.startX <= creationDrag.currentX ? '0%' : '100%'}
                        y1={creationDrag.startY <= creationDrag.currentY ? '0%' : '100%'}
                        x2={creationDrag.startX <= creationDrag.currentX ? '100%' : '0%'}
                        y2={creationDrag.startY <= creationDrag.currentY ? '100%' : '0%'}
                        stroke={toolSettings.strokeColor || '#1E293B'}
                        strokeWidth={toolSettings.strokeWidth || 2}
                        markerEnd="url(#preview-arrow)"
                      />
                    </g>
                  )}
                </svg>
              </div>
            );
          }

          if (creationDrag.tool === 'highlight') {
            return (
              <div
                className="absolute pointer-events-none z-50 rounded-xs transition-none"
                style={{
                  left: `${minX}%`,
                  top: `${minY}%`,
                  width: `${Math.max(1, width)}%`,
                  height: `${Math.max(1, height)}%`,
                  backgroundColor: toolSettings.highlightColor || '#FEF08A',
                  opacity: 0.5,
                  border: '1px dashed #D97706',
                }}
              />
            );
          }

          if (creationDrag.tool === 'redact') {
            return (
              <div
                className="absolute pointer-events-none z-50 bg-black/80 border-2 border-dashed border-rose-500 rounded-xs flex items-center justify-center text-white text-[10px] font-mono"
                style={{
                  left: `${minX}%`,
                  top: `${minY}%`,
                  width: `${Math.max(2, width)}%`,
                  height: `${Math.max(1, height)}%`,
                }}
              >
                <span>REDACT</span>
              </div>
            );
          }

          if (creationDrag.tool === 'addText' || creationDrag.tool === 'editText') {
            return (
              <div
                className="absolute pointer-events-none z-50 border-2 border-dashed border-blue-500 bg-blue-50/20 rounded-xs p-1 text-xs text-slate-500"
                style={{
                  left: `${minX}%`,
                  top: `${minY}%`,
                  width: `${Math.max(5, width)}%`,
                  height: `${Math.max(2, height)}%`,
                }}
              >
                <span>Type text...</span>
              </div>
            );
          }

          return null;
        })()}

        {/* PDF Interactive Form Fields */}
        {pdfFormFields.map((f, index) => {
          const val = globalFormValues?.[f.fieldName] !== undefined ? globalFormValues[f.fieldName] : (formValues[f.fieldName] !== undefined ? formValues[f.fieldName] : (f.fieldValue || ''));
          
          const commonStyles: React.CSSProperties = {
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.w}%`,
            height: `${f.h}%`,
            position: 'absolute',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: f.required ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent',
            outline: 'none',
            zIndex: 40,
            fontSize: '12px',
            fontFamily: 'sans-serif',
            transition: 'border-color 0.15s, background-color 0.15s',
          };

          const handleFocus = (e: React.FocusEvent<any>) => {
             e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
             e.target.style.border = '2px solid rgba(59, 130, 246, 0.8)';
          };
          const handleBlur = (e: React.FocusEvent<any>) => {
             e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
             e.target.style.border = f.required ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent';
          };
          
          // Compute Tab Index globally across pages
          const tabIndex = page.pageNumber * 1000 + index + 1;

          if (f.fieldType === 'Tx') {
            if (f.multiLine) {
              return (
                <textarea
                  key={f.id}
                  title={f.fieldName}
                  tabIndex={tabIndex}
                  style={commonStyles}
                  value={val}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => handleFormValueChange(f.fieldName, e.target.value)}
                  className="pdf-form-field resize-none p-1"
                />
              );
            }
            return (
              <input
                type="text"
                key={f.id}
                title={f.fieldName}
                tabIndex={tabIndex}
                style={commonStyles}
                value={val}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                      e.preventDefault();
                      // Move to the next form field when pressing Enter
                      const formElements = Array.from(window.document.querySelectorAll('.pdf-form-field')) as HTMLElement[];
                      const currentIndex = formElements.indexOf(e.currentTarget);
                      if (currentIndex > -1 && currentIndex < formElements.length - 1) {
                        formElements[currentIndex + 1].focus();
                      }
                   }
                }}
                onChange={(e) => handleFormValueChange(f.fieldName, e.target.value)}
                className="pdf-form-field p-1"
              />
            );
          }

          if (f.fieldType === 'Btn') {
            if (f.radioButton) {
               return (
                 <div
                   key={f.id}
                   style={{...commonStyles, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                   className="pdf-form-radio-container"
                 >
                   <input
                     type="radio"
                     name={f.fieldName}
                     title={f.fieldName}
                     tabIndex={tabIndex}
                     style={{ cursor: 'pointer', appearance: 'auto', margin: 0, width: '100%', height: '100%' }}
                     checked={val === f.fieldValue}
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                     onChange={(e) => {
                        if (e.target.checked) handleFormValueChange(f.fieldName, f.fieldValue);
                     }}
                     className="pdf-form-field"
                   />
                 </div>
               );
            } else if (f.checkBox) {
               return (
                 <div
                   key={f.id}
                   style={{...commonStyles, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                 >
                   <input
                     type="checkbox"
                     title={f.fieldName}
                     tabIndex={tabIndex}
                     style={{ cursor: 'pointer', appearance: 'auto', margin: 0, width: '100%', height: '100%' }}
                     checked={!!val && val !== 'Off'}
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                     onChange={(e) => handleFormValueChange(f.fieldName, e.target.checked)}
                     className="pdf-form-field"
                   />
                 </div>
               );
            } else {
               // Push button
               return (
                 <button 
                   key={f.id} 
                   tabIndex={tabIndex}
                   title={f.fieldName}
                   style={{...commonStyles, cursor: 'pointer', backgroundColor: 'transparent'}}
                   className="pdf-form-field hover:bg-slate-200/50"
                 />
               );
            }
          }

          if (f.fieldType === 'Ch') {
             return (
               <select
                 key={f.id}
                 title={f.fieldName}
                 tabIndex={tabIndex}
                 style={{...commonStyles, appearance: 'auto'}}
                 value={val}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 onChange={(e) => handleFormValueChange(f.fieldName, e.target.value)}
                 className="pdf-form-field p-0.5 bg-white/50"
               >
                 <option value=""></option>
                 {f.options?.map((opt: any, i: number) => {
                    const label = typeof opt === 'object' ? opt.displayValue : opt;
                    const value = typeof opt === 'object' ? opt.exportValue : opt;
                    return <option key={i} value={value}>{label}</option>
                 })}
               </select>
             );
          }

          return null;
        })}

        {/* Page Rendered Elements */}
        {(page?.elements || []).map((elem) => {
          // If we are rendering the actual PDF from rawBytes, hide the dummy text layers generated during upload
          if (document?.rawBytes && elem.isOriginal && elem.type === 'text' && elem.id.startsWith('imported_p')) {
            return null;
          }
          const isSelected = selectedElementIds.includes(elem.id);

          const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${elem.x}%`,
            top: `${elem.y}%`,
            width: `${elem.width}%`,
            height: elem.height ? `${elem.height}%` : 'auto',
            minHeight: elem.height ? `${elem.height}%` : 'auto',
            zIndex: isSelected ? 40 : (elem.zIndex || 10),
            cursor: isSelected ? 'move' : (elem.type === 'text' && (activeTool === 'select' || activeTool === 'editText' || activeTool === 'addText') ? 'text' : 'pointer'),
            pointerEvents: (activeTool === 'select' || activeTool === 'editText' || activeTool === 'addText' || isSelected) ? 'auto' : 'none',
          };

          return (
            <div
              key={elem.id}
              style={baseStyle}
              onMouseDown={(e) => handleElemMouseDown(e, elem)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement(elem.id);
              }}
              className={`group/elem transition-shadow ${
                isSelected
                  ? 'ring-2 ring-blue-600 ring-offset-1 rounded-xs shadow-md'
                  : 'hover:outline hover:outline-1 hover:outline-blue-400/80'
              }`}
            >
              {/* Selected Element Floating Action Toolbar */}
              {isSelected && (
                <>
                  {/* Drag Handle (Outside no-drag to allow moving) */}
                  <div
                    className="absolute -top-8 left-0 flex items-center justify-start pointer-events-auto z-50 cursor-move"
                    title="Drag to move"
                  >
                    <div className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md p-1 shadow-md transition-colors w-7 h-7">
                      <GripHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                <div
                  className="no-drag absolute -top-8 right-0 flex items-center justify-end pointer-events-auto z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 bg-slate-900 text-white rounded-md px-1.5 py-0.5 shadow-lg text-[10px] font-medium animate-in fade-in">
                    <span className="flex items-center gap-1 text-slate-300 mr-1 uppercase text-[9px] tracking-wider">
                      {elem.type}
                    </span>

                    {/* Quick color change for sticky note */}
                    {elem.type === 'comment' && (
                      <div className="flex items-center gap-0.5 border-r border-slate-700 pr-1 mr-0.5">
                        {['#FEF08A', '#BFDBFE', '#BBF7D0', '#FBCFE8', '#DDD6FE'].map((c) => (
                          <button
                            key={c}
                            onClick={() => onUpdateElement({ ...elem, color: c })}
                            style={{ backgroundColor: c }}
                            className="w-2.5 h-2.5 rounded-full border border-black/20 hover:scale-125 transition-transform"
                            title="Change Note Color"
                          />
                        ))}
                        
                      </div>
                    )}

                    {/* Quick duplicate button */}
                    <button
                      onClick={() => handleDuplicate(elem.id)}
                      className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Duplicate item"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    {/* Redaction Burn Action */}
                    {elem.type === 'redaction' && !elem.applied && (
                      <button
                        onClick={() => onApplyRedaction(elem.id)}
                        className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>Burn</span>
                      </button>
                    )}

                    {/* Save / Close item */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (elem.type === 'comment') {
                          onUpdateElement({ ...elem, width: 3, height: 2 });
                        }
                        onSelectElement(null); onSelectTool?.('select');
                      }}
                      className="p-1 text-emerald-400 hover:text-emerald-300 rounded hover:bg-emerald-950/60 transition-colors"
                      title="Save and close"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteElement(elem.id)}
                      className="p-1 text-rose-300 hover:text-rose-100 rounded hover:bg-rose-950/60 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    </div>
                </div>
                </>
              )}
              {/* Resize Handles for Selected Element */}
              {isSelected && elem.type !== 'comment' && (
                <>
                  {/* Bottom-Right Corner Resize Handle */}
                  <div
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, elem, 'se')}
                    className="no-drag absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-xs shadow cursor-nwse-resize z-50 hover:scale-125 transition-transform"
                    title="Resize width & height"
                  />
                  {/* Right Edge Resize Handle */}
                  <div
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, elem, 'e')}
                    className="no-drag absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-blue-500 border border-white rounded-xs shadow cursor-ew-resize z-50 hover:scale-125 transition-transform"
                    title="Resize width"
                  />
                  {/* Bottom Edge Resize Handle */}
                  <div
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, elem, 's')}
                    className="no-drag absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-blue-500 border border-white rounded-xs shadow cursor-ns-resize z-50 hover:scale-125 transition-transform"
                    title="Resize height"
                  />
                </>
              )}

              {/* Text Element */}
              {elem.type === 'text' && (
                <EditableTextElement
                  elem={elem}
                  isSelected={isSelected}
                  scale={scale}
                  onUpdateElement={onUpdateElement}
                  onSelectElement={onSelectElement}
                />
              )}

              {/* Image Element */}
              {elem.type === 'image' && (
                <img
                  src={elem.src}
                  alt="PDF content"
                  referrerPolicy="no-referrer"
                  style={{ opacity: elem.opacity ?? 1 }}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}

              {/* Shape Element */}
              {elem.type === 'shape' && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  {elem.shapeType === 'rect' && (
                    <div
                      style={{
                        borderColor: elem.strokeColor || '#1E293B',
                        borderWidth: `${(elem.strokeWidth || 2) * scale}px`,
                        backgroundColor: elem.fillColor || 'transparent',
                        opacity: elem.opacity ?? 1,
                      }}
                      className="w-full h-full rounded-xs border-solid"
                    />
                  )}
                  {elem.shapeType === 'circle' && (
                    <div
                      style={{
                        borderColor: elem.strokeColor || '#1E293B',
                        borderWidth: `${(elem.strokeWidth || 2) * scale}px`,
                        backgroundColor: elem.fillColor || 'transparent',
                      }}
                      className="w-full h-full rounded-full border-solid"
                    />
                  )}
                  {elem.shapeType === 'line' && (
                    <div
                      style={{
                        borderTopColor: elem.strokeColor || '#1E293B',
                        borderTopWidth: `${Math.max(1, (elem.strokeWidth || 2) * scale)}px`,
                      }}
                      className="w-full border-t border-solid my-auto"
                    />
                  )}
                  {elem.shapeType === 'arrow' && (
                    <div className="w-full flex items-center justify-between">
                      <div
                        style={{
                          borderTopColor: elem.strokeColor || '#1E293B',
                          borderTopWidth: `${Math.max(1, (elem.strokeWidth || 2) * scale)}px`,
                        }}
                        className="flex-1 border-t border-solid"
                      />
                      <div
                        style={{
                          borderLeftColor: elem.strokeColor || '#1E293B',
                          borderTopWidth: `${4 * scale}px`,
                          borderBottomWidth: `${4 * scale}px`,
                          borderLeftWidth: `${8 * scale}px`,
                        }}
                        className="w-0 h-0 border-t-transparent border-b-transparent border-l-solid"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Highlight / Underline */}
              {elem.type === 'highlight' && (
                <div
                  style={{
                    backgroundColor: elem.style === 'highlight' ? elem.color : 'transparent',
                    borderBottomColor: elem.style === 'underline' ? elem.color : 'transparent',
                    borderBottomWidth: elem.style === 'underline' ? `${2 * scale}px` : 0,
                    opacity: elem.opacity || 0.45,
                  }}
                  className="w-full h-full pointer-events-none rounded-xs"
                />
              )}

              {/* Stamp Element */}
              {elem.type === 'stamp' && (
                <div
                  style={{
                    borderColor: elem.color || '#16A34A',
                    color: elem.color || '#16A34A',
                  }}
                  className="w-full h-full border-2 border-dashed rounded-lg p-1 bg-white/95 text-center font-bold tracking-wider uppercase transform -rotate-2 shadow-xs flex flex-col items-center justify-center pointer-events-none"
                >
                  <div style={{ fontSize: `${Math.max(8, 12 * scale)}px` }}>{elem.text}</div>
                  {elem.subtext && (
                    <div style={{ fontSize: `${Math.max(6, 8 * scale)}px` }} className="opacity-80 -mt-0.5">
                      {elem.subtext}
                    </div>
                  )}
                </div>
              )}

              {/* Signature Element */}
              {elem.type === 'signature' && (
                <div className="w-full h-full bg-white/60 border border-dashed border-slate-300 rounded-lg p-1.5 flex flex-col items-center justify-center pointer-events-none">
                  {elem.signatureDataUrl ? (
                    <img
                      src={elem.signatureDataUrl}
                      alt="Signature"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <div
                      className="font-signature-greatvibes text-slate-900 tracking-wide"
                      style={{ fontSize: `${Math.max(12, 20 * scale)}px` }}
                    >
                      {elem.signerName || 'Signature'}
                    </div>
                  )}
                  {elem.dateString && (
                    <div
                      className="text-slate-500 font-mono mt-0.5"
                      style={{ fontSize: `${Math.max(6, 8 * scale)}px` }}
                    >
                      Signed: {elem.dateString}
                    </div>
                  )}
                </div>
              )}

              {/* Sticky Note / Comment Element */}
              {elem.type === 'comment' && (
                <div
                  style={{ backgroundColor: elem.color || '#FEF08A' }}
                  className={`w-full h-full shadow-sm text-slate-800 text-xs flex overflow-hidden border border-amber-500/50 ${
                    elem.width <= 5 ? 'items-center justify-center rounded-sm cursor-pointer hover:scale-110 transition-transform' : 'flex-col justify-between rounded-md p-2'
                  }`}
                >
                  {elem.width <= 5 ? (
                    <MessageSquare className="w-3 h-3 text-amber-800" />
                  ) : (
                    <>
                      {/* Note Pin & Author Header */}
                      <div className="flex items-center justify-between font-bold text-[9px] text-amber-900/90 pb-1 border-b border-amber-300/50 mb-1">
                        <div className="flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5 text-amber-800" />
                          <span>{elem.author || 'Note'}</span>
                        </div>
                        <span className="font-normal text-amber-800/70 text-[8px]">{elem.createdAt}</span>
                      </div>
                      {/* Editable Note Body */}
                      <textarea
                        ref={(el) => {
                          if (el && isSelected && document.activeElement !== el && elem.text === 'Add your note here...') {
                            el.focus();
                            el.setSelectionRange(el.value.length, el.value.length);
                          }
                        }}
                        value={elem.text}
                        onChange={(e) => {
                          onUpdateElement({
                            ...elem,
                            text: e.target.value,
                          });
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Type sticky note text..."
                        className="no-drag flex-1 w-full bg-transparent resize-none outline-none text-[11px] leading-tight text-slate-900 placeholder:text-amber-800/40 cursor-text"
                      />
                    </>
                  )}
                </div>
              )}
              
              {/* Redaction Element */}
              {elem.type === 'redaction' && (
                <div
                  style={{
                    backgroundColor: elem.applied ? '#000000' : 'rgba(0, 0, 0, 0.75)',
                  }}
                  className={`w-full h-full flex items-center justify-center ${
                    !elem.applied ? 'border border-dashed border-rose-500' : ''
                  }`}
                >
                  {!elem.applied && (
                    <span className="text-[8px] font-bold text-rose-300 uppercase tracking-wider px-1 text-center">
                      Redact
                    </span>
                  )}
                </div>
              )}

              {/* Drawing points renderer */}
              {elem.type === 'drawing' && elem.points && (
                <svg
                  className="w-full h-full pointer-events-none"
                  viewBox={`0 0 ${elem.width || 100} ${elem.height || 100}`}
                  preserveAspectRatio="none"
                >
                  <path
                    d={elem.points.reduce(
                      (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                      ''
                    )}
                    stroke={elem.color || '#2563EB'}
                    strokeWidth={(elem.strokeWidth || 3) * 0.4}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
