import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

interface_pattern = r'interface HeaderProps \{.*?\n\}'
new_interface = """interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onFileUpload: (files: FileList | null) => void;
  onToggleMobileSidebar?: () => void;
  onOpenPricing?: () => void;
  onOpenEnterprise?: () => void;
}"""
content = re.sub(interface_pattern, new_interface, content, flags=re.DOTALL)

props_pattern = r'export const Header: React\.FC<HeaderProps> = \(\{.*?\}\) => \{'
new_props = """export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onFileUpload,
  onToggleMobileSidebar,
  onOpenPricing,
  onOpenEnterprise,
}) => {"""
content = re.sub(props_pattern, new_props, content, flags=re.DOTALL)

buttons_pattern = r'<button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Plans & Pricing</button>\s*<button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Enterprise</button>'
new_buttons = """<button onClick={onOpenPricing} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Plans & Pricing</button>
          <button onClick={onOpenEnterprise} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Enterprise</button>"""
content = re.sub(buttons_pattern, new_buttons, content)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
print("Updated Header.tsx")
