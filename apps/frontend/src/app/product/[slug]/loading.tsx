import React from 'react';

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-rig-background text-rig-text pb-20 animate-pulse">
      <div className="border-b border-rig-border bg-rig-surface pt-12 pb-16">
        <div className="container-dense">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 bg-rig-border/30 rounded w-16"></div>
            <div className="h-4 bg-rig-border/30 rounded w-4"></div>
            <div className="h-4 bg-rig-border/30 rounded w-24"></div>
            <div className="h-4 bg-rig-border/30 rounded w-4"></div>
            <div className="h-4 bg-rig-border/30 rounded w-48"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div className="relative aspect-square bg-rig-border/20 rounded-lg max-w-xl mx-auto w-full"></div>

            <div className="flex flex-col">
              <div className="h-4 bg-rig-border/30 rounded w-20 mb-4"></div>
              <div className="h-10 bg-rig-border/50 rounded w-full mb-6"></div>
              <div className="h-10 bg-rig-border/50 rounded w-3/4 mb-8"></div>
              
              <div className="h-12 bg-rig-border/40 rounded w-48 mb-6"></div>
              
              <div className="h-4 bg-rig-border/30 rounded w-32 mb-8"></div>
              
              <div className="space-y-4 mb-10">
                <div className="h-4 bg-rig-border/30 rounded w-full"></div>
                <div className="h-4 bg-rig-border/30 rounded w-5/6"></div>
                <div className="h-4 bg-rig-border/30 rounded w-4/6"></div>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="h-14 bg-rig-border/50 rounded flex-1"></div>
                <div className="h-14 bg-rig-border/50 rounded w-14"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
