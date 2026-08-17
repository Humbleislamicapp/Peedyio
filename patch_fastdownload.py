import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

target = """  const handleFastDownload = async () => {
    try {
      const pdfBytes = await generateBinaryPdf(doc);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, doc.name.endsWith('.pdf') ? doc.name : `${doc.name}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };"""

replacement = """  const handleFastDownload = async () => {
    try {
      const pdfBytes = await generateBinaryPdf(doc);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      let finalName = doc.name;
      if (!finalName.includes('_copy')) {
        finalName = finalName.replace('.pdf', '') + '_copy.pdf';
      } else if (!finalName.endsWith('.pdf')) {
        finalName = finalName + '.pdf';
      }
      downloadBlob(blob, finalName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };"""

code = code.replace(target, replacement)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

