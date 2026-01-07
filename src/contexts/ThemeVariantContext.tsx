import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeVariant = 
  | 'glass' 
  | 'neumorphic' 
  | 'swiss' 
  | 'luxe' 
  | 'flutter' 
  | 'brutal' 
  | 'editorial' 
  | 'aurora';

export interface VariantConfig {
  id: ThemeVariant;
  label: string;
  description: string;
  font: string;
  radius: string;
  spacing: string;
  motion: 'minimal' | 'spring' | 'cinematic' | 'immediate';
}

export const variantConfigs: Record<ThemeVariant, VariantConfig> = {
  glass: {
    id: 'glass',
    label: 'Glass',
    description: 'Frosted depth layers',
    font: 'Poppins',
    radius: '16px',
    spacing: '16px',
    motion: 'cinematic',
  },
  neumorphic: {
    id: 'neumorphic',
    label: 'Soft',
    description: 'Tactile soft UI',
    font: 'Inter',
    radius: '20px',
    spacing: '16px',
    motion: 'spring',
  },
  swiss: {
    id: 'swiss',
    label: 'Swiss',
    description: 'Clean typography',
    font: 'Inter',
    radius: '4px',
    spacing: '12px',
    motion: 'minimal',
  },
  luxe: {
    id: 'luxe',
    label: 'Luxe',
    description: 'Dark & premium',
    font: 'Playfair Display',
    radius: '8px',
    spacing: '20px',
    motion: 'cinematic',
  },
  flutter: {
    id: 'flutter',
    label: 'Flutter',
    description: 'Material 3 inspired',
    font: 'Roboto',
    radius: '12px',
    spacing: '16px',
    motion: 'spring',
  },
  brutal: {
    id: 'brutal',
    label: 'Brutal',
    description: 'Raw industrial',
    font: 'Space Grotesk',
    radius: '0px',
    spacing: '8px',
    motion: 'immediate',
  },
  editorial: {
    id: 'editorial',
    label: 'Editorial',
    description: 'Magazine luxury',
    font: 'Sora',
    radius: '2px',
    spacing: '24px',
    motion: 'cinematic',
  },
  aurora: {
    id: 'aurora',
    label: 'Aurora',
    description: 'Vibrant gradients',
    font: 'DM Sans',
    radius: '24px',
    spacing: '16px',
    motion: 'spring',
  },
};

interface ThemeVariantContextType {
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  config: VariantConfig;
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

  const config = variantConfigs[variant];

  return (
    <ThemeVariantContext.Provider value={{ variant, setVariant, config }}>
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
