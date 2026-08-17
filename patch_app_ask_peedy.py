with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

old_view = """          {activeView === 'ask_peedy' && (
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
          )}"""

new_view = """          {activeView === 'ask_peedy' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-purple-200/50">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ask Peedy AI</h1>
              <p className="text-slate-500 mt-3 max-w-md text-base leading-relaxed">
                Describe what you want to do with your PDFs and Peedy will handle it automatically. Ask questions, summarise documents, extract data, and more.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => setShowPricing(true)} className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Unlock Unlimited AI
                </button>
                <button onClick={() => setActiveView('dashboard')} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors shadow-2xs">
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}"""

content = content.replace(old_view, new_view)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx ask_peedy view")
