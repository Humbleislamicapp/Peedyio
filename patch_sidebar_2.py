import re

with open('src/components/Sidebar.tsx', 'r') as f:
    sidebar = f.read()

sidebar = re.sub(r"\{\/\* Create Section \*\/\}.*?(?=\{\/\* Other Section \*\/\})", "", sidebar, flags=re.DOTALL)
sidebar = re.sub(r"\{\/\* Other Section \*\/\}.*?(?=\{\/\* Storage Widget at Bottom \*\/\})", "", sidebar, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(sidebar)

