'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useCurrency } from '../app/CurrencyContext';

interface SidebarFiltersProps {
  unfilteredProducts: any[];
  activeFilters: Record<string, string[]>;
  activeMinPrice: string;
  activeMaxPrice: string;
  onFilterChange: (specKey: string, value: string) => void;
  onApplyPrice: (min: string, max: string) => void;
  onClearAll: () => void;
}

export default function SidebarFilters({ 
  unfilteredProducts, 
  activeFilters, 
  activeMinPrice, 
  activeMaxPrice, 
  onFilterChange, 
  onApplyPrice, 
  onClearAll 
}: SidebarFiltersProps) {
  const [localMinPrice, setLocalMinPrice] = useState(activeMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(activeMaxPrice);
  const { currency } = useCurrency();

  useEffect(() => {
    setLocalMinPrice(activeMinPrice);
    setLocalMaxPrice(activeMaxPrice);
  }, [activeMinPrice, activeMaxPrice]);

  // Extract all unique specs and their possible values
  const filterOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    unfilteredProducts.forEach((product) => {
      // Add Brand as a top-level filter option
      if (product.brand) {
        if (!options['brand']) {
          options['brand'] = new Set();
        }
        options['brand'].add(product.brand);
      }

      if (product.specs) {
        Object.entries(product.specs).forEach(([key, value]) => {
          if (typeof value === 'string') {
            if (!options[key]) {
              options[key] = new Set();
            }
            options[key].add(value);
          }
        });
      }
    });

    // Convert sets to sorted arrays
    const formatted: Record<string, string[]> = {};
    Object.keys(options).forEach((key) => {
      formatted[key] = Array.from(options[key]).sort();
    });

    return formatted;
  }, [unfilteredProducts]);

  const handleApplyPrice = () => {
    onApplyPrice(localMinPrice, localMaxPrice);
  };

  // If no filters available, don't render the sidebar
  if (Object.keys(filterOptions).length === 0) {
    return null;
  }

  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-rig-border pb-2">
        <h3 className="text-lg font-bold text-rig-text uppercase tracking-tight">Filters</h3>
        <button 
          onClick={onClearAll}
          className="text-xs font-bold text-rig-primary hover:underline uppercase"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Price Range Section */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-rig-text uppercase tracking-wider">Price Range ({currency === 'USD' ? '$' : 'Rs.'})</h4>
          <div className="mt-4 flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full bg-rig-surface border border-rig-border text-rig-text text-sm rounded focus:ring-rig-primary focus:border-rig-primary block p-2"
            />
            <span className="text-rig-muted">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full bg-rig-surface border border-rig-border text-rig-text text-sm rounded focus:ring-rig-primary focus:border-rig-primary block p-2"
            />
          </div>
          <button 
            onClick={handleApplyPrice}
            className="bg-rig-primary hover:bg-red-600 text-white font-bold py-1.5 rounded text-sm transition-colors"
          >
            Apply Range
          </button>
        </div>

        {/* Dynamic Spec Filters */}
        {Object.entries(filterOptions).map(([specKey, values]) => (
          <div key={specKey} className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-rig-text uppercase tracking-wider">{specKey}</h4>
            <div className="flex flex-col gap-2">
              {values.map((val) => {
                const isChecked = activeFilters[specKey]?.includes(val);
                return (
                  <div 
                    key={val} 
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => onFilterChange(specKey, val)}
                  >
                    <div className={`w-4 h-4 rounded-sm border mt-0.5 flex items-center justify-center transition-colors ${isChecked ? 'bg-rig-primary border-rig-primary' : 'bg-rig-background border-rig-border group-hover:border-rig-primary'}`}>
                      {isChecked && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className={`text-sm ${isChecked ? 'text-rig-text font-medium' : 'text-rig-muted group-hover:text-rig-text transition-colors'}`}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
