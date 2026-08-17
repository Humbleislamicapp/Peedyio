import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PricingModalProps {
  onClose: () => void;
  onEnterpriseClick: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onEnterpriseClick }) => {
  const { currentUser, signInWithGoogle } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex flex-col justify-start items-center py-2 sm:py-6">
        <div
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto border border-slate-100 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shadow-2xs">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Plans & Pricing</h2>
              <p className="text-xs text-slate-500 hidden sm:block">Simple, transparent options for individuals and organisations</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <div className="p-5 sm:p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Simple, transparent pricing</h3>
              <p className="text-slate-500 mt-1.5 text-xs sm:text-sm">Start for free, upgrade when you need more power.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="border-2 border-blue-500 rounded-2xl p-5 sm:p-6 flex flex-col relative shadow-lg bg-white ring-4 ring-blue-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap shadow-sm">
                  Get Started
                </div>
                <h4 className="text-xl font-bold text-blue-600">Try Peedy</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4 sm:h-9">For casual users who want to edit and understand documents.</p>
                <div className="mt-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-500 text-xs font-medium ml-1.5">/ forever</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    'PDF viewing, basic page management, basic editing',
                    'Text, shapes, highlights, annotations',
                    'Basic forms/fill, basic signing',
                    'Comments/review',
                    'Export/download',
                    '10 documents/month, ~3 signatures/month'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {currentUser ? (
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors text-sm cursor-pointer"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm text-sm cursor-pointer"
                  >
                    Sign up with Google
                  </button>
                )}
              </div>

              {/* Pro */}
              <div className="border-2 border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col relative bg-white opacity-80">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
                  Coming Soon
                </div>
                <h4 className="text-xl font-bold text-slate-800">Peedy Pro</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4 sm:h-9">For individuals who use documents regularly.</p>
                <div className="mt-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900">$12</span>
                  <span className="text-slate-500 font-medium text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="text-[10px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
                    Everything in Free, plus:
                  </li>
                  {[
                    'Unlimited editing, documents, pages',
                    'OCR, advanced accessibility checking',
                    'Unlimited comments, form filling, personal signing',
                    'Signature templates',
                    'Branding removed, priority processing, cloud storage'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-semibold cursor-not-allowed text-sm"
                >
                  Coming Soon
                </button>
              </div>

              {/* Enterprise */}
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col bg-slate-50/70">
                <h4 className="text-xl font-bold text-slate-800">Enterprise</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4 sm:h-9">For larger organisations with specific needs.</p>
                <div className="mt-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="text-[10px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                    Everything in Pro, plus:
                  </li>
                  {[
                    'SSO, advanced permissions, audit logs',
                    'Enterprise security, data retention controls',
                    'API, integrations, dedicated support',
                    'Volume signing, custom storage, SLA'
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    onClose();
                    onEnterpriseClick();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors shadow-sm text-sm cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

