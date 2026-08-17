import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Replace the Sidebar contents to keep only main items
content = re.sub(r'const toolsItems = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const isToolActive = toolsItems.*?;\n', '', content)

# Remove the tools flyout
flyout_pattern = r'\{/\* Tools Flyout/Accordion \*/\}.*?(?=</nav>)'
content = re.sub(flyout_pattern, '', content, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
