'use client';

import React, { useState, useMemo } from 'react';
import SidebarFilters from '../../../components/SidebarFilters';
import CategoryProductGrid from '../../../components/CategoryProductGrid';
import { ChevronDown } from 'lucide-react';

export default function CategoryClient({ products, categoryName }: { products: any[], categoryName: string }) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');

  // Filter products on the client
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Price filtering
      if (minPrice && p.basePrice < parseInt(minPrice)) return false;
      if (maxPrice && p.basePrice > parseInt(maxPrice)) return false;

      // 2. Spec/Brand filtering
      for (const [key, valuesArray] of Object.entries(filters)) {
        if (!valuesArray || valuesArray.length === 0) continue;

        if (key === 'brand') {
          if (!valuesArray.includes(p.brand)) return false;
        } else {
          if (!p.specs || !valuesArray.includes(p.specs[key])) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortOption === 'price_asc') return a.basePrice - b.basePrice;
      if (sortOption === 'price_desc') return b.basePrice - a.basePrice;
      return 0; // newest/default
    });
  }, [products, filters, minPrice, maxPrice, sortOption]);

  const handleFilterChange = (specKey: string, value: string) => {
    setFilters(prev => {
      const next = { ...prev };
      const currentValues = next[specKey] || [];
      
      if (currentValues.includes(value)) {
        // Remove value
        next[specKey] = currentValues.filter(v => v !== value);
        if (next[specKey].length === 0) {
          delete next[specKey];
        }
      } else {
        // Add value
        next[specKey] = [...currentValues, value];
      }
      return next;
    });
  };

  const handleApplyPrice = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleClearAll = () => {
    setFilters({});
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <SidebarFilters 
        unfilteredProducts={products} 
        activeFilters={filters}
        activeMinPrice={minPrice}
        activeMaxPrice={maxPrice}
        onFilterChange={handleFilterChange}
        onApplyPrice={handleApplyPrice}
        onClearAll={handleClearAll}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-rig-text">Products ({filteredProducts.length})</h2>
          
          <div className="relative group">
            <button className="flex items-center gap-2 bg-rig-surface border border-rig-border px-4 py-2 rounded-lg text-sm font-medium text-rig-text hover:border-rig-primary transition-colors">
              Sort By <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-rig-surface border border-rig-border shadow-2xl rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="flex flex-col p-1">
                <button onClick={() => setSortOption('newest')} className={`text-left px-4 py-2 text-sm rounded ${sortOption === 'newest' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-text hover:bg-white/5'}`}>Newest Arrivals</button>
                <button onClick={() => setSortOption('price_asc')} className={`text-left px-4 py-2 text-sm rounded ${sortOption === 'price_asc' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-text hover:bg-white/5'}`}>Price: Low to High</button>
                <button onClick={() => setSortOption('price_desc')} className={`text-left px-4 py-2 text-sm rounded ${sortOption === 'price_desc' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-text hover:bg-white/5'}`}>Price: High to Low</button>
              </div>
            </div>
          </div>
        </div>

        <CategoryProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
