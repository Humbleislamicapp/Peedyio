import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

code = code.replace("  onFileUpload: (files: FileList | null) => void;", "")
code = code.replace("  onFileUpload,\n", "")

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

