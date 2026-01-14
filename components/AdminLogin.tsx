import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface AdminLoginProps {
    onLogin: () => void;
    onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === import.meta.env.VITE_ADMIN_PASSCODE) { // Securely stored in env variable
            onLogin();
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/98 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-10 space-y-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border border-white/10 shadow-2xl">
                        <Lock size={32} className="text-brand-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Restricted Access</h2>
                    <p className="text-slate-500 font-medium">Enter secure protocol to access the forge.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Enter Access Key..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-center text-xl font-bold tracking-widest placeholder:text-slate-700 outline-none focus:border-brand-500/50 transition-colors"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest animate-shake">
                            <ShieldAlert size={14} /> Access Denied
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-2xl transition-colors uppercase tracking-widest text-xs"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            Unlock <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
