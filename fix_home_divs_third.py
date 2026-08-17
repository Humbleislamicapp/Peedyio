with open('src/components/HomeDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip_next = False
for i, line in enumerate(lines):
    if line == "    </div>\n" and i + 1 < len(lines) and (lines[i+1] == "                );\n" or lines[i+1] == "          );\n"):
        continue
    new_lines.append(line)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
