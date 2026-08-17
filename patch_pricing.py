with open('src/components/modals/PricingModal.tsx', 'r') as f:
    content = f.read()

import re

# Update max width
content = content.replace("max-w-4xl", "max-w-6xl")

new_grid = """          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Free */}
            <div className="border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col">
              <h4 className="text-xl font-bold text-slate-800">Try Peedy</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 h-8">For casual users who want to edit and understand documents.</p>
              <div className="mt-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-slate-900">$0</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'PDF viewing & basic editing',
                  'Text, shapes & highlights',
                  'Basic forms & signing',
                  'Comments & review',
                  'Export & download',
                  '10 AI actions/month',
                  '10 documents/month',
                  '3 signatures/month'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors text-sm">
                Current Plan
              </button>
            </div>

            {/* Pro */}
            <div className="border-2 border-blue-500 rounded-2xl p-5 md:p-6 flex flex-col relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <h4 className="text-xl font-bold text-blue-600">Peedy Pro</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 h-8">For individuals who use documents regularly.</p>
              <div className="mt-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-slate-900">$12</span>
                <span className="text-slate-500 font-medium text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-[10px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">Everything in Free, plus:</li>
                {[
                  'Unlimited editing & documents',
                  'Full AI assistant (summarise, extract, rewrite)',
                  'OCR & accessibility check',
                  'Unlimited comments & signing',
                  'Signature templates',
                  'No branding & priority processing',
                  'Cloud storage'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm text-sm">
                Upgrade to Pro
              </button>
            </div>

            {/* Teams */}
            <div className="border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col">
              <h4 className="text-xl font-bold text-slate-800">Peedy Teams</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 h-8">For small businesses, agencies, and teams.</p>
              <div className="mt-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-slate-900">$20</span>
                <span className="text-slate-500 font-medium text-sm">/user/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-[10px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">Everything in Pro, plus:</li>
                {[
                  'Shared document workspace',
                  'Team folders & templates',
                  'Team comments & approval workflows',
                  'Send for signing & tracking',
                  'Team member & admin controls',
                  'Centralised billing & analytics',
                  'Larger AI allowance & org branding'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600">
                    <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs text-sm">
                Start Team Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col bg-slate-50">
              <h4 className="text-xl font-bold text-slate-800">Enterprise</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 h-8">For larger organisations with specific needs.</p>
              <div className="mt-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-[10px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">Everything in Teams, plus:</li>
                {[
                  'SSO, advanced permissions & audit logs',
                  'Enterprise security & data retention',
                  'Custom AI policies',
                  'API & integrations',
                  'Volume signing & custom storage',
                  'Dedicated support & SLA'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => { onClose(); onEnterpriseClick(); }} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors shadow-sm text-sm">
                Contact Sales
              </button>
            </div>
          </div>"""

start_str = "          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">"
end_str = "        </div>\n      </div>\n    </div>"
start_idx = content.find(start_str)
end_idx = content.find(end_str)

content = content[:start_idx] + new_grid + "\n" + content[end_idx:]

with open('src/components/modals/PricingModal.tsx', 'w') as f:
    f.write(content)
print("Updated Pricing Modal")
