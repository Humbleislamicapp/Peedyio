import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

new_main_items = """  const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: Home },
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'ask_peedy' as ViewMode, label: 'Ask Peedy (AI)', icon: Sparkles, badge: 'New' },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
  ];"""

content = re.sub(r'const mainNavItems = \[.*?\];', new_main_items, content, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
print("Sidebar updated")
