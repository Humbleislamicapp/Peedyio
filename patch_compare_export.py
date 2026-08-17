import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

code = code.replace("export default CompareTool;", "")

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

