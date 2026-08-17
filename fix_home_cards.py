import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    code = f.read()

cards_old = """  const spotlightCards = [
    {
      id: 'edit_hub',
      title: 'Edit PDF',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      icon: Edit3,
    },
    {
      id: 'ask_peedy',
      title: 'Ask Peedy',
      iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      icon: Sparkles,
    },{
      id: 'sign',
      title: 'Sign PDF',
      iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      icon: PenTool,
    },
  ];"""

cards_new = """  const spotlightCards = [
    {
      id: 'edit_hub',
      title: 'Edit PDF',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      icon: Edit3,
    },
    {
      id: 'ask_peedy',
      title: 'Ask Peedy',
      iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      icon: Sparkles,
    },
    {
      id: 'review_hub',
      title: 'Review PDF',
      iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      icon: Edit3, // Placeholder, replaced below
    },
    {
      id: 'fill_hub',
      title: 'Fill PDF',
      iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      icon: Edit3, // Placeholder
    },
    {
      id: 'sign_hub',
      title: 'Sign PDF',
      iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      icon: PenTool,
    },
  ];"""

code = code.replace(cards_old, cards_new)

# Add imports for MessageSquare and FormInput if needed
if "MessageSquare" not in code:
    code = code.replace("import {", "import { MessageSquare, FormInput,", 1)
    
code = code.replace("icon: Edit3, // Placeholder, replaced below", "icon: MessageSquare,")
code = code.replace("icon: Edit3, // Placeholder", "icon: FormInput,")

# Render spotlight cards
render_old = """        {/* Drag & Drop Zone */}"""
render_new = """        {/* Spotlight Action Cards */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {spotlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectTool(card.id)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${card.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>
              </button>
            );
          })}
        </div>

        {/* Drag & Drop Zone */}"""

code = code.replace(render_old, render_new)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(code)

