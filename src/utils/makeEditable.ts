import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentModel, PDFPageModel, PageElement } from '../types/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export async function convertToEditable(doc: PDFDocumentModel): Promise<PDFDocumentModel> {
  if (!doc.rawBytes) return doc; // Already editable or no raw bytes

  const loadingTask = pdfjsLib.getDocument({ data: doc.rawBytes.slice(0) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const newPages: PDFPageModel[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    
    const elements: PageElement[] = [];
    
    // We can map text items to PageElements
    textContent.items.forEach((item: any, idx: number) => {
      // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
      // PDF coordinate system is bottom-left
      const [m11, m12, m21, m22, dx, dy] = item.transform;
      
      const text = item.str;
      if (!text.trim()) return; // Skip empty text
      
      // Calculate font size (roughly m11 or m22)
      const fontSize = Math.abs(m11) || 12;
      
      // Calculate x and y in percentages or pt
      // For PageElement, x/y are percentages of the page
      const xPercent = (dx / viewport.width) * 100;
      // y is from bottom in PDF, but our system might be from top?
      // Wait, let's see how our system parses x/y. 
      // In pdfEngine.ts, y is from top. So we need to flip it.
      const yFromTop = viewport.height - dy - fontSize;
      const yPercent = (yFromTop / viewport.height) * 100;
      
      const widthPercent = (item.width / viewport.width) * 100;
      const heightPercent = (fontSize / viewport.height) * 100;
      
      elements.push({
        id: `extracted_t_${i}_${idx}_${Date.now()}`,
        type: 'text',
        x: xPercent,
        y: yPercent,
        width: Math.max(widthPercent, 5), // Ensure some min width
        height: Math.max(heightPercent, 2),
        text: text,
        fontSize: fontSize,
        fontFamily: 'Plus Jakarta Sans', // Fallback font
        color: '#1F2937', // Default to dark grey
        fontWeight: 'normal',
        isOriginal: true,
      });
    });

    // Merge with any existing non-dummy elements from the previous doc
    const existingPage = doc.pages.find(p => p.originalPageNumber === i || p.pageNumber === i);
    if (existingPage) {
      const userElements = existingPage.elements?.filter(e => !(e.isOriginal && e.type === 'text' && e.id.startsWith('imported_p'))) || [];
      elements.push(...userElements);
    }

    newPages.push({
      pageNumber: i,
      originalPageNumber: i,
      rotation: existingPage ? existingPage.rotation : 0,
      width: viewport.width,
      height: viewport.height,
      elements: elements
    });
  }

  return {
    ...doc,
    pages: newPages,
    rawBytes: undefined // Remove rawBytes so it renders purely as canvas elements and allows pure edit
  };
}
