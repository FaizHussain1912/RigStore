import React from 'react';
import ProductClient from './ProductClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 15;

async function getProduct(slug: string) {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767').replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/api/product/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  return (
    <main className="min-h-screen bg-rig-background text-rig-text pb-20">
      <ProductClient slug={resolvedParams.slug} initialProduct={product} />
    </main>
  );
}
