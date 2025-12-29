import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeVariant = 'glass' | 'neumorphic' | 'swiss' | 'luxe';

interface ThemeVariantContextType {
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
}

const ThemeVariantContext = createContext<ThemeVariantContextType | undefined>(undefined);

export const ThemeVariantProvider = ({ children }: { children: React.ReactNode }) => {
  const [variant, setVariant] = useState<ThemeVariant>(() => {
    const stored = localStorage.getItem('theme-variant');
    return (stored as ThemeVariant) || 'glass';
  });

  useEffect(() => {
    localStorage.setItem('theme-variant', variant);
    document.documentElement.setAttribute('data-variant', variant);
  }, [variant]);

  return (
    <ThemeVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </ThemeVariantContext.Provider>
  );
};

export const useThemeVariant = () => {
  const context = useContext(ThemeVariantContext);
  if (!context) {
    throw new Error('useThemeVariant must be used within ThemeVariantProvider');
  }
  return context;
};
