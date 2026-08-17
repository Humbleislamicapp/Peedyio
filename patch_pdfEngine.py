import re

with open('src/utils/pdfEngine.ts', 'r') as f:
    content = f.read()

# Let's see if we can find the start of parseUploadedFile
start_str = "export async function parseUploadedFile(file: File): Promise<PDFDocumentModel> {"
new_func = """export async function parseUploadedFile(file: File): Promise<PDFDocumentModel> {
  const fileName = file.name;
  const fileSize = file.size;

  let finalArrayBuffer: ArrayBuffer;
  let finalFileName = fileName;

  const isPdf = file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g)$/i.test(fileName);
  const isDocx = fileName.toLowerCase().endsWith('.docx');

  if (isImage) {
    // 1. Convert image to real PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const bytes = await file.arrayBuffer();
    
    let image;
    if (fileName.toLowerCase().endsWith('.png') || file.type === 'image/png') {
      image = await pdfDoc.embedPng(bytes);
    } else {
      image = await pdfDoc.embedJpg(bytes);
    }

    const { width, height } = image.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });

    finalArrayBuffer = await pdfDoc.save();
    finalFileName = fileName.replace(/\.[^/.]+$/, "") + '.pdf';
  } else if (isDocx) {
    // 2. Convert DOCX to PDF using our backend API
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/convert/docx', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to convert DOCX file.');
      }
      finalArrayBuffer = await response.arrayBuffer();
      finalFileName = fileName.replace(/\.[^/.]+$/, "") + '.pdf';
    } catch (error) {
      console.error('DOCX Conversion error:', error);
      throw new Error('DOCX conversion failed. Please ensure the server is running and CONVERT_API_SECRET is set.');
    }
  } else if (isPdf) {
    finalArrayBuffer = await file.arrayBuffer();
  } else {
    // Fallback for Text or unsupported types - create a blank PDF with the text
    const textContent = await file.text();
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    
    // Quick simple text drawing
    const lines = textContent.split('\\n');
    let y = height - 50;
    for (const line of lines) {
      if (y < 50) {
        // Add new page if out of space
        const newPage = pdfDoc.addPage([595, 842]);
        y = height - 50;
      }
      try {
        page.drawText(line.substring(0, 100), { x: 50, y, size: 12 });
      } catch (e) {}
      y -= 15;
    }
    
    finalArrayBuffer = await pdfDoc.save();
    finalFileName = fileName.replace(/\.[^/.]+$/, "") + '.pdf';
  }

  const rawBytes = new Uint8Array(finalArrayBuffer);

  try {
    const loadedPdf = await PDFDocument.load(rawBytes.slice(0), { ignoreEncryption: true });
    const pageCount = loadedPdf.getPageCount();

    const pages: PDFPageModel[] = [];
    for (let i = 0; i < pageCount; i++) {
      const p = loadedPdf.getPage(i);
      const { width, height } = p.getSize();
      const rot = p.getRotation().angle;
      pages.push({
        pageNumber: i + 1,
        originalPageNumber: i + 1,
        rotation: rot,
        width: width || 595,
        height: height || 842,
        elements: []
      });
    }

    return {
      id: `doc_imported_${Date.now()}`,
      name: finalFileName,
      size: rawBytes.byteLength,
      lastModified: 'Just now',
      pageCount: pageCount,
      starred: false,
      rawBytes: rawBytes,
      tags: ['Uploaded'],
      pages
    };
  } catch (error) {
    // Fallback if parsing fails
    return {
      id: `doc_pdf_fallback_${Date.now()}`,
      name: finalFileName,
      size: rawBytes.byteLength,
      lastModified: 'Just now',
      pageCount: 1,
      starred: false,
      rawBytes: rawBytes,
      tags: ['Uploaded'],
      pages: [
        {
          pageNumber: 1,
          rotation: 0,
          width: 595,
          height: 842,
          elements: []
        }
      ]
    };
  }
}
"""

# Replace from `export async function parseUploadedFile` to the end of the file.
idx = content.find(start_str)
if idx != -1:
    content = content[:idx] + new_func
    
with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(content)
print("Updated pdfEngine.ts")
