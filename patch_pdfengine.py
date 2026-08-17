import re

with open('src/utils/pdfEngine.ts', 'r') as f:
    code = f.read()

target = "originalPdfDoc = await PDFDocument.load(docModel.rawBytes, { ignoreEncryption: true });"
replacement = "originalPdfDoc = await PDFDocument.load(docModel.rawBytes.slice(0), { ignoreEncryption: true });"

code = code.replace(target, replacement)

target2 = "const loadedPdf = await PDFDocument.load(rawBytes, { ignoreEncryption: true });"
replacement2 = "const loadedPdf = await PDFDocument.load(rawBytes.slice(0), { ignoreEncryption: true });"

code = code.replace(target2, replacement2)

with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(code)

