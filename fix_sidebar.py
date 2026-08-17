with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Let's find the string "/* Authenticated - Pro / Team Tier */"
start_idx = content.find("/* Authenticated - Pro / Team Tier */")

if start_idx != -1:
    content = content[:start_idx] + """/* Authenticated - Pro / Team Tier */
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
        </div>
      </aside>
    </>
  );
};"""

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
