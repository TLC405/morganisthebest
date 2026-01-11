// Simplified animation utilities - no theme variants

// Simple stagger delay calculator
export const getStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};
