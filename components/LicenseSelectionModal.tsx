import React from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product, LicenseTier } from '../types';

export const LICENSE_TIERS = {
  basic: {
    name: 'Basic Lease',
    price: 10000,
    features: ['100,000 Streams', 'MP3 File', 'Non-Exclusive', 'Sell to multiple artists'],
    color: 'slate',
  },
  premium: {
    name: 'Premium Lease',
    price: 25000,
    features: ['500,000 Streams', 'WAV + MP3', 'Radio Broadcasting', 'Non-Exclusive'],
    color: 'brand',
  },
  unlimited: {
    name: 'Unlimited Lease',
    price: 50000,
    features: ['Unlimited Streams', 'Track Stems', 'Unlimited Broadcasting', 'Non-Exclusive'],
    color: 'accent',
  },
  exclusive: {
    name: 'Exclusive',
    price: 250000,
    features: ['Full Commercial Rights', 'Removed from store', 'Unlimited Everything', '100% Ownership'],
    color: 'emerald',
  }
};

interface LicenseSelectionModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectLicense: (product: Product, tier: LicenseTier, price: number) => void;
}

const LicenseSelectionModal: React.FC<LicenseSelectionModalProps> = ({ product, isOpen, onClose, onSelectLicense }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-5xl rounded-[40px] border border-white/10 p-8 relative overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Select License</h2>
            <p className="text-sm text-slate-400 mt-1">Choose how you want to use "{product.title}"</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.entries(LICENSE_TIERS) as [LicenseTier, any][]).map(([tierKey, tierInfo]) => (
            <div key={tierKey} className="glass border border-white/5 rounded-3xl p-6 flex flex-col relative group hover:border-white/20 transition-all hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">{tierInfo.name}</h3>
                <p className="text-2xl font-black text-white mt-2">₦{tierInfo.price.toLocaleString()}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tierInfo.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 font-medium">
                    <CheckCircle2 size={16} className={`text-${tierInfo.color}-400 shrink-0 mt-0.5`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelectLicense(product, tierKey, tierInfo.price)}
                className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest text-xs transition-all shadow-xl
                  ${tierKey === 'premium' ? 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/30' : 
                    tierKey === 'exclusive' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' :
                    'bg-slate-800 hover:bg-slate-700 shadow-slate-900/50'
                  }`}
              >
                Select
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-4">
            <ShieldCheck className="text-slate-500 shrink-0" />
            <p className="text-xs text-slate-500 font-medium">All licenses come with an official Beat License Agreement. By purchasing, you agree to the terms which will be provided at checkout. High-quality files will be immediately available for download after successful payment.</p>
        </div>
      </div>
    </div>
  );
};

export default LicenseSelectionModal;
