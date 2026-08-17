import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Update the spotlight cards
spotlight_cards_new = """  const spotlightCards = [
    { id: 'edit_hub', title: 'Edit', iconBg: 'bg-blue-50 text-blue-600', icon: Edit3, desc: 'Text, images & annotations' },
    { id: 'ask_peedy', title: 'AI Assistant', iconBg: 'bg-purple-50 text-purple-600', icon: Sparkles, desc: 'Summarise, extract & rewrite' },
    { id: 'review_hub', title: 'Review', iconBg: 'bg-emerald-50 text-emerald-600', icon: MessageSquare, desc: 'Comments & collaboration' },
    { id: 'fill_hub', title: 'Fill', iconBg: 'bg-indigo-50 text-indigo-600', icon: FormInput, desc: 'Form fields & checkboxes' },
    { id: 'sign_hub', title: 'Sign', iconBg: 'bg-amber-50 text-amber-600', icon: PenTool, desc: 'Signatures & workflows' },
  ];"""

content = re.sub(r'const spotlightCards = \[.*?\];', spotlight_cards_new, content, flags=re.DOTALL)

# 2. Make them decorative (remove onClick, change button to div, add description)
# The current rendering is:
# <button key={card.id} onClick={() => onSelectTool(card.id)} className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-center"> ...
cards_render_old = r'<div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">.*?</div>\s*\{/\* Drag & Drop Zone'
cards_render_new = """<div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {spotlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${card.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{card.desc}</p>
              </div>
            );
          })}
        </div>
        
        {/* Drag & Drop Zone"""
content = re.sub(cards_render_old, cards_render_new, content, flags=re.DOTALL)

# 3. Remove "All Tools Section" entirely
tools_section_pattern = r'\{/\* All Tools Section \*/\}.*?(?=</div>\n    </div>\n  \);\n})'
content = re.sub(tools_section_pattern, '', content, flags=re.DOTALL)

# 4. Swap Drag & Drop Zone with Recent Files
# Wait, the prompt says "move the recent files section below up upload section in all tools pages" 
# Oh, it means "move the recent files section below THE upload section in all tools pages" - wait, isn't it already below? Let's verify by just writing it out explicitly.
# Wait, let's swap them if Recent is above Drag & Drop. In HomeDashboard, Drag & Drop is above Recent Files. 
# Wait, no, maybe the prompt implies: "move the recent files section above the upload section" (below up -> above?). No, "below up upload section" is definitely "below upload section". 

# Let's save the file.
with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated HomeDashboard.tsx")
