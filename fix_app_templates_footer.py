import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = re.sub(r"<button\s+onClick=\{\(\) => setActiveView\('templates'\)\}.*?<\/button>", "", code, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(code)
