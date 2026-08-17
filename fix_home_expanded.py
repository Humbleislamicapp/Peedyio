import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    code = f.read()

# Expanded Tools Suite
code = re.sub(r"\{\/\* Expanded Tools Suite \*\/\}.*?(?=\s*<\/div>\s*<\/div>\s*\);\s*\};\s*export default HomeDashboard;)", "", code, flags=re.DOTALL)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(code)
