import React, { useRef } from 'react';
import {
  Search,
  Plus,
  Upload,
  Menu,
  ShieldCheck,
  Sparkles,
  Home,
  FolderOpen
} from 'lucide-react';
import { ViewMode } from '../types/pdf';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User as UserIcon, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onFileUpload: (files: FileList | null) => void;
  onToggleMobileSidebar?: () => void;
  onOpenPricing?: () => void;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onFileUpload,
  onToggleMobileSidebar,
  onOpenPricing,
  onOpenFeedback,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, usageLimit, signInWithGoogle, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30 relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.docx"
        className="hidden"
        onChange={(e) => onFileUpload(e.target.files)}
      />

      {/* Left: Brand & Main Navigation */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer relative z-10"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <img 
            src="https://hallaimages.s3.us-east-2.amazonaws.com/peedylogo.png" 
            alt="Peedy.io" 
            className="h-10 w-auto object-contain cursor-pointer ml-3 lg:ml-2" 
            onClick={() => onNavigate('dashboard')}
          />
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
            }`}
          >
            <Home className={`w-4 h-4 ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`} />
            Home
          </button>
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              currentView === 'library'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
            }`}
          >
            <FolderOpen className={`w-4 h-4 ${currentView === 'library' ? 'text-blue-600' : 'text-slate-400'}`} />
            Documents
          </button>
        </nav>
      </div>

      {/* Right: Actions, Plans, Bell & Avatar */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <div className="hidden lg:flex items-center mr-2">
          <button onClick={onOpenPricing} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-50">Plans & Pricing</button>
        </div>

        {/* Processed Locally Pill */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-600 font-medium uppercase tracking-wider border border-slate-200"
          title="All files processed 100% inside your browser"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Local Engine</span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1" />

        {/* Auth / Avatar Profile */}
        <div className="relative">
          {currentUser ? (
            <>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none"
                title="User Workspace"
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-600">Free Tier Limits</span>
                      <span className="text-xs font-bold text-slate-800">{usageLimit?.exportsCount || 0} / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(((usageLimit?.exportsCount || 0) / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Exports reset daily</p>
                  </div>

                  <div className="py-1 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onOpenFeedback?.();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      Contact us
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => onOpenPricing()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
