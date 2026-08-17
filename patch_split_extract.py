import re

with open('src/utils/pdfEngine.ts', 'r') as f:
    code = f.read()

# Add rawBytes to split parts
def add_rawBytes(text):
    return text.replace("tags: ['Split']", "rawBytes: doc.rawBytes,\n        tags: ['Split']")

code = code.replace("tags: ['Split']", "rawBytes: doc.rawBytes,\n        tags: ['Split']")
code = code.replace("tags: ['Extracted']", "rawBytes: doc.rawBytes,\n    tags: ['Extracted']")

with open('src/utils/pdfEngine.ts', 'w') as f:
    f.write(code)

