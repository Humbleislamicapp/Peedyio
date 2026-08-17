with open('src/components/HomeDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if "  );\n" in line:
        new_lines.append("    </div>\n")
    new_lines.append(line)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
