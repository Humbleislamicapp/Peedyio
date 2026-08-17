with open('src/components/Sidebar.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if line.strip() == '</div>' and i > len(lines) - 10:
        if lines[i+1].strip() == '</div>' and lines[i+2].strip() == '</aside>':
            continue
    new_lines.append(line)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.writelines(new_lines)
