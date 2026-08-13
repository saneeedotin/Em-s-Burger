import React, { createContext, useContext, useState, useEffect } from 'react';

const VegModeContext = createContext();

export function useVegMode() {
  return useContext(VegModeContext);
}

export function VegModeProvider({ children }) {
  // Try to initialize from localStorage, default to false
  const [isVegOnly, setIsVegOnly] = useState(() => {
    const saved = localStorage.getItem('emBurger_vegOnly');
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('emBurger_vegOnly', JSON.stringify(isVegOnly));
  }, [isVegOnly]);

  const toggleVegMode = () => {
    setIsVegOnly((prev) => !prev);
  };

  const value = {
    isVegOnly,
    setIsVegOnly,
    toggleVegMode
  };

  return (
    <VegModeContext.Provider value={value}>
      {children}
    </VegModeContext.Provider>
  );
}
