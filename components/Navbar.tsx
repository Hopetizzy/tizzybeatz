
import React from 'react';
import { ShoppingCart, Search, User, Music, LayoutDashboard, Command } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onToggleCart: () => void;
  cartCount: number;
  hasNotification?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onToggleAdmin, onToggleCart, cartCount, hasNotification, searchQuery, onSearchChange }) => {
  return (
    <nav className="sticky top-6 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto glass rounded-[28px] border border-white/10 shadow-2xl px-6 py-3">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-brand-600 rounded-xl group-hover:rotate-12 transition shadow-lg shadow-brand-600/40">
              <Music className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">Tizzy<span className="text-brand-500">Beatz</span></span>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-12">
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery || ''} 
                onChange={(e) => {
                  console.log("Search input changed:", e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="Search the laboratory..."
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-2.5 pl-11 pr-12 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-slate-950/80 transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black text-slate-500">
                <Command size={10} /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {isAdmin && (
              <button
                onClick={onToggleAdmin}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-brand-600 text-white shadow-xl shadow-brand-600/30"
              >
                <LayoutDashboard size={14} />
                Forge Admin
                {hasNotification && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
                )}
              </button>
            )}

            <button onClick={onToggleCart} className="relative text-slate-400 hover:text-white transition p-2">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-500 text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Removed User Profile Button */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
