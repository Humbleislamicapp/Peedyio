export type ToolType =
  | 'home'
  | 'editor'
  | 'edit_hub'
  | 'review_hub'
  | 'fill_hub'
  | 'sign_hub'
  | 'merge'
  | 'split'
  | 'extract'
  | 'compress'
  | 'compare'
  | 'convert'
  | 'sign'
  | 'ocr'
  | 'protect'
  | 'redact'
  | 'create'
  | 'templates'
  | 'library'
  | 'batch'
  | 'ask_peedy'
  | 'organize_hub'
  | 'protect_hub'
  | 'optimize'
  | 'create';

export type ViewMode =
  | 'dashboard'
  | 'editor'
  | 'edit_hub'
  | 'review_hub'
  | 'fill_hub'
  | 'sign_hub'
  | 'merge'
  | 'split'
  | 'extract'
  | 'compress'
  | 'compare'
  | 'convert'
  | 'sign'
  | 'ocr'
  | 'protect'
  | 'templates'
  | 'library'
  | 'batch'
  | 'ask_peedy'
  | 'organize_hub'
  | 'protect_hub'
  | 'optimize'
  | 'create';

export type AnnotationTool =
  | 'select'
  | 'editText'
  | 'addText'
  | 'addImage'
  | 'shape'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'draw'
  | 'comment'
  | 'stamp'
  | 'sign'
  | 'redact'
  | 'eraser';

export type ShapeType = 'rect' | 'circle' | 'line' | 'arrow';

export interface BaseElement {
  id: string;
  isOriginal?: boolean;
  x: number; // percentage (0-100) or pt
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold' | '500' | '600' | '700';
  textAlign?: 'left' | 'center' | 'right';
  textDecoration?: 'none' | 'underline' | 'line-through';
  opacity?: number;
  isOriginal?: boolean;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  opacity: number;
  aspectRatio?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity?: number;
}

export interface HighlightElement extends BaseElement {
  type: 'highlight';
  style: 'highlight' | 'underline' | 'strikethrough';
  color: string;
  opacity: number;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingElement extends BaseElement {
  type: 'drawing';
  points: DrawingPoint[];
  color: string;
  strokeWidth: number;
}

export type StampType =
  | 'APPROVED'
  | 'CONFIDENTIAL'
  | 'DRAFT'
  | 'URGENT'
  | 'PAID'
  | 'REJECTED'
  | 'VOID'
  | 'COMPLETED'
  | 'CUSTOM';

export interface StampElement extends BaseElement {
  type: 'stamp';
  stampType: StampType;
  text: string;
  color: string;
  subtext?: string;
}

export interface SignatureElement extends BaseElement {
  type: 'signature';
  signatureDataUrl?: string;
  signerName: string;
  dateString?: string;
  isRequired?: boolean;
  signatureStyle?: 'drawn' | 'typed' | 'uploaded';
}

export interface CommentElement extends BaseElement {
  arrowTarget?: { x: number, y: number };
  type: 'comment';
  author: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  isPrivateNote?: boolean;
  color?: string;
}

export interface RedactionElement extends BaseElement {
  type: 'redaction';
  applied: boolean;
  reason?: string;
}

export type PageElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | HighlightElement
  | DrawingElement
  | StampElement
  | SignatureElement
  | CommentElement
  | RedactionElement;

export interface PDFPageModel {
  pageNumber: number;
  originalPageNumber?: number;
  isBlank?: boolean;
  rotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
  elements: PageElement[];
  backgroundText?: string;
  renderedSnapshot?: string; // Data URL for quick preview
}

export interface PDFDocumentModel {
  id: string;
  name: string;
  size: number; // bytes
  lastModified: string;
  pageCount: number;
  pages: PDFPageModel[];
  starred?: boolean;
  isSample?: boolean;
  isScanned?: boolean;
  isProtected?: boolean;
  password?: string;
  tags?: string[];
  formValues?: Record<string, any>;
  rawBytes?: Uint8Array;
}

export interface DocumentDiffItem {
  id: string;
  pageNumber: number;
  type: 'added' | 'removed' | 'changed' | 'page_added' | 'page_removed';
  description: string;
  originalText?: string;
  newText?: string;
  coordinates?: { x: number; y: number; width: number; height: number };
}

export interface DocumentDiffResult {
  totalChanges: number;
  pagesWithChanges: number[];
  changes: DocumentDiffItem[];
  summary: string;
}

export interface CompressionOption {
  id: 'smallest' | 'balanced' | 'highest';
  title: string;
  subtitle: string;
  estimatedReduction: number; // percentage (e.g. 75)
  dpi: number;
  imageQuality: number;
}

export interface AdvancedCompressionSettings {
  imageResolution: number; // 72, 150, 300
  imageQuality: number; // 0-100
  removeMetadata: boolean;
  removeUnusedObjects: boolean;
  fontOptimization: boolean;
  grayscaleConversion: boolean;
}

export interface SplitOption {
  type: 'every_page' | 'ranges' | 'max_pages' | 'selected';
  pageRanges?: string; // e.g. "1-2, 3-5"
  maxPagesPerDoc?: number;
  selectedPages?: number[];
}

export interface ExtractOption {
  type: 'selected' | 'range' | 'every_x' | 'odd' | 'even';
  selectedPages?: number[];
  pageRange?: string;
  everyXValue?: number;
}

export interface ConversionFormat {
  id: string;
  name: string;
  extension: string;
  icon: string;
  category: 'to_pdf' | 'from_pdf';
  description: string;
}

export interface ExportFormatOption {
  id: string;
  name: string;
  description: string;
  extension: string;
  estimatedSize: number;
}

export interface SignaturePreset {
  id: string;
  name: string;
  font: string;
  dataUrl?: string;
}
