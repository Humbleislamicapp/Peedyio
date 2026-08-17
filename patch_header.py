import re

with open('src/components/Header.tsx', 'r') as f:
    code = f.read()

import_old = "import { ViewMode } from '../types/pdf';"
import_new = """import { ViewMode } from '../types/pdf';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';"""

code = code.replace(import_old, import_new)

# Add hooks
header_top = """export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onFileUpload,
  onNewBlankDoc,
  onToggleMobileSidebar,
  searchQuery = '',
  onSearchChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);"""

header_new = """export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onFileUpload,
  onNewBlankDoc,
  onToggleMobileSidebar,
  searchQuery = '',
  onSearchChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, usageLimit, signInWithGoogle, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);"""

code = code.replace(header_top, header_new)

# Avatar
avatar_old = """        {/* Avatar Profile */}
        <div
          className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all"
          title="User Workspace"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>"""

avatar_new = """        {/* Auth / Avatar Profile */}
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

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>"""

code = code.replace(avatar_old, avatar_new)

with open('src/components/Header.tsx', 'w') as f:
    f.write(code)

