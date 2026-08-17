import re

with open('src/components/editor/EditorPagesSidebar.tsx', 'r') as f:
    content = f.read()

# Replace header
header_start = content.find('<div className="p-3 border-b border-slate-200 flex items-center justify-between">')
header_end = content.find('<div className="flex-1 overflow-y-auto p-3 space-y-3">', header_start)

new_header = """<div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {sidebarMode === 'review' ? (
                <>
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Review</span>
                </>
              ) : sidebarMode === 'sign' ? (
                <>
                  <PenTool className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Sign Document</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">
                    Pages ({pages?.length || 0})
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {sidebarMode === 'pages' && (
                <button
                  onClick={onAddBlankPage}
                  className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                  title="Add blank page"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              {onTogglePagesCollapsed && (
                <button
                  onClick={onTogglePagesCollapsed}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                  title="Collapse Pages Panel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {sidebarMode === 'pages' && (
              <>
"""

content = content[:header_start] + new_header + content[header_end + len('<div className="flex-1 overflow-y-auto p-3 space-y-3">'):]

# Find where pages map ends to insert review and sign blocks
# Find the end of `{(pages || []).map((page, idx) => {`
# It ends right before `</div>\n        </div>\n      )}` at the end of the file

end_marker = """              );
            })}"""
insert_pos = content.rfind(end_marker) + len(end_marker)

new_tail = """
              </>
            )}

            {sidebarMode === 'review' && (
              <div className="flex flex-col gap-3">
                {reviewItems.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No comments or notes yet.</p>
                  </div>
                ) : (
                  reviewItems.map((item, idx) => {
                    const isPrivate = (item.element as any).isPrivateNote;
                    return (
                      <div 
                        key={idx}
                        onClick={() => onSelectPage(item.pageIndex)}
                        className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer shadow-2xs group transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isPrivate ? (
                              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <div className={`w-2 h-2 rounded-full ${(item.element as any).resolved ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            )}
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Page {item.pageIndex + 1}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{(item.element as any).createdAt || 'Just now'}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium line-clamp-3">{(item.element as any).text}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{(item.element as any).author || 'Reviewer'}</span>
                          {!(item.element as any).resolved && !isPrivate && (
                            <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">Unresolved</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {sidebarMode === 'sign' && (
              <div className="flex flex-col gap-4">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                  <h3 className="text-xs font-bold text-purple-900 mb-1">Signing Workflow</h3>
                  <p className="text-[10px] text-purple-700 leading-tight">
                    We'll guide you through each required field.
                  </p>
                </div>

                {signFields.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No fields to sign!</p>
                    <p className="text-[10px] text-slate-500 mt-1">This document doesn't have any required signature fields.</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-slate-700">
                        Field {currentSignIndex + 1} of {signFields.length}
                      </span>
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                        Page {signFields[currentSignIndex]?.pageIndex + 1}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                      <div 
                        className="bg-purple-500 h-full transition-all duration-300"
                        style={{ width: `${Math.max(5, ((currentSignIndex) / signFields.length) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={handlePrevSign}
                        disabled={currentSignIndex === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Prev
                      </button>
                      <button
                        onClick={handleNextSign}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                          currentSignIndex === signFields.length - 1
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {currentSignIndex === signFields.length - 1 ? 'Finish' : 'Next'}
                        {currentSignIndex !== signFields.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
"""

content = content[:insert_pos] + new_tail + content[insert_pos:]

# Add visual indicators for comments on the thumbnails
# Find `<div className="mt-auto flex items-center justify-between text-[9px] font-bold text-slate-400 z-10">`
# and modify the page representation

page_indicator_find = """                    <div className="mt-auto flex items-center justify-between text-[9px] font-bold text-slate-400 z-10">
                      <span>{idx + 1}</span>
                      {page.rotation !== 0 && (
                        <span className="text-[8px] text-slate-600">{page.rotation}°</span>
                      )}
                    </div>"""

page_indicator_replace = """                    <div className="mt-auto flex items-center justify-between text-[9px] font-bold z-10">
                      <span className={isSelected ? 'text-blue-600' : 'text-slate-400'}>{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        {page.rotation !== 0 && (
                          <span className="text-[8px] text-slate-600">{page.rotation}°</span>
                        )}
                        {page.elements?.some(e => e.type === 'comment' && !(e as any).isPrivateNote) && (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="w-2 h-2 text-blue-600" />
                          </div>
                        )}
                        {page.elements?.some(e => e.type === 'comment' && (e as any).isPrivateNote) && (
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-100 flex items-center justify-center">
                            <EyeOff className="w-2 h-2 text-amber-600" />
                          </div>
                        )}
                      </div>
                    </div>"""

content = content.replace(page_indicator_find, page_indicator_replace)

with open('src/components/editor/EditorPagesSidebar.tsx', 'w') as f:
    f.write(content)
