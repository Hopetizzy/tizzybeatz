import React, { useState, useEffect } from 'react';
import { X, Trash2, ShieldCheck, ShoppingCart, Download } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { CartItem } from '../types';
import { recordTransaction } from '../services/supabase';
import LicenseAgreementModal from './LicenseAgreementModal';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemoveItem: (id: string) => void;
    onClearCart: () => void;
    onDownload: (product: CartItem) => void;
    email: string;
}

// REPLACE THIS WITH YOUR OWN PUBLIC KEY
// You can find this in your Paystack Dashboard -> Settings -> API Keys
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_6e2d61da46a86ff425701f142be5b957fa733693';

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onClearCart, onDownload, email: defaultEmail }) => {
    const [success, setSuccess] = useState(false);
    const [email, setUserEmail] = useState("");
    const [legalName, setLegalName] = useState("");
    const [purchaseHistory, setPurchaseHistory] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    
    // Check if any item needs a license
    const requiresLicense = items.some(item => item.type === 'beat' && item.licenseType && item.licenseType !== 'none');

    // Load purchase history from localStorage
    useEffect(() => {
        const history = localStorage.getItem('beatforge_purchases');
        if (history) {
            try {
                setPurchaseHistory(JSON.parse(history));
            } catch (e) {
                console.error("Failed to parse purchase history", e);
            }
        }
    }, [isOpen]); // Refresh when opened

    const subtotal = items.reduce((acc, item) => acc + item.price, 0);
    const total = subtotal * (1 - discount);

    const applyPromo = () => {
        if (promoCode.toUpperCase() === 'SUMMER25') {
            setDiscount(0.25);
            setPromoMessage('25% Discount Applied!');
        } else {
            setDiscount(0);
            setPromoMessage('Invalid promo code');
        }
    };

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email || "customer@example.com",
        amount: Math.round(total * 100), // Paystack expects amount in kobo (cents)
        currency: 'NGN',
        publicKey: PAYSTACK_PUBLIC_KEY,
    };

    const onSuccess = async (reference: any) => {
        console.log("Paystack Success:", reference);
        const currentItems = [...items]; // Capture items before clear
        setPurchasedItems(currentItems);
        setSuccess(true);

        // Record transaction in Supabase
        const result = await recordTransaction({
            reference: reference.reference,
            email: email,
            amount: total,
            products: currentItems
        });

        if (!result) {
            alert("Transaction successful in Paystack, but failed to save to database. Please run the provided SQL in Supabase SQL Editor to create the 'transactions' table.");
        }

        // Save to LocalStorage History
        const newHistory = [...currentItems, ...purchaseHistory];
        // Remove duplicates by ID just in case
        const uniqueHistory = Array.from(new Map(newHistory.map(item => [item.id, item])).values());

        localStorage.setItem('beatforge_purchases', JSON.stringify(uniqueHistory));
        setPurchaseHistory(uniqueHistory);

        onClearCart(); // Clear the actual cart state
    };

    const onClosePaystack = () => {
        console.log('closed');
    };

    const initializePayment = usePaystackPayment(config);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="text-brand-500" size={24} />
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Your Cart</h2>
                        <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full">{items.length}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 border border-green-500/30">
                                <ShieldCheck size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase">Payment Successful</h3>
                                <p className="text-slate-400 text-sm mt-2">Download your files now.</p>
                                <p className="text-[10px] text-slate-500 mt-1">A receipt has been sent to {email}</p>
                            </div>

                            <div className="w-full space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                {purchasedItems.map(item => (
                                    <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-brand-500/30 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg overflow-hidden">
                                                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-bold text-sm">{item.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-slate-500 text-[10px] uppercase">{item.type}</p>
                                                    {item.licenseType && item.licenseType !== 'none' && (
                                                        <span className="text-[8px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full">
                                                            {item.licenseType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onDownload(item);
                                            }}
                                            className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition shadow-lg shadow-brand-600/20"
                                            title="Download File"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    onClose();
                                }}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                            >
                                Close & Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <ShoppingCart size={48} className="text-slate-600" />
                                    <p className="text-slate-500 font-medium">Your cart is empty.</p>
                                    <button onClick={onClose} className="text-brand-400 text-sm font-bold uppercase tracking-widest hover:underline">Continue Shopping</button>
                                    {/* History Link */}
                                    {purchaseHistory.length > 0 && (
                                        <div className="pt-8 border-t border-white/5 w-full">
                                            <p className="text-xs text-slate-500 mb-4">Looking for previous orders?</p>
                                            <button
                                                onClick={() => {
                                                    setPurchasedItems(purchaseHistory);
                                                    setSuccess(true); // Re-use success view for history
                                                }}
                                                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-full transition"
                                            >
                                                View Purchase History ({purchaseHistory.length})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="group relative bg-white/5 border border-white/5 hover:border-brand-500/30 rounded-2xl p-4 flex items-center gap-4 transition-all">
                                            <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden shrink-0">
                                                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-bold truncate">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-slate-500 text-xs uppercase tracking-wider">{item.type}</p>
                                                    {item.licenseType && item.licenseType !== 'none' && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/20">
                                                            {item.licenseType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-black">₦{item.price}</p>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-slate-600 hover:text-red-400 mt-2 transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && !success && (
                    <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md space-y-4">
                        <div className="space-y-2 pb-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value);
                                        setPromoMessage('');
                                    }}
                                    placeholder="Enter code..."
                                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none uppercase transition"
                                />
                                <button 
                                    onClick={applyPromo}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoMessage && (
                                <p className={`text-[10px] font-bold ml-1 ${discount > 0 ? 'text-brand-400' : 'text-red-400'}`}>{promoMessage}</p>
                            )}
                        </div>

                        {requiresLicense && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name (For License)</label>
                                <input
                                    type="text"
                                    value={legalName}
                                    onChange={(e) => setLegalName(e.target.value)}
                                    placeholder="Enter your full legal name..."
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none transition"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Receipt Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Enter your email..."
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none transition"
                            />
                        </div>

                        <div className="flex items-center justify-between text-slate-400 text-sm pt-2 border-t border-white/5">
                            <span>Subtotal</span>
                            <span>₦{subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center justify-between text-brand-400 text-sm">
                                <span>Discount (25%)</span>
                                <span>-₦{(subtotal - total).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-white text-xl font-black">
                            <span>Total</span>
                            <span>₦{total.toFixed(2)}</span>
                        </div>
                        
                        {requiresLicense && (
                            <div className="pt-2 border-t border-white/5 space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-950/50 border border-white/5 rounded-xl">
                                    <input 
                                        type="checkbox" 
                                        id="terms" 
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 shrink-0 w-4 h-4 rounded border-slate-700 text-brand-500 focus:ring-brand-500/20 bg-slate-900 cursor-pointer"
                                    />
                                    <label htmlFor="terms" className="text-xs text-slate-400 leading-tight cursor-pointer">
                                        I have read and agree to the <button onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-brand-400 hover:text-brand-300 font-bold underline">Beat License Agreement</button>. I understand that checking this box acts as a digital signature.
                                    </label>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (requiresLicense && !legalName.trim()) {
                                    alert("Please enter your legal name for the license agreement.");
                                    return;
                                }
                                if (!email.includes('@')) {
                                    alert("Please enter a valid email address.");
                                    return;
                                }
                                if (requiresLicense && !acceptedTerms) {
                                    alert("You must agree to the License Terms before checking out.");
                                    return;
                                }
                                initializePayment({ onSuccess, onClose: onClosePaystack });
                            }}
                            disabled={requiresLicense && !acceptedTerms}
                            className={`w-full py-4 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest
                                ${requiresLicense && !acceptedTerms 
                                    ? 'bg-slate-700 opacity-50 cursor-not-allowed shadow-none' 
                                    : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/20'}`}
                        >
                            Secure Checkout <ShieldCheck size={18} />
                        </button>
                        <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldCheck size={10} /> Powered by Paystack
                        </p>
                    </div>
                )}
            </div>
            
            <LicenseAgreementModal 
                isOpen={showTermsModal} 
                onClose={() => setShowTermsModal(false)} 
                items={items}
                customerName={legalName || "[CUSTOMER NAME]"}
                customerEmail={email || "[CUSTOMER EMAIL]"}
            />
        </div>
    );
};

export default CartDrawer;
