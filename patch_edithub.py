import re

with open('src/components/EditHub.tsx', 'r') as f:
    code = f.read()

props_old = """interface EditHubProps {
  title?: string;
  description?: string;
  recentDocuments: PDFDocumentModel[];"""

props_new = """interface EditHubProps {
  title?: string;
  description?: string;
  icon?: any;
  iconBg?: string;
  recentDocuments: PDFDocumentModel[];"""

code = code.replace(props_old, props_new)

sig_old = """export const EditHub: React.FC<EditHubProps> = ({
  title = '{title}',
  description = '{description}',
  recentDocuments,"""

sig_new = """export const EditHub: React.FC<EditHubProps> = ({
  title = '{title}',
  description = '{description}',
  icon: Icon = Edit3,
  iconBg = 'bg-blue-100 text-blue-600',
  recentDocuments,"""

code = code.replace(sig_old, sig_new)

render_old = """        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
          <Edit3 className="w-8 h-8" />
        </div>"""

render_new = """        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm ${iconBg}`}>
          <Icon className="w-8 h-8" />
        </div>"""

code = code.replace(render_old, render_new)

with open('src/components/EditHub.tsx', 'w') as f:
    f.write(code)

