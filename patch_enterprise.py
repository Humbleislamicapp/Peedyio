with open('src/components/modals/EnterpriseContactModal.tsx', 'r') as f:
    content = f.read()

import re

# We will just rewrite the component to make sure everything is perfect
new_component = """import React, { useState } from 'react';
import { X, Send, CheckCircle, ShieldCheck } from 'lucide-react';

interface EnterpriseContactModalProps {
  onClose: () => void;
}

export const EnterpriseContactModal: React.FC<EnterpriseContactModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">Contact Enterprise Sales</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {submitted ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Thanks — we'll be in touch</h3>
            <p className="text-slate-500">Our enterprise team has received your inquiry and will contact you shortly.</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Upgrade your organisation with enterprise-grade security and control. Get access to <strong>SSO, audit logs, custom API integrations, custom AI policies, dedicated support, and SLAs</strong> tailored to your specific scale.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Name</label>
                  <input required type="text" placeholder="Jane Doe" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
                  <input required type="email" placeholder="jane@company.com" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Name</label>
                  <input required type="text" placeholder="Acme Corp" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Size</label>
                  <select required className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 transition-all">
                    <option value="" disabled selected>Select size</option>
                    <option>10-25</option>
                    <option>25-100</option>
                    <option>100-500</option>
                    <option>500+</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specific Needs (Optional)</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['SSO / SAML', 'API Access', 'Audit Logs', 'Custom Storage'].map((need) => (
                    <label key={need} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      {need}
                    </label>
                  ))}
                </div>
                <textarea rows={3} placeholder="Any other requirements or questions?" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none transition-all"></textarea>
              </div>
              
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                  <Send className="w-4 h-4" />
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
"""

with open('src/components/modals/EnterpriseContactModal.tsx', 'w') as f:
    f.write(new_component)
print("Updated EnterpriseContactModal")
