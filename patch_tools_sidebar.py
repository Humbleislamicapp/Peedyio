import re

with open('src/components/editor/EditorToolsSidebar.tsx', 'r') as f:
    content = f.read()

# Make sure FormInput is imported
if 'FormInput' not in content:
    content = content.replace('MessageSquare,', 'MessageSquare,\n  FormInput,')

# We need to replace the flat list of buttons.
# Let's find the container.
start_str = '            <div className="flex flex-col gap-1 mb-6">'
end_str = '            {/* Contextual Properties Panel */}'
import_idx = content.find(start_str)
if import_idx != -1:
    end_idx = content.find(end_str, import_idx)
    
    new_tools_section = """            <div className="flex flex-col gap-4 mb-6">
              {/* Edit Group */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Edit</h3>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onSelectTool('select')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'select'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    <span>Select / Move</span>
                  </button>
                  <button
                    onClick={() => onSelectTool('addText')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'addText' || activeTool === 'editText'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Add Text</span>
                  </button>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Insert Image</span>
                  </button>
                  <button
                    onClick={() => onSelectTool('shape')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'shape'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Shapes</span>
                  </button>
                </div>
              </div>

              {/* Review Group */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Review</h3>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onSelectTool('highlight')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'highlight'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                    <span>Highlight</span>
                  </button>
                  <button
                    onClick={() => onSelectTool('draw')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'draw'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 text-blue-500" />
                    <span>Freehand Pen</span>
                  </button>
                  <button
                    onClick={() => onSelectTool('comment')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'comment'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Sticky Note</span>
                  </button>
                  <button
                    onClick={() => onSelectTool('stamp')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'stamp'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Stamp className="w-3.5 h-3.5 text-rose-500" />
                    <span>Stamps</span>
                  </button>
                </div>
              </div>

              {/* Fill Group */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Fill</h3>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onSelectTool('formField')}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTool === 'formField'
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <FormInput className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Form Fields</span>
                  </button>
                </div>
              </div>

              {/* Sign Group */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Sign</h3>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={onOpenSignModal}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sign Document</span>
                  </button>
                </div>
              </div>
              
              {/* Redaction Group */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectTool('redact')}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTool === 'redact'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50 border border-rose-100'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Permanent Redaction</span>
                </button>
              </div>
            </div>
            """
    
    content = content[:import_idx] + new_tools_section + content[end_idx:]

with open('src/components/editor/EditorToolsSidebar.tsx', 'w') as f:
    f.write(content)
print("Updated EditorToolsSidebar")
