"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border bg-rig-background min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-300 ${
              t.type === 'success' ? 'border-green-500/30' : 
              t.type === 'error' ? 'border-red-500/30' : 
              'border-rig-border'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
            {t.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
            {t.type === 'info' && <Info className="text-rig-muted" size={20} />}
            
            <p className="text-rig-text text-sm font-medium flex-1">{t.message}</p>
            
            <button 
              onClick={() => removeToast(t.id)} 
              className="text-rig-muted hover:text-rig-text transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
