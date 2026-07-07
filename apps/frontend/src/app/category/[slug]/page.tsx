import React from 'react';
import CategoryClient from './CategoryClient';
export const dynamic = 'force-dynamic';

async function getCategoryProducts(slug: string, searchParams?: any) {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767').replace(/\/$/, '');
    const url = new URL(`${baseUrl}/api/category/${slug}`);
    
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string' && value) {
          url.searchParams.append(key, value);
        }
      });
    }

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      const errText = await res.text().catch(() => 'no text');
      return { error: `Failed to fetch category ${slug}. Status: ${res.status}. Text: ${errText}`, url: url.toString() };
    }
    const data = await res.json();
    return { data, url: url.toString() };
  } catch (error: any) {
    return { error: `Exception: ${error.message}`, url: 'unknown' };
  }
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Fetch all products for the category once
  const result = await getCategoryProducts(params.slug);
  const products = result?.data;
  
  if (!products || products.length === 0) {
    return (
      <main className="container-dense py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-rig-muted">We could not find any products in this category.</p>
        <div className="mt-8 p-4 bg-red-100 text-red-900 rounded text-left overflow-auto text-sm">
          <strong>Debug Info:</strong><br />
          URL Fetched: {result?.url}<br />
          Error: {result?.error || 'No error, just empty array'}
        </div>
      </main>
    );
  }

  const categoryName = products[0].category.name;

  return (
    <main className="container-dense py-8">
      <div className="mb-8 border-b border-rig-border pb-4">
        <h1 className="text-4xl font-black text-rig-text tracking-tight">{categoryName}</h1>
        <p className="text-rig-muted mt-2">Browse our extensive collection of high-performance {categoryName.toLowerCase()}.</p>
      </div>

      <CategoryClient products={products} categoryName={categoryName} />
    </main>
  );
}
