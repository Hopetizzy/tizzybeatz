
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import CartDrawer from './components/CartDrawer';
import Home from './views/Home';
import AdminDashboard from './views/AdminDashboard';
import CollaborationHub from './views/CollaborationHub';
import AdminLogin from './components/AdminLogin';
import { Product, CollaborationRequest, CollabMessage, CartItem, ProjectFile, ProductType } from './types';
import { supabase, createCollaboration, fetchCollaborations, updateCollaborationStatus } from './services/supabase';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collabRequests, setCollabRequests] = useState<CollaborationRequest[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Product | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'collab'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCollabs();

    // Check for admin URL parameter with debugging
    const searchParams = window.location.search;
    console.log("Current URL Search Params:", searchParams);

    const params = new URLSearchParams(searchParams);
    const adminParam = params.get('admin');
    console.log("Admin Param Value:", adminParam);

    if (adminParam && adminParam.toLowerCase() === 'true') {
      console.log("Enabling Admin Login Modal");
      setShowAdminLogin(true);
    }
  }, []);

  // Poll for new collabs if admin
  useEffect(() => {
    if (isAdmin) {
      fetchCollabs();
      const interval = setInterval(fetchCollabs, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data) {
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type as ProductType,
          price: Number(item.price) || 0,
          isFree: item.is_free,
          audioPreviewUrl: item.audio_preview_url || '',
          thumbnailUrl: item.thumbnail_url || '',
          description: item.description || '',
          tags: item.tags || [],
          bpm: item.bpm ? Number(item.bpm) : undefined,
          key: item.key || undefined,
          fileUrl: item.file_url || undefined
        }));
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
    }
  };

  const fetchCollabs = async () => {
    const data = await fetchCollaborations();
    // Transform to match local type if needed, but service already maps it.
    // The service returns CollaborationRequest structure mostly,
    // but check if 'files' and 'chat' are missing.
    // The simplified service returns simplified objects.
    // We map them to the UI structure.
    const mapped: CollaborationRequest[] = data.map(d => ({
      ...d,
      files: [], // Files not supported in simple mode yet or loaded differently
      chat: [{ sender: 'user', text: d.message, timestamp: d.createdAt }] // Use message as initial chat
    }));
    setCollabRequests(mapped);
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const dbProduct = {
        title: newProduct.title,
        type: newProduct.type,
        price: newProduct.price,
        is_free: newProduct.isFree,
        audio_preview_url: newProduct.audioPreviewUrl,
        thumbnail_url: newProduct.thumbnailUrl,
        description: newProduct.description,
        tags: newProduct.tags,
        bpm: newProduct.bpm,
        key: newProduct.key,
        file_url: newProduct.fileUrl
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product');
        return;
      }

      if (data) {
        const addedProduct: Product = {
          id: data.id,
          title: data.title,
          type: data.type as ProductType,
          price: data.price,
          isFree: data.is_free,
          audioPreviewUrl: data.audio_preview_url,
          thumbnailUrl: data.thumbnail_url,
          description: data.description,
          tags: data.tags,
          bpm: data.bpm,
          key: data.key,
          fileUrl: data.file_url
        };
        setProducts(prev => [addedProduct, ...prev]);
      }
    } catch (err) {
      console.error('Unexpected error adding product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const previousProducts = [...products];
    setProducts(products.filter(p => p.id !== id));

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
        setProducts(previousProducts); // Rollback
      }
    } catch (err) {
      console.error('Unexpected error deleting product:', err);
      setProducts(previousProducts); // Rollback
    }
  };

  const handlePlayTrack = (product: Product) => {
    if (currentTrack?.id === product.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(product);
      setIsPlaying(true);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev; // Digital products usually only need one copy in cart
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleDownload = async (product: Product) => {
    if (!product.fileUrl) {
      console.error("No file URL found for product:", product.title);
      alert(`No file attached to "${product.title}".`);
      return;
    }

    console.log(`Downloading ${product.title}...`);
    setIsDownloading(true);

    try {
      const response = await fetch(product.fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      let extension = '';
      if (product.fileUrl.endsWith('.wav')) extension = '.wav';
      else if (product.fileUrl.endsWith('.mp3')) extension = '.mp3';
      else if (product.fileUrl.endsWith('.zip')) extension = '.zip';
      else extension = product.type === 'beat' ? '.mp3' : '.zip';

      a.download = `${product.title.replace(/[^a-zA-Z0-9 ]/g, '')}${extension}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log("Secure download initiated");
      }, 100);

    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCreateCollabRequest = async (request: any) => {
    const result = await createCollaboration(request);
    if (result) {
      setHasNewNotification(true);
      fetchCollabs(); // Refresh list
    } else {
      alert("Failed to submit request.");
    }
  };

  const handleUpdateCollabStatus = async (id: string, status: CollaborationRequest['status'], liveLink?: string) => {
    await updateCollaborationStatus(id, status);
    fetchCollabs(); // Refresh
  };

  // Deprecated/No-op for Email mode
  const handleSendMessage = (id: string, text: string, sender: 'admin' | 'user') => { };
  const handleUploadFile = (collabId: string, file: ProjectFile) => { };

  return (
    <div className="min-h-screen pb-32">
      {/* Admin Login Overlay */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={() => {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setActiveView('admin');
            window.history.replaceState({}, '', '/');
          }}
          onCancel={() => {
            setShowAdminLogin(false);
            window.history.replaceState({}, '', '/');
          }}
        />
      )}

      <Navbar
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          if (isAdmin) {
            setActiveView(activeView === 'store' ? 'admin' : 'store');
          }
        }}
        onToggleCart={() => setIsCartOpen(true)}
        cartCount={cart.length}
        hasNotification={hasNewNotification}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdmin && activeView === 'store' && (
          <Home
            products={products}
            searchQuery={searchQuery}
            onPlayTrack={handlePlayTrack}
            onAddToCart={handleAddToCart}
            onDownload={handleDownload}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onCreateCollab={handleCreateCollabRequest}
          />
        )}

        {isAdmin && activeView === 'admin' && (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            collabRequests={collabRequests}
            onUpdateCollab={handleUpdateCollabStatus}
            onSwitchToCollabs={() => setActiveView('collab')}
          />
        )}

        {activeView === 'collab' && (
          <CollaborationHub
            requests={collabRequests}
            isAdmin={isAdmin}
            onBack={() => setActiveView(isAdmin ? 'admin' : 'store')}
            onUpdateCollab={handleUpdateCollabStatus}
            onSendMessage={handleSendMessage}
            onUploadFile={handleUploadFile}
          />
        )}
      </main>

      {isDownloading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          {/* Loading Spinner */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Securing Asset</h3>
              <p className="text-slate-400 text-sm mt-2">Encrypting & Preparing download...</p>
              <p className="text-xs text-slate-500 mt-4">Large files may take a moment.</p>
            </div>
          </div>
        </div>
      )}

      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onClose={() => {
          setCurrentTrack(null);
          setIsPlaying(false);
        }}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onDownload={handleDownload}
        email="demo@tizzybeatz.com"
      />
    </div>
  );
};

export default App;
