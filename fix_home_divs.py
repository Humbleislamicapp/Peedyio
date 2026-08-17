with open('src/components/HomeDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i in [261, 262, 263]:  # lines 262, 263, 264 (0-indexed 261, 262, 263)
        continue
    new_lines.append(line)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
