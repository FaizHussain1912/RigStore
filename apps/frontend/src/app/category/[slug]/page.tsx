import React from 'react';
import CategoryClient from './CategoryClient';
export const revalidate = 15;

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

    const res = await fetch(url.toString());
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

export default async function CategoryPage(props: { 
  params: Promise<{ slug: string }>,
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  // Fetch all products for the category once
  const result = await getCategoryProducts(params.slug);
  const products = result?.data;
  
  if (!products || products.length === 0) {
    return (
      <main className="container-dense py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-rig-text">No Products Found</h1>
        <p className="text-rig-muted max-w-md mx-auto mb-8">
          We could not find any products in this category at this time. Check back soon or explore other components.
        </p>
        <a href="/" className="bg-rig-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-rig-primary/90 transition-colors">
          Browse All Categories
        </a>
      </main>
    );
  }

  const isAll = params.slug.toLowerCase() === 'all';
  const categoryName = isAll ? 'All Hardware Components' : (products[0]?.category?.name || 'Hardware');

  return (
    <main className="container-dense py-8">
      <div className="mb-8 border-b border-rig-border pb-4">
        <h1 className="text-4xl font-black text-rig-text tracking-tight">{categoryName}</h1>
        <p className="text-rig-muted mt-2">
          {isAll 
            ? 'Browse our complete catalog of high-performance PC components, gaming rigs, and accessories.' 
            : `Browse our extensive collection of high-performance ${categoryName.toLowerCase()}.`}
        </p>
      </div>

      <CategoryClient products={products} categoryName={categoryName} />
    </main>
  );
}
