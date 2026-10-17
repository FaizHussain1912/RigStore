'use client';

import React, { useState, useEffect } from 'react';
import { validateBuild, BuildSelection, CompatibilityIssue, HardwareComponent } from '@rigstore/shared-utils';
import { 
  Cpu, Monitor, Zap, HardDrive, AlertTriangle, CheckCircle, XCircle, 
  Share2, Save, Printer, Sparkles, Copy, Check
} from 'lucide-react';
import { useCart } from '../CartContext';
import { useCurrency } from '../CurrencyContext';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';

export default function BuilderClient() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const { user } = useAuth();

  const [build, setBuild] = useState<BuildSelection>({
    ram: [],
    gpu: [],
    storage: []
  });

  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('CPU');
  const [sortOption, setSortOption] = useState<string>('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setCatalog(data);
        setLoading(false);

        // Check if there is a shared build in the URL
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const shareCode = urlParams.get('share');
          if (shareCode) {
            fetch(`${API_URL}/api/builder/share/${shareCode}`)
              .then(res => res.json())
              .then(saved => {
                if (saved && saved.components) {
                  setBuild(saved.components);
                  toast(`Loaded shared build: "${saved.title}"`, 'success');
                }
              })
              .catch(console.error);
          }
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API_URL, toast]);

  useEffect(() => {
    // Run constraint engine whenever the build changes
    const newIssues = validateBuild(build);
    setIssues(newIssues);
  }, [build]);

  const handleSelect = (component: any) => {
    const compData = component.compatibility || {};
    const specs = component.specs || {};
    
    setBuild(prev => {
      const updated = { ...prev };
      const fallbackMemoryType = component.name?.toUpperCase().includes('DDR5') ? 'DDR5' 
                               : component.name?.toUpperCase().includes('DDR4') ? 'DDR4' 
                               : component.name?.toUpperCase().includes('DDR3') ? 'DDR3' 
                               : undefined;

      const mapped = { 
        ...component, 
        ...specs, 
        ...compData,
        memoryType: compData.memoryType || specs.memoryType || fallbackMemoryType,
        socket: compData.socket || specs.socket,
        formFactor: compData.formFactor || specs.formFactor,
        ramSlots: compData.ramSlots || specs.ramSlots || 4,
        m2Slots: compData.m2Slots || specs.m2Slots || 1,
        modules: compData.modules || specs.modules || (compData.category === 'RAM' ? 1 : undefined),
        tdp: compData.tdp || specs.tdp || 0,
        lengthMm: compData.lengthMm || specs.lengthMm || 0,
        wattage: compData.wattage || specs.wattage || 0,
      };
      
      switch (compData.category || component.category?.slug.toUpperCase()) {
        case 'CPU': updated.cpu = mapped; break;
        case 'MOTHERBOARD': updated.motherboard = mapped; break;
        case 'PSU': updated.psu = mapped; break;
        case 'CASE': updated.pcCase = mapped; break;
        case 'RAM': updated.ram = [mapped]; break;
        case 'GPU': updated.gpu = [mapped]; break;
        case 'COOLER': updated.cooler = mapped; break;
        case 'STORAGE': updated.storage = [mapped]; break;
      }
      return updated;
    });
  };

  const handleRemove = (category: string) => {
    setBuild(prev => {
      const updated = { ...prev };
      if (category === 'CPU') delete updated.cpu;
      if (category === 'MOTHERBOARD') delete updated.motherboard;
      if (category === 'PSU') delete updated.psu;
      if (category === 'CASE') delete updated.pcCase;
      if (category === 'COOLER') delete updated.cooler;
      if (category === 'RAM') updated.ram = [];
      if (category === 'GPU') updated.gpu = [];
      if (category === 'STORAGE') updated.storage = [];
      return updated;
    });
  };

  const categories = ['CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'PSU', 'CASE', 'COOLER', 'STORAGE'];

  const getTotalPrice = () => {
    let total = 0;
    if (build.cpu) total += (build.cpu as any).basePrice || 0;
    if (build.motherboard) total += (build.motherboard as any).basePrice || 0;
    if (build.psu) total += (build.psu as any).basePrice || 0;
    if (build.pcCase) total += (build.pcCase as any).basePrice || 0;
    if (build.cooler) total += (build.cooler as any).basePrice || 0;
    build.ram.forEach(r => total += (r as any).basePrice || 0);
    build.gpu.forEach(g => total += (g as any).basePrice || 0);
    build.storage.forEach(s => total += (s as any).basePrice || 0);
    return total;
  };

  const getTotalWatts = () => {
    return ((build.cpu?.tdp || 0) + build.gpu.reduce((s, g) => s + (g.tdp || 0), 0) + 50);
  };

  const handleAddBuildToCart = () => {
    if (build.cpu) addToCart(build.cpu, 1);
    if (build.motherboard) addToCart(build.motherboard, 1);
    if (build.psu) addToCart(build.psu, 1);
    if (build.pcCase) addToCart(build.pcCase, 1);
    if (build.cooler) addToCart(build.cooler, 1);
    build.ram.forEach(r => addToCart(r, 1));
    build.gpu.forEach(g => addToCart(g, 1));
    build.storage.forEach(s => addToCart(s, 1));
    setIsCartOpen(true);
  };

  // Handle Share Build
  const handleShareBuild = async () => {
    setIsSharing(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: user ? `${user.name}'s Custom Rig` : 'Custom PC Build',
          components: build,
          totalPrice: getTotalPrice(),
          totalWatts: getTotalWatts(),
          userId: user?.id || null
        })
      });

      if (res.ok) {
        const saved = await res.json();
        const fullLink = `${window.location.origin}/builder?share=${saved.shareId}`;
        setShareLink(fullLink);
        await navigator.clipboard.writeText(fullLink);
        setCopied(true);
        toast('Share link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 3000);
      } else {
        toast('Failed to generate share link', 'error');
      }
    } catch (e) {
      toast('Network error while sharing', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  // Print Build Sheet
  const handlePrintBuild = () => {
    window.print();
  };

  // Load a preset build
  const loadPreset = (presetName: string) => {
    const cpus = catalog.filter(p => p.compatibility?.category === 'CPU');
    const gpus = catalog.filter(p => p.compatibility?.category === 'GPU');
    const mobos = catalog.filter(p => p.compatibility?.category === 'MOTHERBOARD');
    const rams = catalog.filter(p => p.compatibility?.category === 'RAM');
    const psus = catalog.filter(p => p.compatibility?.category === 'PSU');
    const cases = catalog.filter(p => p.compatibility?.category === 'CASE');

    if (presetName === 'BUDGET') {
      const cpu = cpus.find(c => c.basePrice < 60000) || cpus[0];
      const mobo = mobos.find(m => m.compatibility?.socket === cpu?.compatibility?.socket) || mobos[0];
      const ram = rams.find(r => r.compatibility?.memoryType === mobo?.compatibility?.memoryType) || rams[0];
      const gpu = gpus.find(g => g.basePrice < 120000) || gpus[0];
      const psu = psus[0];
      const pcCase = cases[0];

      if (cpu) handleSelect(cpu);
      if (mobo) handleSelect(mobo);
      if (ram) handleSelect(ram);
      if (gpu) handleSelect(gpu);
      if (psu) handleSelect(psu);
      if (pcCase) handleSelect(pcCase);
      toast('Loaded "Budget Gaming Rig" preset!', 'success');
    } else if (presetName === 'ULTRA') {
      const cpu = [...cpus].sort((a, b) => b.basePrice - a.basePrice)[0];
      const mobo = mobos.find(m => m.compatibility?.socket === cpu?.compatibility?.socket) || mobos[0];
      const ram = rams.find(r => r.compatibility?.memoryType === mobo?.compatibility?.memoryType) || rams[0];
      const gpu = [...gpus].sort((a, b) => b.basePrice - a.basePrice)[0];
      const psu = [...psus].sort((a, b) => (b.compatibility?.wattage || 0) - (a.compatibility?.wattage || 0))[0] || psus[0];
      const pcCase = cases[0];

      if (cpu) handleSelect(cpu);
      if (mobo) handleSelect(mobo);
      if (ram) handleSelect(ram);
      if (gpu) handleSelect(gpu);
      if (psu) handleSelect(psu);
      if (pcCase) handleSelect(pcCase);
      toast('Loaded "4K Ultra Gaming Rig" preset!', 'success');
    }
  };

  if (loading) return <div className="container-dense py-12 text-center text-rig-muted">Loading Engine...</div>;

  return (
    <div className="container-dense py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Left: Component Selection */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-rig-text tracking-tighter">Custom PC Builder</h1>
            <p className="text-xs text-rig-muted mt-1">Constraint-satisfaction compatibility engine with auto wattage calculation</p>
          </div>

          {/* Quick Starter Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rig-primary flex items-center gap-1">
              <Sparkles size={14} /> Presets:
            </span>
            <button
              onClick={() => loadPreset('BUDGET')}
              className="text-xs font-bold bg-rig-surface border border-rig-border hover:border-rig-primary px-3 py-1.5 rounded-lg text-rig-text transition-colors"
            >
              1080p Esports
            </button>
            <button
              onClick={() => loadPreset('ULTRA')}
              className="text-xs font-bold bg-rig-surface border border-rig-border hover:border-rig-primary px-3 py-1.5 rounded-lg text-rig-text transition-colors"
            >
              4K Ultra Rig
            </button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-rig-border pb-2">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase transition-colors rounded-t-lg ${activeCategory === cat ? 'bg-rig-surface text-rig-primary border-t-2 border-t-rig-primary' : 'text-rig-muted hover:text-rig-text'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-rig-border pb-3">
          <span className="text-xs text-rig-muted font-medium">
            Selecting <strong className="text-rig-text">{activeCategory}</strong>
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="builder-sort" className="text-xs font-semibold text-rig-muted">Sort By:</label>
            <select
              id="builder-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-rig-surface border border-rig-border text-rig-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rig-primary"
            >
              <option value="">Recommended</option>
              <option value="popularity">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Catalog List */}
        <div className="flex flex-col gap-3">
          {catalog.filter(p => p.compatibility.category === activeCategory)
            .sort((a, b) => {
              if (sortOption === 'price_asc') return a.basePrice - b.basePrice;
              if (sortOption === 'price_desc') return b.basePrice - a.basePrice;
              if (sortOption === 'popularity') {
                const aPop = a.inventory?.salesVelocity7Days || 0;
                const bPop = b.inventory?.salesVelocity7Days || 0;
                return bPop - aPop;
              }
              return 0;
            })
            .map(product => (
            <div key={product.id} className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-rig-primary/50 transition-colors cursor-pointer group gap-4 rounded-xl" onClick={() => handleSelect(product)}>
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="w-16 h-16 object-contain bg-rig-background rounded-lg border border-rig-border p-1 shrink-0 flex items-center justify-center">
                  <img src={product.imageUrl || '/images/gpu.png'} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-rig-text font-bold text-sm leading-tight group-hover:text-rig-primary transition-colors">{product.name}</span>
                  <span className="text-xs text-rig-muted mt-0.5 line-clamp-1">{product.description}</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(product.compatibility).map(([k, v]) => {
                      if (k === 'category') return null;
                      return <span key={k} className="bg-rig-background border border-rig-border text-[10px] uppercase px-2 py-0.5 rounded text-rig-muted">{`${v}`}</span>
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-0 border-rig-border pt-3 sm:pt-0">
                <span className="text-rig-text font-black text-base">{formatPrice(product.basePrice || 0)}</span>
                <button className="text-rig-primary text-xs font-bold uppercase hover:underline mt-1">Select</button>
              </div>
            </div>
          ))}
          {catalog.filter(p => p.compatibility.category === activeCategory).length === 0 && (
            <p className="text-rig-muted italic p-6 text-center border border-dashed border-rig-border rounded-xl text-sm">No components found in this category.</p>
          )}
        </div>
      </div>

      {/* Right: Cart & Compatibility Engine Status */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
        
        {/* Compatibility Engine Banner */}
        <div className={`p-4 border rounded-xl shadow-lg ${issues.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <h2 className="text-base font-bold text-rig-text flex items-center gap-2 mb-2">
            {issues.length > 0 ? <><XCircle className="text-red-500 w-5 h-5" /> Compatibility Issues Found</> : <><CheckCircle className="text-green-500 w-5 h-5" /> 100% Compatible Build</>}
          </h2>
          
          {issues.length === 0 && (
            <p className="text-xs text-green-400">All selected hardware will work together flawlessly without bottleneck.</p>
          )}

          {issues.map((issue, idx) => (
            <div key={idx} className="bg-rig-background/80 p-3 rounded-lg border-l-2 border-l-red-500 mb-2 last:mb-0">
              <span className="text-red-400 font-bold text-xs block">{issue.title}</span>
              <span className="text-rig-muted text-[11px] block mt-0.5">{issue.message}</span>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col shadow-xl">
          <div className="flex justify-between items-center border-b border-rig-border pb-3 mb-4">
            <h2 className="text-lg font-black text-rig-text">Build Summary</h2>
            
            {/* Share & Print Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareBuild}
                disabled={isSharing}
                title="Share Build Permalink"
                className="p-1.5 text-rig-muted hover:text-rig-primary hover:bg-rig-background rounded-lg border border-rig-border transition-colors text-xs flex items-center gap-1 font-semibold"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={handlePrintBuild}
                title="Print Build Sheet"
                className="p-1.5 text-rig-muted hover:text-rig-text hover:bg-rig-background rounded-lg border border-rig-border transition-colors text-xs flex items-center gap-1 font-semibold"
              >
                <Printer size={14} />
              </button>
            </div>
          </div>

          {shareLink && (
            <div className="mb-4 p-2.5 bg-rig-background border border-rig-border rounded-xl text-xs flex items-center justify-between gap-2">
              <span className="text-rig-muted truncate text-[11px]">{shareLink}</span>
              <button onClick={() => { navigator.clipboard.writeText(shareLink); toast('Copied!', 'success'); }} className="text-rig-primary hover:underline shrink-0 font-bold">
                Copy
              </button>
            </div>
          )}
          
          <div className="flex flex-col gap-3 mb-6 max-h-[350px] overflow-y-auto pr-1">
            {categories.map(cat => {
              let selected: any = null;
              if (cat === 'CPU') selected = build.cpu;
              if (cat === 'MOTHERBOARD') selected = build.motherboard;
              if (cat === 'PSU') selected = build.psu;
              if (cat === 'CASE') selected = build.pcCase;
              if (cat === 'COOLER') selected = build.cooler;
              if (cat === 'RAM') selected = build.ram[0];
              if (cat === 'GPU') selected = build.gpu[0];
              if (cat === 'STORAGE') selected = build.storage[0];

              return (
                <div key={cat} className="flex flex-col border-b border-rig-border/40 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-rig-muted uppercase tracking-wider">{cat}</span>
                  {selected ? (
                    <div className="flex justify-between items-start mt-1">
                      <span className="text-xs text-rig-text font-bold line-clamp-1">{selected.name}</span>
                      <button onClick={() => handleRemove(cat)} className="text-red-500 hover:text-red-400 text-[11px] ml-2 shrink-0 font-semibold">Remove</button>
                    </div>
                  ) : (
                    <span className="text-xs text-rig-muted italic mt-0.5">Not selected</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-rig-border pt-4 flex justify-between items-center text-xs">
            <span className="text-rig-muted font-medium flex items-center gap-1">
              <Zap size={14} className="text-yellow-400" /> Estimated Power Draw
            </span>
            <span className="text-rig-text font-mono font-bold">{getTotalWatts()}W</span>
          </div>

          <div className="flex justify-between items-end mt-3 pt-3 border-t border-rig-border/50">
            <span className="text-rig-muted text-xs font-semibold">Total Price</span>
            <span className="text-rig-primary font-black text-2xl">{formatPrice(getTotalPrice())}</span>
          </div>

          <button 
            onClick={handleAddBuildToCart} 
            className={`w-full py-3 rounded-xl font-bold mt-6 transition-all text-sm shadow-lg ${issues.length > 0 ? 'bg-rig-border text-rig-muted cursor-not-allowed' : 'bg-rig-primary hover:bg-rig-primary/90 text-white shadow-rig-primary/20'}`} 
            disabled={issues.length > 0}
          >
            {issues.length > 0 ? 'Resolve Issues to Proceed' : 'Add Build to Cart'}
          </button>
        </div>

      </div>
    </div>
  );
}
