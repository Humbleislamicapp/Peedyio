import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_sidebar = """        <Sidebar
          currentView={activeView}
          onNavigate={(view) => setActiveView(view)}
          storageUsedPercent={storagePercent}
          storageUsedFormatted={formatBytes(totalStorageBytes)}
          totalDocsCount={documents.length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />"""

new_sidebar = """        <Sidebar
          currentView={activeView}
          onNavigate={(view) => setActiveView(view)}
          storageUsedPercent={storagePercent}
          storageUsedFormatted={formatBytes(totalStorageBytes)}
          totalDocsCount={documents.length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenPricing={() => setShowPricing(true)}
        />"""

content = content.replace(old_sidebar, new_sidebar)

with open('src/App.tsx', 'w') as f:
    f.write(content)
