
import React, { useState, useRef } from 'react';
import { Plus, Trash2, FileAudio, Upload, BarChart3, Users, MessageSquare, Sparkles, Wand2, ImageIcon, Music2, Activity, X, ToggleLeft, ToggleRight } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import { Product, CollaborationRequest, ProductType } from '../types';
import { generateProductDescription, suggestTags } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchRevenueStats } from '../services/supabase';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  collabRequests: CollaborationRequest[];
  onUpdateCollab: (id: string, status: CollaborationRequest['status'], liveLink?: string) => void;
  onSwitchToCollabs: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, onAddProduct, onDeleteProduct, collabRequests, onUpdateCollab, onSwitchToCollabs
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 0, chartData: [] as any[], totalUnits: 0 });

  React.useEffect(() => {
    const loadStats = async () => {
      const stats = await fetchRevenueStats();
      setRevenueStats(stats);
    };
    loadStats();
  }, []);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    type: 'beat',
    price: 0,
    isFree: false,
    tags: [],
    description: '',
    bpm: 140,
    key: 'C min'
  });

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setArtworkPreview(url);
    }
  };

  const handleAiGenerate = async () => {
    if (!newProduct.title) return alert("Enter a title first");
    setAiLoading(true);
    const desc = await generateProductDescription(newProduct.title, newProduct.tags || [], newProduct.type || 'beat');
    const tags = await suggestTags(newProduct.title, desc || '');
    setNewProduct(prev => ({ ...prev, description: desc, tags }));
    setAiLoading(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Product Data:', newProduct);
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProduct.title || 'Untitled',
      type: newProduct.type as ProductType || 'beat',
      price: newProduct.isFree ? 0 : (newProduct.price || 0),
      isFree: newProduct.isFree || false,
      thumbnailUrl: artworkPreview || `https://picsum.photos/seed/${Math.random()}/600/600`,
      audioPreviewUrl: newProduct.audioPreviewUrl || newProduct.fileUrl || '',
      description: newProduct.description || '',
      tags: newProduct.tags || [],
      bpm: newProduct.bpm,
      key: newProduct.key,
      fileUrl: newProduct.fileUrl // [NEW] Add file URL
    };
    onAddProduct(product);
    setIsUploading(false);
    setArtworkPreview(null);
    setNewProduct({ title: '', type: 'beat', price: 0, isFree: false, tags: [], description: '', bpm: 140, key: 'C min', fileUrl: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `₦${revenueStats.totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Units', value: revenueStats.totalUnits, icon: Music2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Active Collabs', value: collabRequests.filter(r => r.status === 'contacted').length, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Pending', value: collabRequests.filter(r => r.status === 'pending').length, icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Activity className="text-indigo-500" size={20} /> Revenue Analytics
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueStats.chartData.length > 0 ? revenueStats.chartData : [{ name: 'No Data', sales: 0 }]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsUploading(true)}
            className="group relative w-full p-8 bg-indigo-600 hover:bg-indigo-500 rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-all shadow-2xl shadow-indigo-600/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus size={32} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg">Create New Content</span>
          </button>
          <button
            onClick={onSwitchToCollabs}
            className="w-full p-8 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 text-white font-bold transition-all"
          >
            <Users size={32} className="text-slate-500" />
            <span className="text-slate-200">Collab Requests</span>
            <span className="text-xs text-slate-500 font-normal">{collabRequests.length} pending items</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Inventory</h3>
          <div className="flex gap-2">
            <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs font-bold text-slate-500">
              {products.length} ITEMS
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800">
                <th className="px-8 py-5">Item Details</th>
                <th className="px-8 py-5">Metadata</th>
                <th className="px-8 py-5">Pricing</th>
                <th className="px-8 py-5 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-indigo-500/[0.02] group transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800">
                        <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 block">{p.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{p.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      {p.bpm && <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">{p.bpm} BPM</span>}
                      {p.key && <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{p.key}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-slate-200 font-bold">
                      {p.isFree ? <span className="text-emerald-400">FREE</span> : `$${p.price.toFixed(2)}`}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-4xl rounded-[40px] border border-slate-800 p-10 shadow-3xl my-8 relative animate-slide-up">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Publish Content</h2>
                <p className="text-slate-500 text-sm">Add your latest masterpiece to the TizzyBeatz marketplace.</p>
              </div>
              <button onClick={() => setIsUploading(false)} className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Artwork & Files */}
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Cover Artwork</label>
                  <div className="h-64">
                    <UploadZone
                      label="Upload Cover Image"
                      accept="image/*"
                      bucketName="products"
                      folderPath="images"
                      onUploadComplete={(url) => {
                        setArtworkPreview(url);
                      }}
                    />
                  </div>
                  {artworkPreview && (
                    <div className="mt-4 relative aspect-square w-full rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                      <img src={artworkPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setArtworkPreview(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-xl backdrop-blur-md transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <UploadZone
                  label="Tagged Preview (MP3)"
                  accept="audio/mpeg,audio/mp3,audio/wav"
                  bucketName="products"
                  folderPath="previews"
                  onUploadComplete={(url, file) => {
                    setNewProduct(prev => ({ ...prev, audioPreviewUrl: url }));
                  }}
                />

                <UploadZone
                  label="Master Audio (WAV/ZIP)"
                  accept="audio/*,application/zip,application/x-zip-compressed"
                  bucketName="products"
                  folderPath="audio"
                  onUploadComplete={(url, file) => {
                    setNewProduct(prev => ({ ...prev, fileUrl: url }));
                    // If no preview set yet and this is audio, use it as preview too
                    if (file.type.startsWith('audio/')) {
                      setNewProduct(prev => ({
                        ...prev,
                        fileUrl: url,
                        audioPreviewUrl: prev.audioPreviewUrl || url
                      }));
                    }
                  }}
                />
              </div>

              {/* Right Column: Meta Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Product Title</label>
                    <input
                      required
                      value={newProduct.title}
                      onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. Chrome Hearts Trap"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Category</label>
                    <select
                      value={newProduct.type}
                      onChange={e => setNewProduct({ ...newProduct, type: e.target.value as ProductType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="beat">Beat</option>
                      <option value="sample-pack">Sample Pack</option>
                      <option value="midi-pack">MIDI Pack</option>
                      <option value="song">Song</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pricing Model</label>
                      <button
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, isFree: !newProduct.isFree })}
                        className="flex items-center gap-2 text-xs font-bold text-indigo-400"
                      >
                        {newProduct.isFree ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft size={24} />}
                        {newProduct.isFree ? 'FREE' : 'PAID'}
                      </button>
                    </div>
                    {!newProduct.isFree && (
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        placeholder="Price ($)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 animate-in fade-in slide-in-from-top-1"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Tempo (BPM)</label>
                    <input
                      type="number"
                      value={newProduct.bpm}
                      onChange={e => setNewProduct({ ...newProduct, bpm: parseInt(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Musical Key</label>
                    <input
                      type="text"
                      value={newProduct.key}
                      onChange={e => setNewProduct({ ...newProduct, key: e.target.value })}
                      placeholder="e.g. G# Maj"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Story / Description</label>
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={aiLoading}
                      className="flex items-center gap-2 text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 uppercase tracking-wider"
                    >
                      <Sparkles size={14} /> {aiLoading ? 'Crafting...' : 'AI Enhance'}
                    </button>
                  </div>
                  <textarea
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="Describe the mood, instruments, and energy..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploading(false)}
                    className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all text-lg uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 text-lg uppercase tracking-widest">
                    Publish Assets
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
