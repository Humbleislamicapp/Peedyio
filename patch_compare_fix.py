import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

target = """      setDocA(orig);
    setDocB(modified);
    const res = comparePdfDocuments(orig, modified);
    setDiffResult(res);
  };"""

code = code.replace(target, "")

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

