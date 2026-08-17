code = """import React, { useState } from 'react';
import {
  Home,
  FolderOpen,
  Sparkles,
  Edit3,
  MessageSquare,
  FormInput,
  PenTool,
  Wrench,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ViewMode } from '../types/pdf';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  storageUsedPercent?: number;
  storageUsedFormatted?: string;
  totalDocsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  storageUsedPercent = 42,
  storageUsedFormatted = '18.4 MB',
  totalDocsCount = 4,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: Home },
    { id: 'library' as ViewMode, label: 'My Documents', icon: FolderOpen, badge: totalDocsCount > 0 ? String(totalDocsCount) : undefined },
    { id: 'ask_peedy' as ViewMode, label: 'Ask Peedy', icon: Sparkles, badge: 'AI' },
  ];

  const toolsItems = [
    { id: 'edit_hub' as ViewMode, label: 'Edit', icon: Edit3 },
    { id: 'review_hub' as ViewMode, label: 'Review', icon: MessageSquare },
    { id: 'fill_hub' as ViewMode, label: 'Fill', icon: FormInput },
    { id: 'sign_hub' as ViewMode, label: 'Sign', icon: PenTool },
  ];

  const handleItemClick = (view: ViewMode) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  };

  const isToolActive = toolsItems.some(t => t.id === currentView);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0 tracking-tighter">
            P
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-slate-900">Peedy<span className="text-blue-600">.io</span></span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Pro
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-200/70 text-blue-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Tools Flyout/Accordion */}
            <div>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isToolActive || isToolsOpen
                    ? 'bg-slate-50 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench
                    className={`w-5 h-5 ${
                      isToolActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>Tools</span>
                </div>
                {isToolsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isToolsOpen && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                  {toolsItems.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = currentView === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleItemClick(tool.id)}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Storage Widget at Bottom */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-600">Storage: {storageUsedPercent}% used</span>
              <span className="text-[10px] text-slate-400">{storageUsedFormatted}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(5, storageUsedPercent))}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <span>⚡ 100% In-browser storage</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
"""
with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(code)
