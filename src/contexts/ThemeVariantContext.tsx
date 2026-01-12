import { createContext, ReactNode, useContext } from 'react';

export type ThemeVariant = 'glass' | 'neumorphic' | 'swiss' | 'luxe';

interface ThemeVariantContextValue {
  variant: ThemeVariant;
}

const ThemeVariantContext = createContext<ThemeVariantContextValue>({
  variant: 'glass',
});

interface ThemeVariantProviderProps {
  children: ReactNode;
  variant?: ThemeVariant;
}

export const ThemeVariantProvider = ({
  children,
  variant = 'glass',
}: ThemeVariantProviderProps) => (
  <ThemeVariantContext.Provider value={{ variant }}>
    {children}
  </ThemeVariantContext.Provider>
);

export const useThemeVariant = () => useContext(ThemeVariantContext);
