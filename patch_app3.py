import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

# Remove cases
app = re.sub(r"\s*case 'create':\s*setActiveView\('create'\);\s*break;", "", app)
app = re.sub(r"\s*case 'templates':\s*setActiveView\('templates'\);\s*break;", "", app)

app = re.sub(r"\s*\{activeView === 'create' && \(.*?\)\}", "", app, flags=re.DOTALL)
app = re.sub(r"\s*\{activeView === 'templates' && \(.*?\)\}", "", app, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(app)
