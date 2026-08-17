import re

with open('src/components/editor/PdfEditor.tsx', 'r') as f:
    code = f.read()

props_old = """interface PdfEditorProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onSaveDocument: (doc: PDFDocumentModel) => void;
  onOpenExportModal: (doc?: PDFDocumentModel) => void;
  onProtectDocument?: () => void;
  onOpenSignModal: () => void;
  signatureDataUrl?: string;
  signerName?: string;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({
  document: initialDoc,
  onBack,
  onSaveDocument,
  onOpenExportModal,
  onProtectDocument,
  onOpenSignModal,
  signatureDataUrl,
  signerName,
}) => {"""

props_new = """interface PdfEditorProps {
  document: PDFDocumentModel;
  onBack: () => void;
  onSaveDocument: (doc: PDFDocumentModel) => void;
  onOpenExportModal: (doc?: PDFDocumentModel) => void;
  onProtectDocument?: () => void;
  onOpenSignModal: () => void;
  signatureDataUrl?: string;
  signerName?: string;
  initialMode?: string;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({
  document: initialDoc,
  onBack,
  onSaveDocument,
  onOpenExportModal,
  onProtectDocument,
  onOpenSignModal,
  signatureDataUrl,
  signerName,
  initialMode = 'edit',
}) => {"""

code = code.replace(props_old, props_new)

# Add activePanel state
state_old = """  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');"""
state_new = """  const [activePanel, setActivePanel] = useState<string>(initialMode);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');"""
code = code.replace(state_old, state_new)

# Update EditorToolsSidebar props
sidebar_old = """        <EditorToolsSidebar
          pages={doc?.pages || []}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onRotatePage={handleRotatePage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onMovePage={handleMovePage}
          onAddBlankPage={handleAddBlankPage}
          selectedPagesForExtraction={selectedPagesForExtraction}
          onTogglePageSelection={handleTogglePageSelection}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          toolSettings={toolSettings}
          onUpdateToolSettings={handleUpdateToolSettings}
          onOpenSignModal={onOpenSignModal}
          onInsertImage={handleInsertImage}
          isPagesCollapsed={isPagesCollapsed}
          sidebarMode={rightSidebarMode}
          onSetSidebarMode={setRightSidebarMode}
        />"""

sidebar_new = """        <EditorToolsSidebar
          pages={doc?.pages || []}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onRotatePage={handleRotatePage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onMovePage={handleMovePage}
          onAddBlankPage={handleAddBlankPage}
          selectedPagesForExtraction={selectedPagesForExtraction}
          onTogglePageSelection={handleTogglePageSelection}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          toolSettings={toolSettings}
          onUpdateToolSettings={handleUpdateToolSettings}
          onOpenSignModal={onOpenSignModal}
          onInsertImage={handleInsertImage}
          isPagesCollapsed={isPagesCollapsed}
          sidebarMode={rightSidebarMode}
          onSetSidebarMode={setRightSidebarMode}
          activePanel={activePanel}
          onSetActivePanel={setActivePanel}
        />"""

code = code.replace(sidebar_old, sidebar_new)

with open('src/components/editor/PdfEditor.tsx', 'w') as f:
    f.write(code)

