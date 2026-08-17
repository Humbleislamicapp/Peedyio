import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Imports
if 'PricingModal' not in content:
    content = content.replace("import { ExportModal } from './components/modals/ExportModal';", "import { ExportModal } from './components/modals/ExportModal';\nimport { PricingModal } from './components/modals/PricingModal';\nimport { EnterpriseContactModal } from './components/modals/EnterpriseContactModal';")

# State
state_pattern = r'const \[isMobileSidebarOpen, setIsMobileSidebarOpen\] = useState\(false\);'
new_state = """const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showEnterpriseContact, setShowEnterpriseContact] = useState(false);"""
content = re.sub(state_pattern, new_state, content)

# Update Header props in render
header_pattern = r'<Header\s+currentView={activeView}\s+onNavigate={\(view\) => setActiveView\(view\)}\s+onNewBlankDoc={handleCreateBlankDocument}\s+onFileUpload={handleFileUpload}\s+onToggleMobileSidebar={\(\) => setIsMobileSidebarOpen\(!isMobileSidebarOpen\)}\s+searchQuery={searchQuery}\s+onSearchChange={setSearchQuery}\s+/>'
new_header = """<Header
            currentView={activeView}
            onNavigate={(view) => setActiveView(view)}
            onFileUpload={handleFileUpload}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onOpenPricing={() => setShowPricing(true)}
            onOpenEnterprise={() => setShowEnterpriseContact(true)}
          />"""
# Notice: search & new blank document are removed.
content = re.sub(header_pattern, new_header, content)

# Modals
export_modal_pattern = r'\{\(exportTargetDocument \|\| currentDocument\) && \(\s*<ExportModal.*?</ExportModal>\s*\)\}'
new_modals = """{(exportTargetDocument || currentDocument) && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => {
            setIsExportOpen(false);
            setExportTargetDocument(null);
          }}
          doc={exportTargetDocument || currentDocument!}
        />
      )}
      
      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)} 
          onEnterpriseClick={() => {
            setShowPricing(false);
            setShowEnterpriseContact(true);
          }}
        />
      )}
      
      {showEnterpriseContact && (
        <EnterpriseContactModal 
          onClose={() => setShowEnterpriseContact(false)}
        />
      )}"""
content = re.sub(export_modal_pattern, new_modals, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx")
