import React from 'react';
import DealsSlider from './DealsSlider';
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-rig-text mb-4">EXCLUSIVE PC DEALS</h1>
          <p className="text-rig-muted max-w-2xl mx-auto">
            Grab these pre-built performance rigs at unbeatable prices before they run out of stock. Carefully assembled and rigorously tested.
          </p>
        </div>
        
        <DealsSlider deals={deals} />
      </div>
    </main>
  );
}
