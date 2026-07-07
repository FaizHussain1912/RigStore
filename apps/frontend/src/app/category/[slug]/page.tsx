import React from 'react';
import CategoryClient from './CategoryClient';

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
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch category products:', error);
    return null;
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
  const products = await getCategoryProducts(params.slug);
  
  if (!products || products.length === 0) {
    return (
      <main className="container-dense py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-rig-muted">We could not find any products in this category.</p>
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
