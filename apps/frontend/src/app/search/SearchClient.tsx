'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '../../components/ProductCard';
import { Search, ChevronDown, PackageSearch, Filter } from 'lucide-react';
import Link from 'next/link';

interface SearchClientProps {
  initialProducts: any[];
  query: string;
}

export default function SearchClient({ initialProducts, query }: SearchClientProps) {
  const [sortOption, setSortOption] = useState('relevance');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Extract unique brands from initial products
  const brands = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [initialProducts]);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) return false;
      if (onlyInStock) {
        const inStock = p.inventory ? p.inventory.totalStock > 0 : true;
        if (!inStock) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.basePrice - b.basePrice;
      if (sortOption === 'price_desc') return b.basePrice - a.basePrice;
      return 0;
    });
  }, [initialProducts, selectedBrand, onlyInStock, sortOption]);

  if (initialProducts.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-rig-surface border border-rig-border flex items-center justify-center mx-auto mb-4 text-rig-muted">
          <PackageSearch size={32} />
        </div>
        <h2 className="text-2xl font-bold text-rig-text mb-2">No matching products found</h2>
        <p className="text-rig-muted text-sm mb-6">
          We couldn't find any hardware matching "{query}". Try checking your spelling or search for broader keywords like "RTX", "Intel", "SSD", or "RAM".
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['RTX 4070', 'Processors', 'Motherboards', 'DDR5', 'Laptops', 'Gaming Mice'].map((term) => (
            <Link 
              key={term} 
              href={`/search?q=${encodeURIComponent(term)}`}
              className="text-xs font-semibold bg-rig-surface border border-rig-border hover:border-rig-primary px-3 py-1.5 rounded-full text-rig-text transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-rig-surface border border-rig-border p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rig-muted uppercase">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-rig-background border border-rig-border text-rig-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rig-primary cursor-pointer"
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-medium text-rig-text cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded accent-rig-primary w-4 h-4"
            />
            In Stock Only
          </label>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-rig-muted uppercase">Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-rig-background border border-rig-border text-rig-text text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-rig-primary cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
