import re

with open('src/utils/pdfEngine.ts', 'r') as f:
    code = f.read()

catch_old = """  } catch (err) {
    console.error('Error parsing raw PDF:', err);
    // Return friendly fallback document model
    return {
      id: `doc_pdf_fallback_${Date.now()}`,
      name: fileName,
      size: fileSize,
      lastModified: 'Just now',
      pageCount: 1,
      starred: false,
      tags: ['Uploaded'],"""

catch_new = """  } catch (err) {
    console.error('Error parsing raw PDF:', err);
    // Return friendly fallback document model but include rawBytes so pdfjs can attempt to render/show password prompt
    return {
      id: `doc_pdf_fallback_${Date.now()}`,
      name: fileName,
      size: fileSize,
      lastModified: 'Just now',
      pageCount: 1,
      starred: false,
      rawBytes: rawBytes,
      tags: ['Uploaded'],"""

code = code.replace(catch_old, catch_new)

with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(code)

