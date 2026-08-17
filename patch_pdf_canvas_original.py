import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

page_old = """        // PDF.js pages are 1-indexed
        const pdfPage = await pdf.getPage(page.pageNumber);"""

page_new = """        // PDF.js pages are 1-indexed
        const targetPageNum = page.originalPageNumber || page.pageNumber;
        const pdfPage = await pdf.getPage(targetPageNum);"""

code = code.replace(page_old, page_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

