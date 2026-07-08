import React from 'react';
import CategoryClient from '../category/[slug]/CategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PC Steal Deals | RigStore',
  description: 'Exclusive pre-built PC deals at unbeatable prices.',
};

export const revalidate = 15;

async function getDeals() {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767').replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/api/category/pc-deals`, {
      next: { revalidate: 15 }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch PC deals. Status: ${res.status}`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching PC deals:", error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <main className="min-h-screen bg-rig-background pt-8 pb-20">
      <div className="container-dense">
        <div className="mb-8 border-b border-rig-border pb-4">
          <h1 className="text-4xl font-black text-blue-500 tracking-tight">EXCLUSIVE PC DEALS</h1>
          <p className="text-rig-muted mt-2 max-w-2xl">
            Grab these pre-built performance rigs at unbeatable prices before they run out of stock. Carefully assembled and rigorously tested.
          </p>
        </div>
        
        {deals && deals.length > 0 ? (
          <CategoryClient products={deals} categoryName="PC Deals" />
        ) : (
          <div className="min-h-[40vh] flex items-center justify-center">
            <h2 className="text-2xl text-rig-muted">No Deals Currently Active</h2>
          </div>
        )}
      </div>
    </main>
  );
}
