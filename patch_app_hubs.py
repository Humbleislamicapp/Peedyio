import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Update handleSelectTool to route to hubs if no document is present (except for merge and batch which have their own pickers)
tool_old = """  const handleSelectTool = (toolId: string, targetDoc?: PDFDocumentModel) => {
    if (targetDoc) {
      setCurrentDocument(targetDoc);
    }
    switch (toolId) {
      case 'merge':
        setActiveView('merge');
        break;
      case 'split':
        setActiveView('split');
        break;
      case 'extract':
        setActiveView('extract');
        break;
      case 'sign':
        setActiveView('sign');
        break;"""

tool_new = """  const handleSelectTool = (toolId: string, targetDoc?: PDFDocumentModel) => {
    if (targetDoc) {
      setCurrentDocument(targetDoc);
    }
    const hasDoc = targetDoc || currentDocument;
    switch (toolId) {
      case 'merge':
        setActiveView('merge');
        break;
      case 'batch':
        setActiveView('batch');
        break;
      case 'split':
        setActiveView(hasDoc ? 'split' : 'split_hub');
        break;
      case 'extract':
        setActiveView(hasDoc ? 'extract' : 'extract_hub');
        break;
      case 'protect':
        setActiveView(hasDoc ? 'protect' : 'protect_hub');
        break;
      case 'ocr':
        setActiveView(hasDoc ? 'ocr' : 'ocr_hub');
        break;
      case 'convert':
        setActiveView(hasDoc ? 'convert' : 'convert_hub');
        break;
      case 'sign':
        setActiveView(hasDoc ? 'sign' : 'sign_hub');
        break;"""

code = code.replace(tool_old, tool_new)

# Update handleOpenDocument to handle the new hubs
open_old = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
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

open_new = """  const handleOpenDocument = (doc: PDFDocumentModel) => {
    setCurrentDocument(doc);
    
    // If we're in a tool hub, navigate directly to that tool instead of the editor
    if (activeView === 'split_hub') {
      setActiveView('split');
      return;
    } else if (activeView === 'extract_hub') {
      setActiveView('extract');
      return;
    } else if (activeView === 'protect_hub') {
      setActiveView('protect');
      return;
    } else if (activeView === 'ocr_hub') {
      setActiveView('ocr');
      return;
    } else if (activeView === 'convert_hub') {
      setActiveView('convert');
      return;
    }
    
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

# Update the EditHub render block to include the new hubs and their one-liners
hub_old = """          {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub'].includes(activeView as string) && (
            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                PenTool
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                'bg-amber-100 text-amber-600'
              }"""

hub_new = """          {['edit_hub', 'review_hub', 'fill_hub', 'sign_hub', 'split_hub', 'extract_hub', 'protect_hub', 'ocr_hub', 'convert_hub'].includes(activeView as string) && (
            <EditHub
              title={
                activeView === 'edit_hub' ? 'Edit PDF Document' :
                activeView === 'review_hub' ? 'Review PDF Document' :
                activeView === 'fill_hub' ? 'Fill PDF Form' :
                activeView === 'split_hub' ? 'Split PDF Document' :
                activeView === 'extract_hub' ? 'Extract Pages' :
                activeView === 'protect_hub' ? 'Protect PDF' :
                activeView === 'ocr_hub' ? 'OCR PDF' :
                activeView === 'convert_hub' ? 'Convert PDF' :
                'Sign PDF Document'
              }
              description={
                activeView === 'edit_hub' ? 'Add text, highlight, draw, and annotate your PDF files directly in your browser.' :
                activeView === 'review_hub' ? 'Add comments, highlights, and annotations to review documents.' :
                activeView === 'fill_hub' ? 'Quickly fill out forms and add text to documents.' :
                activeView === 'split_hub' ? 'Separate one page or a whole set for easy conversion into independent PDF files.' :
                activeView === 'extract_hub' ? 'Pull specific pages from a file to create a new PDF document instantly.' :
                activeView === 'protect_hub' ? 'Add passwords and restrict permissions to secure your document.' :
                activeView === 'ocr_hub' ? 'Make scanned text selectable and searchable.' :
                activeView === 'convert_hub' ? 'Convert your PDF to Word, Excel, and other formats instantly.' :
                'Sign documents securely with your drawn or typed signature.'
              }
              icon={
                activeView === 'edit_hub' ? Edit3 :
                activeView === 'review_hub' ? MessageSquare :
                activeView === 'fill_hub' ? FormInput :
                activeView === 'split_hub' ? Scissors :
                activeView === 'extract_hub' ? Copy :
                activeView === 'protect_hub' ? Lock :
                activeView === 'ocr_hub' ? ScanText :
                activeView === 'convert_hub' ? ArrowLeftRight :
                PenTool
              }
              iconBg={
                activeView === 'edit_hub' ? 'bg-blue-100 text-blue-600' :
                activeView === 'review_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'fill_hub' ? 'bg-indigo-100 text-indigo-600' :
                activeView === 'split_hub' ? 'bg-rose-100 text-rose-600' :
                activeView === 'extract_hub' ? 'bg-emerald-100 text-emerald-600' :
                activeView === 'protect_hub' ? 'bg-slate-100 text-slate-600' :
                activeView === 'ocr_hub' ? 'bg-fuchsia-100 text-fuchsia-600' :
                activeView === 'convert_hub' ? 'bg-indigo-100 text-indigo-600' :
                'bg-amber-100 text-amber-600'
              }"""

code = code.replace(hub_old, hub_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

