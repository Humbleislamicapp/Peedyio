import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

# 1. Update PdfEditor props
app = app.replace("onOpenSignModal={() => setIsSignModalOpen(true)}", "onOpenSignModal={() => setIsSignModalOpen(true)}\n              onProtectDocument={() => handleSelectTool('protect')}")

# 2. Remove case blocks from handleSelectTool
app = re.sub(r"\s*case 'compress':\s*case 'optimize':\s*setActiveView\('compress'\);\s*break;", "", app)
app = re.sub(r"\s*case 'organize_hub':\s*setActiveView\('organize_hub'\);\s*break;", "", app)
app = re.sub(r"\s*case 'protect_hub':\s*setActiveView\('protect_hub'\);\s*break;", "", app)

# 3. Remove view rendering for organize_hub, protect_hub, compress
app = re.sub(r"\s*\{activeView === 'organize_hub' && \(.*?\)\}", "", app, flags=re.DOTALL)
app = re.sub(r"\s*\{activeView === 'protect_hub' && \(.*?\)\}", "", app, flags=re.DOTALL)
app = re.sub(r"\s*\{activeView === 'compress' && \(.*?\)\}", "", app, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(app)

