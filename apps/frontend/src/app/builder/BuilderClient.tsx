'use client';

import React, { useState, useEffect } from 'react';
import { validateBuild, BuildSelection, CompatibilityIssue, HardwareComponent } from '@rigstore/shared-utils';
import { Cpu, Monitor, Zap, HardDrive, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../CartContext';
import { useCurrency } from '../CurrencyContext';

export default function BuilderClient() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [build, setBuild] = useState<BuildSelection>({
    ram: [],
    gpu: [],
    storage: []
  });

  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('CPU');
  const [sortOption, setSortOption] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:6767/api/products')
      .then(res => res.json())
      .then(data => {
        setCatalog(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

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

  if (loading) return <div className="container-dense py-12 text-center text-rig-muted">Loading Engine...</div>;

  const categories = ['CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'PSU', 'CASE', 'COOLER', 'STORAGE'];

  const getTotalPrice = () => {
    let total = 0;
    if (build.cpu) total += build.cpu.basePrice || 0;
    if (build.motherboard) total += build.motherboard.basePrice || 0;
    if (build.psu) total += build.psu.basePrice || 0;
    if (build.pcCase) total += build.pcCase.basePrice || 0;
    if (build.cooler) total += build.cooler.basePrice || 0;
    build.ram.forEach(r => total += r.basePrice || 0);
    build.gpu.forEach(g => total += g.basePrice || 0);
    build.storage.forEach(s => total += s.basePrice || 0);
    return total;
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

  return (
    <div className="container-dense py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Left: Component Selection */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-rig-text tracking-tighter">Custom PC Builder</h1>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-rig-border pb-2">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-bold uppercase transition-colors rounded-t-sm ${activeCategory === cat ? 'bg-rig-surface text-rig-primary border-t-2 border-t-rig-primary' : 'text-rig-muted hover:text-rig-text'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-end border-b border-rig-border pb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="builder-sort" className="text-sm font-semibold text-rig-muted">Sort By:</label>
            <select
              id="builder-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-rig-surface border border-rig-border text-rig-text text-sm rounded focus:ring-rig-primary focus:border-rig-primary block p-2"
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
            <div key={product.id} className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-rig-primary/50 transition-colors cursor-pointer group gap-4" onClick={() => handleSelect(product)}>
              <div className="flex items-start sm:items-center gap-4 w-full">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-contain bg-rig-background/50 rounded border border-rig-border p-1 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="text-rig-text font-bold">{product.name}</span>
                  <span className="spec-text mt-1 text-rig-muted line-clamp-1">{product.description}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(product.compatibility).map(([k, v]) => {
                      if (k === 'category') return null;
                      return <span key={k} className="bg-rig-background border border-rig-border text-[10px] uppercase px-2 py-0.5 rounded-sm text-rig-muted">{`${v}`}</span>
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-0 border-rig-border pt-3 sm:pt-0">
                <span className="text-rig-text font-bold text-lg">{formatPrice(product.basePrice || 0)}</span>
                <button className="text-rig-primary text-xs font-bold uppercase hover:underline mt-1">Select</button>
              </div>
            </div>
          ))}
          {catalog.filter(p => p.compatibility.category === activeCategory).length === 0 && (
            <p className="text-rig-muted italic p-4 text-center border border-dashed border-rig-border">No components found in this category.</p>
          )}
        </div>
      </div>

      {/* Right: Cart & Compatibility Engine Status */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
        
        {/* Compatibility Engine Banner */}
        <div className={`p-4 border shadow-xl ${issues.length > 0 ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-500/50' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-500/50'}`}>
          <h2 className="text-lg font-bold text-rig-text flex items-center gap-2 mb-3">
            {issues.length > 0 ? <><XCircle className="text-red-500" /> Compatibility Issues Found</> : <><CheckCircle className="text-green-500" /> Build Compatible</>}
          </h2>
          
          {issues.length === 0 && (
            <p className="text-sm text-green-700 dark:text-green-400">Your selected components will work together seamlessly.</p>
          )}

          {issues.map((issue, idx) => (
            <div key={idx} className="bg-rig-background/50 p-3 rounded-sm border-l-2 border-l-red-500 mb-2 last:mb-0">
              <span className="text-red-600 dark:text-red-400 font-bold text-sm block">{issue.title}</span>
              <span className="text-rig-muted text-xs block mt-1">{issue.message}</span>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-rig-text border-b border-rig-border pb-4 mb-4">Build Summary</h2>
          
          <div className="flex flex-col gap-4 mb-6">
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
                <div key={cat} className="flex flex-col border-b border-rig-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-rig-muted uppercase tracking-wider">{cat}</span>
                  {selected ? (
                    <div className="flex justify-between items-start mt-1">
                      <span className="text-sm text-rig-text font-medium">{selected.name}</span>
                      <button onClick={() => handleRemove(cat)} className="text-rig-primary hover:text-rig-text text-xs ml-2 shrink-0">Remove</button>
                    </div>
                  ) : (
                    <span className="text-sm text-rig-muted italic mt-1">Not selected</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-rig-border pt-4 flex justify-between items-end">
            <span className="text-rig-muted font-medium">Total Power Draw</span>
            <span className="text-rig-text font-mono">{((build.cpu?.tdp || 0) + build.gpu.reduce((s, g) => s + g.tdp, 0) + 50)}W</span>
          </div>
          <div className="flex justify-between items-end mt-2">
            <span className="text-rig-muted font-medium">Total Price</span>
            <span className="text-rig-primary font-bold text-2xl">{formatPrice(getTotalPrice())}</span>
          </div>

          <button onClick={handleAddBuildToCart} className={`w-full py-3 font-bold mt-6 transition-colors ${issues.length > 0 ? 'bg-rig-border text-rig-muted cursor-not-allowed' : 'bg-rig-primary hover:bg-rig-primary/90 text-white'}`} disabled={issues.length > 0}>
            {issues.length > 0 ? 'Resolve Issues to Proceed' : 'Add Build to Cart'}
          </button>
        </div>

      </div>
    </div>
  );
}
