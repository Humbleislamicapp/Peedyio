import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    content = f.read()

# Add Lock to imports if not there
if 'Lock' not in content:
    content = content.replace('Sparkles,', 'Sparkles,\n  Lock,')

old_cards = """    { id: 'ask_peedy', title: 'AI Assistant', iconBg: 'bg-purple-50 text-purple-600', icon: Sparkles, desc: 'Summarise, extract & rewrite' }"""
new_cards = """    { id: 'ask_peedy', title: 'AI Assistant', iconBg: 'bg-purple-50 text-purple-600', icon: Sparkles, desc: 'Summarise, extract & rewrite', badge: 'PRO' }"""
content = content.replace(old_cards, new_cards)

old_render = """<h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>"""
new_render = """<h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 justify-center">
                  {card.title}
                  {card.badge === 'PRO' && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                      <Lock className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </h3>"""
content = content.replace(old_render, new_render)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated HomeDashboard badges")
