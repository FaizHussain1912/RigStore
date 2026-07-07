'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  formatPrice: (priceInPKR: number) => string;
  exchangeRate: number | null;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'PKR',
  formatPrice: (p) => `Rs. ${p.toLocaleString()}`,
  exchangeRate: null,
});

export const CurrencyProvider = ({ 
  children, 
  initialCurrency = 'PKR' 
}: { 
  children: React.ReactNode, 
  initialCurrency?: string 
}) => {
  const [currency, setCurrency] = useState(initialCurrency);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Fetch exchange rate on mount
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/PKR')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.USD) {
          setExchangeRate(data.rates.USD);
        }
      })
      .catch(err => {
        console.error('Failed to fetch exchange rates:', err);
        // Fallback approximate rate if API fails (e.g. 1 PKR = 0.0036 USD)
        setExchangeRate(0.0036);
      });
  }, []);

  // Update if initialCurrency prop changes (e.g. admin switches it)
  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const formatPrice = (priceInPKR: number) => {
    // Basic protection against null/undefined
    const value = priceInPKR || 0;

    if (currency === 'USD') {
      const rate = exchangeRate || 0.0036;
      const converted = value * rate;
      return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // Default PKR formatting
    return `Rs. ${value.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
