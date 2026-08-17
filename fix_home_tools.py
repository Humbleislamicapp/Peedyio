import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    code = f.read()

# For spotlight cards, let's remove "Organise" and keep "Sign PDF" since Sign is different from Protect.
code = re.sub(r"\s*\{\s*id: 'organize_hub',\s*title: 'Organise',\s*iconBg: [^}]+\},\s*", "", code)

# For allTools, remove organize_hub, optimize, protect_hub.
code = re.sub(r"\s*\{\s*id: 'organize_hub'[^\}]+\},\s*", "", code)
code = re.sub(r"\s*\{\s*id: 'optimize'[^\}]+\},\s*", "", code)
code = re.sub(r"\s*\{\s*id: 'protect_hub'[^\}]+\},\s*", "", code)

# If allTools is empty, we should just remove the Expanded Tools Suite entirely. Let's see if allTools is empty after this.

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(code)
