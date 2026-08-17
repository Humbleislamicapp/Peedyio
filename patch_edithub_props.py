import re

with open('src/components/EditHub.tsx', 'r') as f:
    content = f.read()

interface_pattern = r'interface EditHubProps \{.*?\n\}'
new_interface = """interface EditHubProps {
  title?: string;
  description?: string;
  icon?: any;
  iconBg?: string;
  recentDocuments: PDFDocumentModel[];
  onOpenDocument: (doc: PDFDocumentModel) => void;
  onFileUpload: (files: FileList | null) => void;
  onNewBlankDocument?: () => void;
}"""
content = re.sub(interface_pattern, new_interface, content, flags=re.DOTALL)

props_pattern = r'export const EditHub: React\.FC<EditHubProps> = \(\{.*?\}\) => \{'
new_props = """export const EditHub: React.FC<EditHubProps> = ({
  title = '{title}',
  description = '{description}',
  icon: Icon = Edit3,
  iconBg = 'bg-blue-100 text-blue-600',
  recentDocuments,
  onOpenDocument,
  onFileUpload,
  onNewBlankDocument,
}) => {"""
content = re.sub(props_pattern, new_props, content, flags=re.DOTALL)

# Add Blank PDF button next to Browse Computer
button_pattern = r'<label className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95">\s*<span>Browse Computer</span>\s*<input.*?</label>'
new_buttons = """<div className="mt-2 flex items-center justify-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95">
              <span>Browse Computer</span>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.docx"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
              />
            </label>
            {onNewBlankDocument && (
              <button
                onClick={onNewBlankDocument}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <span>Start Blank</span>
              </button>
            )}
          </div>"""
content = re.sub(button_pattern, new_buttons, content, flags=re.DOTALL)

with open('src/components/EditHub.tsx', 'w') as f:
    f.write(content)
print("Updated EditHub.tsx")
