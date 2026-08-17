import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

target = "const orig = initialDocs[0]; // Wait, let's fix this properly"
replacement = """const orig = docA;
    if (!orig) return;"""

code = code.replace(target, replacement)

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

