'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || '';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-dropdown" className="text-sm font-semibold text-rig-muted">
        Sort By:
      </label>
      <select
        id="sort-dropdown"
        value={currentSort}
        onChange={handleSortChange}
        className="bg-rig-surface border border-rig-border text-rig-text text-sm rounded focus:ring-rig-primary focus:border-rig-primary block p-2"
      >
        <option value="">Recommended</option>
        <option value="popularity">Popularity</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
