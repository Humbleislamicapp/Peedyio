import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "{activeView === 'compare' && (" in line:
        skip = True
    elif "{activeView === 'convert' && (" in line:
        skip = True
    elif "{activeView === 'ocr' && (" in line:
        skip = True

    if not skip:
        new_lines.append(line)

    if skip and line.strip() == ")}":
        skip = False

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)

