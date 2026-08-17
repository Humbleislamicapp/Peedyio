import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Add useAuth import
if 'useAuth' not in content:
    content = content.replace("import { ViewMode } from '../types/pdf';", "import { ViewMode } from '../types/pdf';\nimport { useAuth } from '../contexts/AuthContext';")

# Add onOpenPricing to props
if 'onOpenPricing?: () => void;' not in content:
    content = content.replace("  onCloseMobile?: () => void;\n}", "  onCloseMobile?: () => void;\n  onOpenPricing?: () => void;\n}")
    
    # And add it to the destructuring
    content = content.replace("  onCloseMobile,\n}) => {", "  onCloseMobile,\n  onOpenPricing,\n}) => {")

# Get useAuth inside the component
if 'const { currentUser, usageLimit } = useAuth();' not in content:
    content = content.replace("  const [isToolsOpen, setIsToolsOpen] = useState(false);", "  const [isToolsOpen, setIsToolsOpen] = useState(false);\n  const { currentUser, usageLimit } = useAuth();")

# Build the new widget
new_widget = """        {/* Storage / Usage Widget at Bottom */}
        <div className="p-4 mt-auto border-t border-slate-100">
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
        </div>"""

# Find and replace the old widget
start_str = "        {/* Storage Widget at Bottom */}"
end_str = "        </div>\n      </aside>"

start_idx = content.find(start_str)
if start_idx != -1:
    end_idx = content.find(end_str, start_idx)
    content = content[:start_idx] + new_widget + content[end_idx:]

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
print("Updated Sidebar Widget")
