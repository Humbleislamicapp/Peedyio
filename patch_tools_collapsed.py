import re

with open('src/components/editor/EditorToolsSidebar.tsx', 'r') as f:
    content = f.read()

start_str = '            {/* Quick tool icons in collapsed mode */}'
end_str = '          </div>\n          <div\n            onClick={onToggleToolsCollapsed}'
start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_collapsed_tools = """            {/* Edit Group */}
            <div className="flex flex-col gap-1 items-center">
              <button onClick={() => onSelectTool('select')} className={`p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`} title="Select / Move">
                <MousePointer className="w-4 h-4" />
              </button>
              <button onClick={() => onSelectTool('addText')} className={`p-2 rounded-lg transition-colors ${activeTool === 'addText' || activeTool === 'editText' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`} title="Add Text">
                <Type className="w-4 h-4" />
              </button>
              <button onClick={() => imageInputRef.current?.click()} className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors" title="Insert Image">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button onClick={() => onSelectTool('shape')} className={`p-2 rounded-lg transition-colors ${activeTool === 'shape' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`} title="Shapes">
                <Square className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px w-6 bg-slate-200 my-1" />

            {/* Review Group */}
            <div className="flex flex-col gap-1 items-center">
              <button onClick={() => onSelectTool('highlight')} className={`p-2 rounded-lg transition-colors ${activeTool === 'highlight' ? 'bg-zinc-900 text-white' : 'text-amber-600 hover:bg-amber-50'}`} title="Highlight">
                <Highlighter className="w-4 h-4" />
              </button>
              <button onClick={() => onSelectTool('draw')} className={`p-2 rounded-lg transition-colors ${activeTool === 'draw' ? 'bg-zinc-900 text-white' : 'text-blue-600 hover:bg-blue-50'}`} title="Freehand Pen">
                <PenTool className="w-4 h-4" />
              </button>
              <button onClick={() => onSelectTool('comment')} className={`p-2 rounded-lg transition-colors ${activeTool === 'comment' ? 'bg-zinc-900 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`} title="Sticky Note">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px w-6 bg-slate-200 my-1" />

            {/* Fill Group */}
            <div className="flex flex-col gap-1 items-center">
              <button onClick={() => onSelectTool('formField')} className={`p-2 rounded-lg transition-colors ${activeTool === 'formField' ? 'bg-zinc-900 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`} title="Form Fields">
                <FormInput className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px w-6 bg-slate-200 my-1" />

            {/* Sign Group */}
            <div className="flex flex-col gap-1 items-center">
              <button onClick={onOpenSignModal} className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors" title="Sign Document">
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px w-6 bg-slate-200 my-1" />

            {/* Redaction Group */}
            <div className="flex flex-col gap-1 items-center">
              <button onClick={() => onSelectTool('redact')} className={`p-2 rounded-lg transition-colors ${activeTool === 'redact' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'}`} title="Permanent Redaction">
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
"""
    content = content[:start_idx] + new_collapsed_tools + content[end_idx:]

with open('src/components/editor/EditorToolsSidebar.tsx', 'w') as f:
    f.write(content)
print("Updated Collapsed Layout")
