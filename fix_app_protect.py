import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

lib_old = """          {activeView === 'library' && (
            <DocumentLibrary
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
              onDuplicateDocument={handleDuplicateDocument}
              onNewBlankDocument={handleCreateBlankDocument}
              onFileUpload={handleFileUpload}
            />
          )}"""

lib_new = """          {activeView === 'library' && (
            <DocumentLibrary
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
              onDuplicateDocument={handleDuplicateDocument}
              onNewBlankDocument={handleCreateBlankDocument}
              onFileUpload={handleFileUpload}
              onProtectDocument={(doc) => {
                setExportTargetDocument(doc);
                setActiveView('protect');
              }}
            />
          )}"""

code = code.replace(lib_old, lib_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

