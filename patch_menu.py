import re

# Update Sidebar.tsx
with open('src/components/Sidebar.tsx', 'r') as f:
    sidebar_content = f.read()

old_nav = """    const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: Home },
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'ask_peedy' as ViewMode, label: 'Ask Peedy (AI)', icon: Sparkles, badge: 'PRO' },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
  ];"""

new_nav = """    const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: Home },
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
    { id: 'ask_peedy' as ViewMode, label: 'Ask Peedy (AI)', icon: Sparkles, badge: 'PRO' },
  ];"""

sidebar_content = sidebar_content.replace(old_nav, new_nav)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(sidebar_content)


# Update HomeDashboard.tsx
with open('src/components/HomeDashboard.tsx', 'r') as f:
    home_content = f.read()

old_spotlight = """    const spotlightCards = [
    { id: 'edit_hub', title: 'Edit', iconBg: 'bg-blue-50 text-blue-600', icon: Edit3, desc: 'Text, images & annotations' },
    { id: 'ask_peedy', title: 'AI Assistant', iconBg: 'bg-purple-50 text-purple-600', icon: Sparkles, desc: 'Summarise, extract & rewrite', badge: 'PRO' },
    { id: 'review_hub', title: 'Review', iconBg: 'bg-emerald-50 text-emerald-600', icon: MessageSquare, desc: 'Comments & collaboration' },
    { id: 'fill_hub', title: 'Fill', iconBg: 'bg-indigo-50 text-indigo-600', icon: FormInput, desc: 'Form fields & checkboxes' },
    { id: 'sign_hub', title: 'Sign', iconBg: 'bg-amber-50 text-amber-600', icon: PenTool, desc: 'Signatures & workflows' },
  ];"""

new_spotlight = """    const spotlightCards = [
    { id: 'edit_hub', title: 'Edit', iconBg: 'bg-blue-50 text-blue-600', icon: Edit3, desc: 'Text, images & annotations' },
    { id: 'review_hub', title: 'Review', iconBg: 'bg-emerald-50 text-emerald-600', icon: MessageSquare, desc: 'Comments & collaboration' },
    { id: 'fill_hub', title: 'Fill', iconBg: 'bg-indigo-50 text-indigo-600', icon: FormInput, desc: 'Form fields & checkboxes' },
    { id: 'sign_hub', title: 'Sign', iconBg: 'bg-amber-50 text-amber-600', icon: PenTool, desc: 'Signatures & workflows' },
    { id: 'ask_peedy', title: 'Ask Peedy', iconBg: 'bg-purple-50 text-purple-600', icon: Sparkles, desc: 'Summarise, extract & rewrite', badge: 'PRO' },
  ];"""

home_content = home_content.replace(old_spotlight, new_spotlight)

old_card_render = """                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 justify-center">
                  {card.title}
                  {card.badge === 'PRO' && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                      <Lock className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </h3>"""

new_card_render = """                <div className="flex flex-col items-center gap-1 mt-1 mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>
                  {card.badge === 'PRO' && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                      <Lock className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </div>"""

home_content = home_content.replace(old_card_render, new_card_render)

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(home_content)

print("Updated Sidebar and HomeDashboard")
