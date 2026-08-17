import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add state
state_old = """  const [userSignature, setUserSignature] = useState<{dataUrl?: string, signerName?: string}>({});"""
state_new = """  const [userSignature, setUserSignature] = useState<{dataUrl?: string, signerName?: string}>({});
  const [initialEditorMode, setInitialEditorMode] = useState<string>('edit');"""

code = code.replace(state_old, state_new)

# Update handleOpenDocument
open_old = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    setActiveView('editor');
  };"""

open_new = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    if (activeView === 'review_hub') {
      setInitialEditorMode('review');
    } else if (activeView === 'fill_hub') {
      setInitialEditorMode('fill');
    } else if (activeView === 'sign_hub') {
      setInitialEditorMode('sign');
    } else {
      setInitialEditorMode('edit');
    }
    setActiveView('editor');
  };"""

code = code.replace(open_old, open_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

