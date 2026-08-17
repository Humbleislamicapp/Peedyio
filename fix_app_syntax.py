with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if i == 242 or i == 243 or i == 244 or i == 245: # Lines 243-246 (0-indexed 242-245)
        continue
    if i == 317 or i == 318 or i == 319: # Lines 318-320 (0-indexed 317-319)
        continue
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
