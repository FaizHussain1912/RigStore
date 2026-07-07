import React from 'react';
import ProductClient from './ProductClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  return (
    <main className="min-h-screen bg-rig-background text-rig-text pb-20">
      <ProductClient slug={resolvedParams.slug} />
    </main>
  );
}
