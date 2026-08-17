import re

with open('src/utils/pdfEngine.ts', 'r') as f:
    code = f.read()

export_old = """export async function generateBinaryPdf(docModel: PDFDocumentModel): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);

  for (const pageModel of docModel.pages) {
    const width = pageModel.width || 595;
    const height = pageModel.height || 842;
    const page = pdfDoc.addPage([width, height]);"""

export_new = """export async function generateBinaryPdf(docModel: PDFDocumentModel): Promise<Uint8Array> {
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
    }
"""

code = code.replace(export_old, export_new)

# Now wait, when elements are drawn, `imported_p` elements should not be drawn!
elements_old = """    for (const elem of sortedElements) {"""
elements_new = """    for (const elem of sortedElements) {
      if (isEditingExisting && elem.isOriginal && elem.type === 'text' && elem.id.startsWith('imported_p')) continue;"""

code = code.replace(elements_old, elements_new)

with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(code)

