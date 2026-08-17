import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

# Add import
app = app.replace("import { ExtractTool } from './components/tools/ExtractTool';", "import { ExtractTool } from './components/tools/ExtractTool';\nimport { EditHub } from './components/EditHub';")

# Update handleFileUpload
app = app.replace("if (activeView === 'dashboard') {", "if (activeView === 'dashboard' || activeView === 'edit_hub') {")

# Update handleSelectTool 'editor' routing
# Find the handleSelectTool function switch statement
app = app.replace("case 'editor':\n      case 'edit':\n      default:\n        setActiveView('editor');\n        break;", "case 'editor':\n      case 'edit':\n        setActiveView('edit_hub');\n        break;\n      default:\n        setActiveView('dashboard');\n        break;")

# Add EditHub to Router
edit_hub_jsx = """          {activeView === 'edit_hub' && (
            <EditHub
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeView === 'dashboard'"""

app = app.replace("{activeView === 'dashboard'", edit_hub_jsx)

# Also update the pdf type to include 'edit_hub'
with open('src/types/pdf.ts', 'r') as f:
    pdf_types = f.read()

pdf_types = pdf_types.replace("| 'editor'", "| 'editor'\n  | 'edit_hub'")

with open('src/types/pdf.ts', 'w') as f:
    f.write(pdf_types)

with open('src/App.tsx', 'w') as f:
    f.write(app)

