with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    content = f.read()

bad_block = """  useEffect(() => {
    if (activeTool === 'comment') setRightSidebarMode('review');
    else if (activeTool === 'sign') setRightSidebarMode('sign');
    else setRightSidebarMode('pages');
  }, [activeTool]);"""

good_block = """  useEffect(() => {"""

# We want to replace all occurrences EXCEPT the first one (which should actually be kept, wait, no, the first one is already fine, wait, the first one was added properly with sed, then I added it again with the second sed, then removed the duplicated one).
# Let's just find `bad_block` and see how many there are.
count = content.count(bad_block)
print(f"Found {count} bad blocks")

# Replace from the right so we don't mess up indices
parts = content.split(bad_block)
new_content = parts[0]
for part in parts[1:]:
    # Keep the first occurrence of bad_block as is, wait.
    # Actually, the first one is at line 64, which is correct.
    # The others at 349 and 379 should just be `  useEffect(() => {`
    pass

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(parts[0] + bad_block + good_block.join(parts[1:]))

