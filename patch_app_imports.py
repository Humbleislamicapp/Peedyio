import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Remove CompressTool import
code = re.sub(r"import\s*\{\s*CompressTool\s*\}\s*from\s*'\./components/tools/CompressTool';\n", "", code)
# Remove ToolHub import
code = re.sub(r"import\s*\{\s*ToolHub\s*\}\s*from\s*'\./components/ToolHub';\n", "", code)

# Remove ORGANIZE_ITEMS
code = re.sub(r"const ORGANIZE_ITEMS = \[.*?\];", "", code, flags=re.DOTALL)
# Remove SIGN_PROTECT_ITEMS
code = re.sub(r"const SIGN_PROTECT_ITEMS = \[.*?\];", "", code, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(code)

