import re

with open('src/components/editor/PdfCanvas.tsx', 'r') as f:
    code = f.read()

# Filter elements
elements_old = """        {/* Page Rendered Elements */}
        {(page?.elements || []).map((elem) => {"""

elements_new = """        {/* Page Rendered Elements */}
        {(page?.elements || []).map((elem) => {
          // If we are rendering the actual PDF from rawBytes, hide the dummy text layers generated during upload
          if (document?.rawBytes && elem.isOriginal && elem.type === 'text' && elem.id.startsWith('imported_p')) {
            return null;
          }"""

code = code.replace(elements_old, elements_new)

with open('src/components/editor/PdfCanvas.tsx', 'w') as f:
    f.write(code)

