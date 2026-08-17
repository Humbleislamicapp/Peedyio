import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

state_old = """  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);"""
state_new = """  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [initialEditorMode, setInitialEditorMode] = useState<string>('edit');"""

code = code.replace(state_old, state_new)

handleOpen_old = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    setExportTargetDocument(null);
    setActiveView('editor');
  };"""

handleOpen_new = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    setExportTargetDocument(null);
    if (activeView === 'review_hub') setInitialEditorMode('review');
    else if (activeView === 'fill_hub') setInitialEditorMode('fill');
    else if (activeView === 'sign_hub') setInitialEditorMode('sign');
    else setInitialEditorMode('edit');
    setActiveView('editor');
  };"""

code = code.replace(handleOpen_old, handleOpen_new)

editor_render_old = """          {activeView === 'editor' && (
            <PdfEditor
              document={exportTargetDocument || currentDocument}"""

editor_render_new = """          {activeView === 'editor' && (
            <PdfEditor
              document={exportTargetDocument || currentDocument}
              initialMode={initialEditorMode}"""

code = code.replace(editor_render_old, editor_render_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

