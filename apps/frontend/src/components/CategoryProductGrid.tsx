'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { LayoutList, Columns2, Columns3, Columns4, ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'list' | 'grid-2' | 'grid-3' | 'grid-4';

export default function CategoryProductGrid({ products }: { products: any[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Reset page to 1 when products array changes (e.g., filters applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  
  // Ensure current page is valid
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // View Mode icons
  const viewOptions: { id: ViewMode, icon: React.ReactNode }[] = [
    { id: 'list', icon: <LayoutList size={20} /> },
    { id: 'grid-2', icon: <Columns2 size={20} /> },
    { id: 'grid-3', icon: <Columns3 size={20} /> },
    { id: 'grid-4', icon: <Columns4 size={20} /> },
  ];

  // Grid class mapping
  const getGridClass = () => {
    switch(viewMode) {
      case 'list': return 'grid-cols-1 gap-4';
      case 'grid-2': return 'grid-cols-1 sm:grid-cols-2 gap-6';
      case 'grid-3': return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6';
      case 'grid-4': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 p-4 border border-rig-border bg-rig-surface/50 rounded-xl">
        
        {/* View As */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm font-bold text-rig-muted tracking-widest uppercase">View As</span>
          <div className="flex bg-rig-background border border-rig-border rounded-lg overflow-hidden">
            {viewOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setViewMode(opt.id)}
                className={`p-2 transition-colors ${viewMode === opt.id ? 'bg-rig-primary text-white' : 'text-rig-muted hover:bg-rig-surface hover:text-rig-text'} ${(opt.id === 'grid-3' || opt.id === 'grid-4') ? 'hidden sm:block' : ''}`}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Items Per Page */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-rig-muted tracking-widest uppercase">Items Per Page</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`grid ${getGridClass()}`}>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode === 'list' ? 'list' : 'grid'} />
        ))}
        {products.length === 0 && (
          <p className="text-rig-muted italic col-span-full py-12 text-center">No products match the selected filters.</p>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button 
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            className="flex items-center gap-1 px-4 py-2 border border-rig-border rounded-lg text-sm font-medium hover:bg-rig-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-rig-text"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors flex items-center justify-center ${validCurrentPage === page ? 'bg-rig-primary text-white border border-rig-primary' : 'border border-rig-border hover:bg-rig-surface text-rig-muted hover:text-rig-text'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 border border-rig-border rounded-lg text-sm font-medium hover:bg-rig-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-rig-text"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
