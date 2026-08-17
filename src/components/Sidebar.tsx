import React, { useState } from 'react';
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
  ChevronDown,
  Layers,
  Scissors,
  Copy,
  ArrowLeftRight,
  Minimize2,
  GitCompare,
  ScanText,
  Lock,
  CreditCard,
  Building2
} from 'lucide-react';
import { ViewMode } from '../types/pdf';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  storageUsedPercent?: number;
  storageUsedFormatted?: string;
  totalDocsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenPricing?: () => void;
  onOpenFeedback?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  storageUsedPercent = 42,
  storageUsedFormatted = '18.4 MB',
  totalDocsCount = 4,
  isMobileOpen = false,
  onCloseMobile,
  onOpenPricing,
  onOpenFeedback,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { currentUser, usageLimit } = useAuth();

    const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: Home },
    { id: 'library' as ViewMode, label: 'Documents', icon: FolderOpen },
  ];

  

  const handleItemClick = (view: ViewMode) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  };

  
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
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white flex flex-col transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center mb-2">
          <img src="https://hallaimages.s3.us-east-2.amazonaws.com/peedylogo.png" alt="Peedy.io" className="h-8 w-auto object-contain" />
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
                  {('badge' in item && item.badge) && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-200/70 text-blue-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge === "PRO" ? <span className="flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> PRO</span> : (item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}

            </nav>
        </div>

        {/* Storage / Usage Widget at Bottom */}
        <div className="p-4 mt-auto border-t border-slate-100">
          {/* Mobile Actions: Pricing & Contact */}
          <div className="lg:hidden flex flex-col gap-2 mb-3">
            <button
              onClick={() => {
                onCloseMobile?.();
                onOpenPricing?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Plans & Pricing</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {!currentUser ? (
            /* Guest (no account) */
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-600">{storageUsedPercent || 0}% used</span>
                <span className="text-[10px] text-slate-400">{storageUsedFormatted || '0 B'} of 50 MB</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, storageUsedPercent || 0))}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <span>⚡ 100% In-browser storage</span>
              </p>
              {(storageUsedPercent || 0) > 80 && (
                <p className="mt-2 text-[10px] text-blue-600 font-medium">
                  Sign in to sync documents & unlock AI.
                </p>
              )}
            </div>
          ) : usageLimit?.tier === 'free' ? (
            /* Authenticated - Free Tier */
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-600">Free Tier Usage</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-500">AI Actions</span>
                    <span className="text-[10px] font-medium text-slate-700">{usageLimit.aiActionsCount || 0} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${(usageLimit.aiActionsCount || 0) >= 5 ? 'bg-rose-500' : 'bg-slate-400'}`}
                      style={{ width: `${Math.min(100, ((usageLimit.aiActionsCount || 0) / 5) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-500">Documents</span>
                    <span className="text-[10px] font-medium text-slate-700">{usageLimit.documentsCount || 0} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${(usageLimit.documentsCount || 0) >= 5 ? 'bg-rose-500' : 'bg-slate-400'}`}
                      style={{ width: `${Math.min(100, ((usageLimit.documentsCount || 0) / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {((usageLimit.aiActionsCount || 0) >= 5 || (usageLimit.documentsCount || 0) >= 5) && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-[10px] text-slate-600 mb-2">
                    You've hit your monthly free limit.
                  </p>
                  <button onClick={onOpenPricing} className="w-full py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Authenticated - Pro / Team Tier */
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{usageLimit?.tier || 'Pro'} Plan</span>
                  <span className="text-[9px] text-slate-500 font-medium">Unlimited limits</span>
                </div>
              </div>
              <button onClick={onOpenPricing} className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                Manage
              </button>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={onOpenFeedback}
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact us</span>
            </button>
            <span>v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};