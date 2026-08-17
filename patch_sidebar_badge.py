import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

badge_pattern = r'(\{item\.badge && \(\s*<span\s*className=\{`px-1\.5 py-0\.5 rounded-full text-\[10px\] font-bold \$\{\s*isActive\s*\?\s*\'bg-blue-200/70 text-blue-800\'\s*:\s*\'bg-slate-100 text-slate-500\'\s*\}\`\}\s*>\s*)\{item\.badge\}'
new_badge = r'\1{item.badge === "PRO" ? <span className="flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> PRO</span> : item.badge}'
content = re.sub(badge_pattern, new_badge, content)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
print("Updated Sidebar badge")
