import re

with open('src/App.tsx', 'r') as f:
    app = f.read()

correct_router = """        {/* View Router */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeView === 'organize_hub' && (
            <ToolHub
              title="Organise"
              description="Merge, split, extract, and reorder your PDFs."
              items={ORGANIZE_ITEMS}
              onSelectTool={handleSelectTool}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'protect_hub' && (
            <ToolHub
              title="Sign & Protect"
              description="Sign documents, add AES encryption, and manage permissions."
              items={SIGN_PROTECT_ITEMS}
              onSelectTool={handleSelectTool}
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'ask_peedy' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Ask Peedy AI</h1>
              <p className="text-slate-500 mt-2 max-w-md">
                Describe what you want to do with your PDFs and Peedy will handle it automatically. AI features are coming soon.
              </p>
              <button onClick={() => setActiveView('dashboard')} className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                Back to Dashboard
              </button>
            </div>
          )}

          {activeView === 'dashboard' && (
            <HomeDashboard
              recentDocuments={documents}
              onOpenDocument={handleOpenDocument}
              onSelectTool={handleSelectTool}
              onFileUpload={handleFileUpload}
              onNewBlankDocument={handleCreateBlankDocument}
              searchFilter={searchQuery}
            />
          )}

          {activeView === 'editor' && (
            <PdfEditor
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onSaveDocument={handleSaveDocument}
              onOpenExportModal={(doc) => { setExportTargetDocument(doc || null); setIsExportModalOpen(true); }}
              onOpenSignModal={() => setIsSignModalOpen(true)}
              signatureDataUrl={userSignature.dataUrl}
              signerName={userSignature.signerName}
            />
          )}

          {activeView === 'merge' && (
            <MergeTool
              initialDocs={documents}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeView === 'split' && (
            <SplitTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'extract' && (
            <ExtractTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'compress' && (
            <CompressTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'sign' && (
            <SignTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'protect' && (
            <ProtectTool
              document={exportTargetDocument || currentDocument}
              onBack={() => setActiveView('dashboard')}
              onOpenInEditor={handleOpenDocument}
            />
          )}

          {activeView === 'library' && (
            <DocumentLibrary
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
              onDuplicateDocument={handleDuplicateDocument}
              onNewBlankDocument={handleCreateBlankDocument}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeView === 'batch' && (
            <BatchTool
              initialDocs={documents}
              onBack={() => setActiveView('dashboard')}
              onFileUpload={handleFileUpload}
            />
          )}
        </div>"""

app = re.sub(r"\{\/\* View Router \*\/\}.*?(?=\{\/\* Privacy Toast \/ Footer from Design Specification \*\/\})", correct_router + "\n\n        ", app, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(app)
