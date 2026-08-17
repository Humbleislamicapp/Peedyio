import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

app = re.sub(r"\s*case 'compare':\s*setActiveView\('compare'\);\s*break;", "", app)
app = re.sub(r"\s*case 'convert':\s*setActiveView\('convert'\);\s*break;", "", app)
app = re.sub(r"\s*case 'ocr':\s*setActiveView\('ocr'\);\s*break;", "", app)

with open('src/App.tsx', 'w') as f:
    f.write(app)
