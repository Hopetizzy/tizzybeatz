import React, { useState, useEffect, useMemo } from 'react';
import {
  Play, Pause, ShoppingCart, Users, ChevronRight, Zap, CheckCircle2,
  Music2, Search, SlidersHorizontal, Hash, X, Flame, Waves, Heart,
  Dna, Headphones, Award, Star, MessageCircle, ArrowRight, Music, Download, Share2
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import UploadZone from '../components/UploadZone';

interface HomeProps {
  products: Product[];
  onPlayTrack: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onDownload: (p: Product) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  onCreateCollab: (req: any) => void;
  searchQuery: string; // Add search prop
}

// ...

// ...

const MusicParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${10 + Math.random() * 20}px`,
      color: i % 2 === 0 ? 'text-brand-500' : 'text-accent-500'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle ${p.color} opacity-40`}
          style={{
            left: p.left,
            bottom: '-10%',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <Music size={p.size} />
        </div>
      ))}
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ products, onPlayTrack, onAddToCart, onDownload, currentTrackId, isPlaying, onCreateCollab, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [demoUrl, setDemoUrl] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.type === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.title,
      text: `Check out "${product.title}" by TizzyBeatz!`,
      url: window.location.href // Ideally this would be a specific product link
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setToast({ message: "Link copied to clipboard!", visible: true });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleAddClick = (product: Product) => {
    onAddToCart(product);
    setToast({ message: `"${product.title}" added to your vault`, visible: true });
  };

  const handleDownloadClick = (product: Product) => {
    onDownload(product);
    setToast({ message: `"${product.title}" download started`, visible: true });
  };

  const handleSubmitCollab = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onCreateCollab({
      senderName: formData.get('name'),
      senderEmail: formData.get('email'),
      projectType: formData.get('projectType'),
      message: formData.get('message'),
      demoUrl: demoUrl
    });
    setIsSuccess(true);
    setTimeout(() => {
      setShowCollabModal(false);
      setIsSuccess(false);
      setDemoUrl('');
    }, 2000);
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast({ ...toast, visible: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const latestProduct = products.length > 0 ? products[0] : null;

  return (
    <div className="space-y-24 pb-32 relative">
      <MusicParticles />

      {/* Crowd Energy Overlays */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-600/10 rounded-full energy-overlay"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full energy-overlay" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* Catchy Musical Notification Toast */}
      {toast.visible && (
        <div className="fixed bottom-32 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="glass px-8 py-5 rounded-[32px] shadow-[0_20px_50px_rgba(217,70,239,0.3)] flex items-center gap-5 border-l-8 border-brand-500 animate-beat relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-50"></div>
            <div className="bg-brand-600 p-3 rounded-2xl text-white shadow-xl relative z-10">
              <ShoppingCart size={24} className="animate-pulse" />
            </div>
            <div className="relative z-10">
              <p className="text-base font-black text-white uppercase tracking-tight">{toast.message}</p>
              <p className="text-[10px] text-brand-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <Music size={12} /> SECURED IN CRATE
              </p>
            </div>
            <button onClick={() => setToast({ ...toast, visible: false })} className="ml-4 p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10">
              <X size={18} className="text-slate-500 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-2xl">
              <span className={`flex h-2 w-2 rounded-full bg-brand-500 ${isPlaying ? 'animate-ping' : ''}`}></span>
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Live Session: TizzyBeatz Lab Online</span>
            </div>
            <h1 className="text-7xl sm:text-9xl font-black text-white leading-[0.8] tracking-tighter">
              MADE BY <br />
              <span className={`text-transparent text-8xl bg-clip-text bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500 transition-all duration-500 ${isPlaying ? 'brightness-150 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]' : ''}`}>
                HOPE TIZZY.
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              Don't settle for generic presets. Access the private stash of a platinum architect. Every hit starts with a single high-fidelity spark.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-brand-600/40 text-sm uppercase tracking-widest flex items-center gap-3 active:scale-95 group"
              >
                Enter The Vault <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => setShowCollabModal(true)}
                className="px-10 py-5 bg-slate-900/50 hover:bg-slate-800 glass text-white font-black rounded-2xl transition-all flex items-center gap-3 text-sm uppercase tracking-widest group border border-white/5"
              >
                <MessageCircle size={20} className="text-brand-400 group-hover:rotate-12 transition-transform" /> Initiate Collab
              </button>
            </div>

            {/* QUICK STATS - Added to fill space */}
            <div className="pt-8 flex items-center gap-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-black text-white">200+</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Assets</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Instant Delivery</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
            <div className={`absolute inset-0 bg-brand-500/20 blur-[120px] rounded-full transition-all duration-500 ${isPlaying ? 'scale-125 opacity-100' : 'opacity-40'}`}></div>
            <div className={`relative aspect-square rounded-[60px] overflow-hidden border border-white/10 glass p-4 shadow-3xl group ${isPlaying ? 'animate-beat' : 'animate-float'}`}>
              <img
                src={latestProduct ? latestProduct.thumbnailUrl : "/image/tizzybeatz.jpg"}
                className="w-full h-full object-cover rounded-[48px] grayscale transition duration-700 group-hover:grayscale-0"
                alt="Studio vibe"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-pink-500/10 mix-blend-overlay"></div>
              <div className="absolute inset-x-8 bottom-8 p-6 glass rounded-3xl border border-white/10 flex items-center justify-between backdrop-blur-md">
                <div>
                  <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Latest Drop</p>
                  <p className="text-lg font-black text-white italic">"{latestProduct ? latestProduct.title : "Neon Horizon Pack"}"</p>
                </div>
                <div className="bg-accent-400/20 p-3 rounded-2xl border border-accent-400/20">
                  <Award className="text-accent-400" size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Meet - THE PRODUCER */}
      <section className="relative glass rounded-[48px] p-12 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 blur-[100px] animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-64 h-64">
              <div className="absolute inset-[-20px] bg-gradient-to-tr from-brand-600/30 to-pink-500/30 rounded-full animate-spin-slow blur-2xl opacity-50"></div>
              <div className="relative w-full h-full rounded-full border-4 border-slate-900 p-2 overflow-hidden bg-slate-900 shadow-3xl">
                <img
                  src="/image/Hopetizzy.jpg"
                  className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition duration-700"
                  alt="Forge Master"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-600 p-5 rounded-[24px] shadow-2xl border-4 border-slate-950">
                <Star fill="white" size={28} className="text-white animate-pulse" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8 space-y-6 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-400">The Architect</div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">"SOUNDS FOR THOSE WHO <br />DARE TO BE HEARD."</h2>
            <p className="text-slate-400 leading-relaxed text-xl max-w-2xl font-medium">
              I'm <span className="text-white font-black underline decoration-accent-500 decoration-4 underline-offset-8">TizzyBeatz</span>. 2 years deep in the crates, engineering vibes that move the needle. Every pack is curated with one goal: pure sonic dominance.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-8">
              {[
                { label: '50k+', sub: 'Downloads' },
                { label: 'Billboard', sub: 'Placement History' },
                { label: '4.9', sub: 'Star Trust' }
              ].map((s, i) => (
                <div key={i} className="group/stat relative">
                  <p className="text-4xl font-black text-white group-hover:text-pink-500 transition-all duration-300">{s.label}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">{s.sub}</p>
                  <div className="absolute -left-4 top-1 w-1 h-8 bg-brand-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vault Browsing Navigation */}
      <div id="catalog" className="space-y-12 px-4">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-5xl font-black text-white tracking-tighter">THE CATALOG</h3>
              <span className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg text-[10px] font-black border border-brand-500/20">LIVE FEED</span>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Synchronized: {filteredProducts.length} Results Ready
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-2 glass rounded-[30px] border border-white/5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/40 translate-y-[-2px]'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>


      </div>

      {/* Grid - THE SQUAD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-4">
        {filteredProducts.map(product => {
          const isCurrent = currentTrackId === product.id;
          return (
            <div key={product.id} className="neo-brutalism-card group flex flex-col">
              <div className="relative aspect-[3/4] rounded-[56px] overflow-hidden mb-8 bg-slate-900 border border-white/10 shadow-3xl">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition duration-1000 group-hover:scale-110"
                />

                {/* Immersive Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-60 transition-all duration-700"></div>

                {/* Visualizer Overlay - Lifted slightly to avoid text collision */}
                <div className="absolute inset-0 pb-20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[4px] bg-brand-900/10 z-20">
                  <button
                    onClick={() => onPlayTrack(product)}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_60px_rgba(255,255,255,0.4)] transform scale-75 group-hover:scale-100 transition duration-700 hover:bg-brand-600 hover:text-white hover:rotate-12"
                  >
                    {isCurrent && isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                  </button>
                  <p className="mt-4 text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-80">Preview</p>
                </div>

                {/* Tactical Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
                  {product.isFree && (
                    <span className="px-4 py-1.5 bg-pink-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl shadow-xl animate-pulse">FREE DROP</span>
                  )}
                  {product.bpm && (
                    <div className="flex items-center gap-2 px-4 py-1.5 glass text-white text-[9px] font-mono border border-white/10 rounded-xl backdrop-blur-xl">
                      <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-ping"></div>
                      {product.bpm} BPM
                    </div>
                  )}
                </div>

                {/* Share Button (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(product);
                  }}
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-brand-600 backdrop-blur-md border border-white/10 rounded-full text-white transition-all z-30 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-500"
                  title="Share Asset"
                >
                  <Share2 size={18} />
                </button>


                {/* Product Title Static Display - Adjusted size and positioning */}
                <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
                  <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter drop-shadow-2xl leading-tight group-hover:-translate-y-2 transition-transform duration-500 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <Music size={14} className="text-brand-400" />
                    <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">HQ WAV + STEMS</span>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">{product.type.replace('-', ' ')}</span>
                      {product.key && <span className="text-[12px] font-mono text-accent-400">/ {product.key}</span>}
                    </div>
                  </div>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {product.isFree ? <span className="text-emerald-400">GIFT</span> : `₦${product.price}`}
                  </p>
                </div>

                <div className="flex gap-4">
                  {product.isFree ? (
                    <button
                      onClick={() => handleDownloadClick(product)}
                      className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-400 text-white rounded-[28px] transition-all font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 group/btn shadow-2xl active:scale-95"
                    >
                      <Download size={20} className="group-hover/btn:scale-110 group-hover/btn:-translate-y-1 transition-transform" /> Download Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddClick(product)}
                      className="flex-1 py-6 bg-white/5 hover:bg-brand-600 border border-white/10 hover:border-brand-500 text-white rounded-[28px] transition-all font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 group/btn shadow-2xl active:scale-95"
                    >
                      <ShoppingCart size={20} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" /> Take it home
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collaboration - STAGE ENERGY */}
      <section className="relative px-8 py-28 lg:p-36 rounded-[100px] bg-slate-900 border border-white/5 overflow-hidden shadow-3xl group">
        {/* Background Visual Energy */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_70%)] group-hover:scale-125 transition-transform duration-[3000ms]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-5xl space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-brand-600/20 rounded-2xl border border-brand-500/20 backdrop-blur-xl">
            <Zap size={22} className="text-brand-400 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-[0.4em]">COLLABORATION TERMINAL</span>
          </div>
          <h2 className="text-7xl lg:text-9xl font-black text-white leading-[0.8] tracking-tighter">LET'S DROP A <br /><span className="text-brand-500 italic">PLATINUM</span> CUT.</h2>
          <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl">
            Professional scoring, 1-on-1 production, and bespoke sound signatures. I take on 3 projects a month to ensure maximum focus. Secure your slot in the lab.
          </p>
          <button
            onClick={() => setShowCollabModal(true)}
            className="px-16 py-8 bg-brand-600 text-white font-black rounded-[40px] hover:bg-brand-500 transition-all shadow-[0_30px_80px_-20px_rgba(217,70,239,0.6)] text-2xl uppercase tracking-[0.2em] active:scale-95 group/btn"
          >
            Start The Session <ArrowRight size={32} className="inline-block ml-4 group-hover/btn:translate-x-3 transition-transform" />
          </button>
        </div>

        {/* Energy Graphic Overlay */}
        <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-[5000ms]">
          <Music size={800} />
        </div>
      </section>

      {/* Footer - STUDIO BRANDING */}
      <footer className="pt-32 border-t border-white/5 flex flex-col lg:flex-row items-start justify-between gap-24 px-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-600/5 blur-[120px] rounded-full"></div>

        <div className="space-y-8 max-w-lg relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-brand-600 rounded-[32px] shadow-3xl shadow-brand-600/40 animate-beat">
              <Music2 className="text-white" size={40} />
            </div>
            <span className="text-5xl font-black tracking-tighter text-white uppercase italic">TIZZY<span className="text-brand-500">BEATZ</span></span>
          </div>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Every hit begins with a spark. I provide the fuel. Hand-forged assets for modern music architects who refuse to sound ordinary.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-1 bg-brand-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-slate-600 font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} TIZZYBEATZ AUDIO LABS MADE WITH ❤️ BY HOPE TIZZY</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-20 lg:gap-32 relative z-10">
          <div className="space-y-8">
            <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] border-b border-brand-500/50 pb-2 inline-block">THE NETWORK</p>
            <ul className="space-y-6 text-sm font-bold text-slate-500">
              <li><a href="https://www.tiktok.com/@tizzybeat" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 cursor-pointer transition flex items-center gap-3">TikTok <ChevronRight size={14} /></a></li>
              <li><a href="https://www.instagram.com/hope.tizzy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 cursor-pointer transition flex items-center gap-3">Instagram <ChevronRight size={14} /></a></li>
              <li><a href="https://www.youtube.com/@tizzybeatz" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 cursor-pointer transition flex items-center gap-3">YouTube <ChevronRight size={14} /></a></li>
              <li><a href="https://discord.gg/tizzybeatz" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 cursor-pointer transition flex items-center gap-3">Discord <ChevronRight size={14} /></a></li>
            </ul>
          </div>
          <div className="space-y-8">
            <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] border-b border-brand-500/50 pb-2 inline-block">TERMINAL</p>
            <ul className="space-y-6 text-sm font-bold text-slate-500">
              <li className="hover:text-brand-400 cursor-pointer transition">Licensing FAQ</li>
              <li className="hover:text-brand-400 cursor-pointer transition">Usage Rights</li>
              <li className="hover:text-brand-400 cursor-pointer transition">Privacy Protocol</li>
              <li className="hover:text-brand-400 cursor-pointer transition">Support Uplink</li>
            </ul>
          </div>
          <div className="space-y-8 col-span-2 sm:col-span-1">
            <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] border-b border-brand-500/50 pb-2 inline-block">SERVICES</p>
            <ul className="space-y-6 text-sm font-bold text-slate-500">
              <li className="hover:text-brand-400 cursor-pointer transition">Stem Mixing</li>
              <li className="hover:text-brand-400 cursor-pointer transition">Vocal Engineering</li>
              <li className="hover:text-brand-400 cursor-pointer transition">Producer Coaching</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Collab Modal - IMMERSIVE OVERLAY */}
      {showCollabModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/98 backdrop-blur-[40px] overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[40px] sm:rounded-[60px] border border-white/10 p-8 sm:p-12 shadow-[0_0_120px_rgba(99,102,241,0.25)] relative overflow-hidden animate-in fade-in zoom-in duration-500 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-pink-500 to-brand-500 animate-pulse"></div>

            {isSuccess ? (
              <div className="py-24 flex flex-col items-center text-center space-y-10">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 border border-brand-500/20 shadow-3xl animate-beat">
                  <CheckCircle2 size={64} className="sm:w-24 sm:h-24" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter">DATA SECURED</h3>
                  <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-sm mx-auto leading-relaxed">Briefing received. My team will ping your node within 24 hours.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="p-3 sm:p-5 bg-brand-600 rounded-[20px] sm:rounded-[30px] text-white shadow-3xl shadow-brand-600/40">
                      <Users size={24} className="sm:w-10 sm:h-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">INITIATE COLLAB</h2>
                      <p className="text-[9px] sm:text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Establishing Secure Workspace</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCollabModal(false)} className="p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-90">
                    <X size={24} className="sm:w-8 sm:h-8" />
                  </button>
                </div>

                <form onSubmit={handleSubmitCollab} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Operator Alias</label>
                      <input required name="name" type="text" className="w-full bg-slate-950/80 border border-white/5 rounded-[24px] sm:rounded-[32px] px-6 sm:px-8 py-4 sm:py-6 text-slate-100 font-bold focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-slate-700 text-base sm:text-lg" placeholder="John Doe" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Project Mission</label>
                      <select name="projectType" className="w-full bg-slate-950/80 border border-white/5 rounded-[24px] sm:rounded-[32px] px-6 sm:px-8 py-4 sm:py-6 text-slate-100 font-bold focus:ring-4 focus:ring-brand-500/10 outline-none transition-all appearance-none text-base sm:text-lg">
                        <option>Production Session</option>
                        <option>Executive Engineering</option>
                        <option>Sound Signature</option>
                        <option>Artist Consultation</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Email Uplink</label>
                    <input required name="email" type="email" className="w-full bg-slate-950/80 border border-white/5 rounded-[24px] sm:rounded-[32px] px-6 sm:px-8 py-4 sm:py-6 text-slate-100 font-bold focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-slate-700 text-base sm:text-lg" placeholder="artist@node.net" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Creative Directive</label>
                    <textarea required name="message" rows={4} className="w-full bg-slate-950/80 border border-white/5 rounded-[24px] sm:rounded-[32px] px-6 sm:px-8 py-4 sm:py-6 text-slate-100 font-bold focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none placeholder:text-slate-700 text-base sm:text-lg" placeholder="Describe your vision..."></textarea>
                  </div>

                  {/* Demo Upload */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Upload Demo (Optional)</label>
                    <div className="h-32">
                      <UploadZone
                        label="Drop MP3/WAV Demo"
                        accept="audio/*"
                        bucketName="collabs"
                        folderPath="demos"
                        onUploadComplete={(url) => setDemoUrl(url)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 sm:pt-6">
                    <button type="submit" className="w-full py-6 sm:py-8 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-[32px] sm:rounded-[40px] transition-all shadow-3xl shadow-brand-600/50 uppercase tracking-[0.3em] text-base sm:text-lg active:scale-95 group">
                      Initialize Link <ArrowRight size={24} className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
