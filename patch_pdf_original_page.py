import re

with open('src/types/pdf.ts', 'r') as f:
    code = f.read()

model_old = """export interface PDFPageModel {
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270"""

model_new = """export interface PDFPageModel {
  pageNumber: number;
  originalPageNumber?: number;
  isBlank?: boolean;
  rotation: number; // 0, 90, 180, 270"""

code = code.replace(model_old, model_new)
with open('src/types/pdf.ts', 'w') as f:
    f.write(code)

with open('src/utils/pdfEngine.ts', 'r') as f:
    code = f.read()

parse_old = """      pages.push({
        pageNumber: i + 1,
        rotation: rot,"""

parse_new = """      pages.push({
        pageNumber: i + 1,
        originalPageNumber: i + 1,
        rotation: rot,"""
code = code.replace(parse_old, parse_new)

# Now, in generateBinaryPdf, we should create a NEW pdf document, and COPY the original pages into it if they are not blank!
export_old = """export async function generateBinaryPdf(docModel: PDFDocumentModel): Promise<Uint8Array> {
  let pdfDoc;
  let isEditingExisting = false;

  if (docModel.rawBytes) {
    try {
      pdfDoc = await PDFDocument.load(docModel.rawBytes, { ignoreEncryption: true });
      isEditingExisting = true;
    } catch (e) {
      console.warn("Could not load original rawBytes for export, falling back to creating new", e);
      pdfDoc = await PDFDocument.create();
    }
  } else {
    pdfDoc = await PDFDocument.create();
  }

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);

  for (let i = 0; i < docModel.pages.length; i++) {
    const pageModel = docModel.pages[i];
    const width = pageModel.width || 595;
    const height = pageModel.height || 842;
    
    let page;
    if (isEditingExisting && i < pdfDoc.getPageCount()) {
       page = pdfDoc.getPage(i);
    } else {
       page = pdfDoc.addPage([width, height]);
    }"""

export_new = """export async function generateBinaryPdf(docModel: PDFDocumentModel): Promise<Uint8Array> {
  let originalPdfDoc = null;
  let isEditingExisting = false;

  if (docModel.rawBytes) {
    try {
      originalPdfDoc = await PDFDocument.load(docModel.rawBytes, { ignoreEncryption: true });
      isEditingExisting = true;
    } catch (e) {
      console.warn("Could not load original rawBytes for export", e);
    }
  }

  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);

  for (let i = 0; i < docModel.pages.length; i++) {
    const pageModel = docModel.pages[i];
    const width = pageModel.width || 595;
    const height = pageModel.height || 842;
    
    let page;
    if (isEditingExisting && originalPdfDoc && pageModel.originalPageNumber && pageModel.originalPageNumber <= originalPdfDoc.getPageCount()) {
       // Copy the specific page from the original document
       const [copiedPage] = await pdfDoc.copyPages(originalPdfDoc, [pageModel.originalPageNumber - 1]);
       page = pdfDoc.addPage(copiedPage);
       
       // Handle rotation if the user rotated the page in the editor (it overrides original rotation)
       if (pageModel.rotation !== undefined && pageModel.rotation !== copiedPage.getRotation().angle) {
           page.setRotation(degrees(pageModel.rotation));
       }
    } else {
       page = pdfDoc.addPage([width, height]);
       if (pageModel.rotation) {
           page.setRotation(degrees(pageModel.rotation));
       }
    }"""

code = code.replace(export_old, export_new)
with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(code)

