import React from 'react';
import ProductClient from './ProductClient';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-rig-background text-rig-text pb-20">
      <ProductClient slug={params.slug} />
    </main>
  );
}
