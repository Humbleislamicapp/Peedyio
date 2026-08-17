import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

props_old = """interface PdfCanvasProps {
  page: PDFPageModel;
  zoom: number; // percentage (e.g. 100)"""

props_new = """import { PDFDocumentModel } from '../../types/pdf';

interface PdfCanvasProps {
  document?: PDFDocumentModel;
  page: PDFPageModel;
  zoom: number; // percentage (e.g. 100)"""

code = code.replace(props_old, props_new)

sig_old = """export const PdfCanvas: React.FC<PdfCanvasProps> = ({
  page,
  zoom,
  activeTool,
  selectedElementId,"""

sig_new = """export const PdfCanvas: React.FC<PdfCanvasProps> = ({
  document,
  page,
  zoom,
  activeTool,
  selectedElementId,"""

code = code.replace(sig_old, sig_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

