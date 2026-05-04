import React from 'react';
import { X, FileText } from 'lucide-react';
import { CartItem } from '../types';

interface LicenseAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
}

const LicenseAgreementModal: React.FC<LicenseAgreementModalProps> = ({ isOpen, onClose, items, customerName, customerEmail }) => {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-3xl rounded-[32px] border border-white/10 p-8 relative overflow-hidden animate-in fade-in zoom-in duration-300 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-600/20 rounded-xl text-brand-500">
                <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Beat License Agreement</h2>
              <p className="text-xs text-slate-400 mt-1">Please review the terms for your selected beats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-8 text-slate-300 text-sm leading-relaxed custom-scrollbar">
            {items.filter(item => item.type === 'beat' && item.licenseType !== 'none').map((item, index) => (
                <div key={item.id + index} className="p-6 border border-white/10 rounded-2xl bg-slate-950/50 space-y-6">
                    <div className="text-center pb-6 border-b border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{item.title}</h3>
                        <p className="text-xs text-brand-400 font-bold uppercase tracking-widest mt-2">{item.licenseType} LICENSE</p>
                    </div>

                    <div className="space-y-4">
                        <p>This Beat License Agreement ("Agreement") is made on <strong>{today}</strong> between:</p>
                        <p><strong>Producer:</strong> TizzyBeatz<br /><strong>Email:</strong> contact@tizzybeatz.com</p>
                        <p>AND</p>
                        <p><strong>Licensee (Buyer):</strong> {customerName || "[CUSTOMER NAME]"}<br /><strong>Email:</strong> {customerEmail || "[CUSTOMER EMAIL]"}</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">1. Grant of License</h4>
                        <p>Producer grants Licensee a <strong>{item.licenseType === 'exclusive' ? 'Exclusive' : 'Non-Exclusive'} license</strong> to use the musical composition titled <strong>"{item.title}"</strong> ("Beat").</p>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">2. Ownership</h4>
                        <p>Producer retains <strong>100% ownership</strong> of the Beat unless an Exclusive License is purchased.</p>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">3. Permitted Use</h4>
                        <p>Licensee is allowed to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Record vocals over the Beat</li>
                            <li>Distribute the song on streaming platforms (Spotify, Apple Music, etc.)</li>
                            <li>Perform the song live</li>
                            <li>Monetize via YouTube, streaming, and sales</li>
                        </ul>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">4. Restrictions</h4>
                        <p>Licensee may NOT:</p>
                        <ul className="list-disc pl-5 space-y-1 text-red-400/80">
                            <li>Resell, lease, or give away the Beat as-is</li>
                            <li>Claim ownership of the Beat</li>
                            <li>Use the Beat for unlawful or defamatory content</li>
                        </ul>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">5. Credit Requirement</h4>
                        <p>Licensee must credit Producer as: <strong>"Produced by TizzyBeatz"</strong></p>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">6. License Type: {item.licenseType.toUpperCase()}</h4>
                        {item.licenseType === 'basic' && (
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Beat can be sold to multiple artists</li>
                                <li>Streaming limit: 100,000 streams</li>
                                <li>Valid for: 5 years</li>
                                <li>Price: ₦{item.agreedPrice}</li>
                            </ul>
                        )}
                        {item.licenseType === 'premium' && (
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Beat can be sold to multiple artists</li>
                                <li>Streaming limit: 500,000 streams</li>
                                <li>Valid for: 5 years</li>
                                <li>Price: ₦{item.agreedPrice}</li>
                            </ul>
                        )}
                        {item.licenseType === 'unlimited' && (
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Beat can be sold to multiple artists</li>
                                <li>Streaming limit: Unlimited</li>
                                <li>Valid for: Lifetime</li>
                                <li>Price: ₦{item.agreedPrice}</li>
                            </ul>
                        )}
                        {item.licenseType === 'exclusive' && (
                            <ul className="list-disc pl-5 space-y-1 text-emerald-400">
                                <li>Buyer gets full commercial rights</li>
                                <li>Beat is removed from store after purchase</li>
                                <li>No stream limits</li>
                                <li>Price: ₦{item.agreedPrice}</li>
                            </ul>
                        )}

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">7. Payment</h4>
                        <p>License becomes valid only after full payment is received.</p>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">8. Termination</h4>
                        <p>Violation of this Agreement results in immediate termination of the license.</p>

                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">9. Governing Law</h4>
                        <p>This Agreement shall be governed by the laws of <strong>Nigeria</strong>.</p>
                        
                        <h4 className="text-white font-bold text-lg border-b border-white/5 pb-2">10. Agreement Acceptance</h4>
                        <p>By purchasing or downloading the Beat, Licensee agrees to all terms in this Agreement.</p>
                    </div>
                </div>
            ))}
            
            {items.filter(item => item.type === 'beat' && item.licenseType !== 'none').length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No items in your cart require a license agreement.
                </div>
            )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 shrink-0">
            <button onClick={onClose} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl transition-all uppercase tracking-widest text-sm">
                Close & Return to Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseAgreementModal;
