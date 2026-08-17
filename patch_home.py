import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    code = f.read()

# Populate allTools
tools_old = """  // Extended tools suite
  const allTools: Array<{id: string, title: string, desc: string, icon: any, color: string, badge?: string}> = [];"""

tools_new = """  // Extended tools suite
  const allTools: Array<{id: string, title: string, desc: string, icon: any, color: string, badge?: string}> = [
    { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one.', icon: Layers, color: 'text-blue-500' },
    { id: 'split', title: 'Split PDF', desc: 'Separate one page or a whole set.', icon: Scissors, color: 'text-rose-500' },
    { id: 'extract', title: 'Extract Pages', desc: 'Pull specific pages from a file.', icon: Copy, color: 'text-emerald-500' },
    { id: 'convert', title: 'Convert PDF', desc: 'Convert to Word, Excel, and more.', icon: ArrowLeftRight, color: 'text-indigo-500', badge: 'PRO' },
    { id: 'compress', title: 'Compress PDF', desc: 'Reduce file size without quality loss.', icon: Minimize2, color: 'text-amber-500' },
    { id: 'compare', title: 'Compare PDF', desc: 'Spot differences between two files.', icon: GitCompare, color: 'text-cyan-500' },
    { id: 'ocr', title: 'OCR PDF', desc: 'Make scanned text searchable.', icon: ScanText, color: 'text-fuchsia-500', badge: 'PRO' },
    { id: 'protect', title: 'Protect & Redact', desc: 'Add passwords, redact info.', icon: Lock, color: 'text-slate-500' },
  ];"""

code = code.replace(tools_old, tools_new)

# Render allTools
render_old = """          )}
        </div>
      </div>
    </div>"""

render_new = """          )}
        </div>

        {/* All Tools Section */}
        <div className="w-full mt-12 mb-8">
          <h3 className="font-bold text-slate-800 text-lg mb-4">All PDF Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 transition-all text-left group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 transition-colors group-hover:bg-blue-50 ${tool.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm truncate">
                      {tool.title}
                      {tool.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200/50">
                          {tool.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>"""

code = code.replace(render_old, render_new)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(code)

