import React from 'react';

export default function CategoryLoading() {
  return (
    <main className="container-dense py-8 animate-pulse">
      <div className="mb-8 border-b border-rig-border pb-4">
        <div className="h-10 bg-rig-border/50 rounded w-64 mb-4"></div>
        <div className="h-4 bg-rig-border/30 rounded w-96"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div className="h-8 bg-rig-border/50 rounded w-32 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6">
              <div className="h-5 bg-rig-border/40 rounded w-24 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-rig-border/20 rounded w-full"></div>
                <div className="h-4 bg-rig-border/20 rounded w-5/6"></div>
                <div className="h-4 bg-rig-border/20 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 bg-rig-border/30 rounded w-24"></div>
            <div className="h-10 bg-rig-border/30 rounded w-40"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel p-4 flex flex-col gap-4">
                <div className="w-full aspect-square bg-rig-border/20 rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-rig-border/40 rounded w-full"></div>
                  <div className="h-5 bg-rig-border/40 rounded w-3/4"></div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4">
                  <div className="h-6 bg-rig-border/50 rounded w-20"></div>
                  <div className="h-10 w-10 bg-rig-border/50 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
