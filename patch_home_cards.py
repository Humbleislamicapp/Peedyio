import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    content = f.read()

old_render = """              <div
                key={card.id}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl transition-all text-center"
              >"""
new_render = """              <button
                key={card.id}
                onClick={() => onSelectTool(card.id)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-center cursor-pointer"
              >"""
content = content.replace(old_render, new_render)
content = content.replace("</p>\n              </div>", "</p>\n              </button>")

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated HomeDashboard cards")
