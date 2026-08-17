import re

with open('src/components/tools/CompareTool.tsx', 'r') as f:
    code = f.read()

# remove handleLoadSampleDiff function entirely
code = re.sub(r'const handleLoadSampleDiff.*?};\n\n', '', code, flags=re.DOTALL)

# remove button
button_html = """          <button
            onClick={handleLoadSampleDiff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Load Sample Difference Pair</span>
          </button>"""
code = code.replace(button_html, "")

with open('src/components/tools/CompareTool.tsx', 'w') as f:
    f.write(code)

