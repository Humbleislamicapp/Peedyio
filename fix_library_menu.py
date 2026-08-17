import re

with open('src/components/library/DocumentLibrary.tsx', 'r') as f:
    code = f.read()

# Add onProtectDocument to props
code = code.replace("  onFileUpload: (files: FileList | null) => void;", "  onFileUpload: (files: FileList | null) => void;\n  onProtectDocument?: (doc: PDFDocumentModel) => void;")
code = code.replace("  onFileUpload,\n}) => {", "  onFileUpload,\n  onProtectDocument,\n}) => {")

# Grid View replacement
grid_old = """                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDownload(doc, e)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateDocument(doc);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>"""

grid_new = """                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenuDocId === doc.id && (
                      <div className="absolute right-0 bottom-6 w-36 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-10 py-1 text-xs animate-in fade-in zoom-in-95">
                        <button onClick={(e) => { e.stopPropagation(); handleDownload(doc, e); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download</button>
                        <button onClick={(e) => { e.stopPropagation(); onDuplicateDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Copy className="w-3.5 h-3.5"/> Duplicate</button>
                        {onProtectDocument && <button onClick={(e) => { e.stopPropagation(); onProtectDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Shield className="w-3.5 h-3.5"/> Protect</button>}
                        <div className="h-px bg-zinc-100 my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                      </div>
                    )}
                  </div>"""

code = code.replace(grid_old, grid_new)

# List View replacement
list_old = """              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleDownload(doc, e)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateDocument(doc);
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>"""

list_new = """              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuDocId === doc.id && (
                  <div className="absolute right-0 top-10 w-36 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-10 py-1 text-xs animate-in fade-in zoom-in-95">
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(doc, e); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download</button>
                    <button onClick={(e) => { e.stopPropagation(); onDuplicateDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Copy className="w-3.5 h-3.5"/> Duplicate</button>
                    {onProtectDocument && <button onClick={(e) => { e.stopPropagation(); onProtectDocument(doc); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 flex items-center gap-2"><Shield className="w-3.5 h-3.5"/> Protect</button>}
                    <div className="h-px bg-zinc-100 my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); setActiveMenuDocId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                  </div>
                )}
              </div>"""

code = code.replace(list_old, list_new)

with open('src/components/library/DocumentLibrary.tsx', 'w') as f:
    f.write(code)

