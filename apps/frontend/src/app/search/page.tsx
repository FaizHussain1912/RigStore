import React from 'react';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import SearchClient from './SearchClient';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const dynamic = 'force-dynamic';

async function getSearchResults(query: string) {
  if (!query) return [];
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767').replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const products = await getSearchResults(q);

  return (
    <main className="container-dense py-8 min-h-[75vh]">
      <div className="mb-8 border-b border-rig-border pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rig-primary uppercase tracking-widest mb-1">
          <Search size={14} /> Catalog Search
        </div>
        <h1 className="text-3xl font-black text-rig-text tracking-tight">
          {q ? `Results for "${q}"` : 'Search Hardware'}
        </h1>
        <p className="text-sm text-rig-muted mt-1">
          {products.length > 0 ? `Found ${products.length} products matching your query.` : 'Explore components and gaming rigs.'}
        </p>
      </div>

      <SearchClient initialProducts={products} query={q} />
    </main>
  );
}
