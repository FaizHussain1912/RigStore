'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareList: any[];
  addToCompare: (product: any) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rigstore_compare');
      if (saved) setCompareList(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const save = (list: any[]) => {
    setCompareList(list);
    try {
      localStorage.setItem('rigstore_compare', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCompare = (product: any) => {
    if (compareList.some(p => p.id === product.id)) {
      toast('Product is already in compare list', 'info');
      return;
    }
    if (compareList.length >= 4) {
      toast('You can compare a maximum of 4 products at a time', 'error');
      return;
    }
    const updated = [...compareList, product];
    save(updated);
    toast(`Added ${product.name} to compare`, 'success');
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter(p => p.id !== productId);
    save(updated);
    toast('Removed from compare', 'info');
  };

  const clearCompare = () => {
    save([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
