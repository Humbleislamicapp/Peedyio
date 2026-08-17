import re

with open('src/components/Sidebar.tsx', 'r') as f:
    code = f.read()

code = re.sub(r"\{\s*id: 'organize_hub' as ViewMode, label: 'Organise', icon: Layers\s*\},", "", code)
code = re.sub(r"\{\s*id: 'optimize' as ViewMode, label: 'Optimize', icon: Minimize2\s*\},", "", code)
code = re.sub(r"\{\s*id: 'protect_hub' as ViewMode, label: 'Sign & Protect', icon: ShieldCheck\s*\},", "", code)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(code)

