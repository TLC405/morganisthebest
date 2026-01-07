import { ThemeVariant } from '@/contexts/ThemeVariantContext';

// Cinematic motion presets for different variants
export const motionPresets = {
  // Glass - Smooth, ethereal transitions
  glass: {
    enter: 'animate-fade-in-glass',
    exit: 'animate-fade-out-glass',
    hover: 'hover-lift-glass',
    stagger: 80,
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Neumorphic - Soft, tactile feel
  neumorphic: {
    enter: 'animate-spring-in',
    exit: 'animate-spring-out',
    hover: 'hover-soft',
    stagger: 60,
    duration: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  // Swiss - Minimal, precise
  swiss: {
    enter: 'animate-snap-in',
    exit: 'animate-snap-out',
    hover: 'hover-precise',
    stagger: 40,
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  // Luxe - Elegant, slow reveals
  luxe: {
    enter: 'animate-elegant-in',
    exit: 'animate-elegant-out',
    hover: 'hover-luxe',
    stagger: 120,
    duration: 700,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  // Flutter - Material springs
  flutter: {
    enter: 'animate-material-in',
    exit: 'animate-material-out',
    hover: 'hover-material',
    stagger: 50,
    duration: 350,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Brutal - Immediate, raw
  brutal: {
    enter: 'animate-brutal-in',
    exit: 'animate-brutal-out',
    hover: 'hover-brutal',
    stagger: 0,
    duration: 100,
    easing: 'linear',
  },
  // Editorial - Staggered reveals
  editorial: {
    enter: 'animate-editorial-in',
    exit: 'animate-editorial-out',
    hover: 'hover-editorial',
    stagger: 150,
    duration: 600,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  // Aurora - Flowing, wave-like
  aurora: {
    enter: 'animate-aurora-in',
    exit: 'animate-aurora-out',
    hover: 'hover-aurora',
    stagger: 70,
    duration: 450,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const getMotionPreset = (variant: ThemeVariant) => motionPresets[variant];

// Stagger delay calculator
export const getStaggerDelay = (index: number, variant: ThemeVariant): string => {
  const stagger = motionPresets[variant].stagger;
  return `${index * stagger}ms`;
};

// Card variant classes
export const cardVariantClasses: Record<ThemeVariant, string> = {
  glass: 'card-glass',
  neumorphic: 'card-neumorphic',
  swiss: 'card-swiss',
  luxe: 'card-luxe',
  flutter: 'card-flutter',
  brutal: 'card-brutal',
  editorial: 'card-editorial',
  aurora: 'card-aurora',
};

// Button variant classes
export const buttonVariantClasses: Record<ThemeVariant, string> = {
  glass: 'btn-glass',
  neumorphic: 'btn-neumorphic',
  swiss: 'btn-swiss',
  luxe: 'btn-luxe',
  flutter: 'btn-flutter',
  brutal: 'btn-brutal',
  editorial: 'btn-editorial',
  aurora: 'btn-aurora',
};

// Badge variant classes
export const badgeVariantClasses: Record<ThemeVariant, string> = {
  glass: 'badge-glass',
  neumorphic: 'badge-neumorphic',
  swiss: 'badge-swiss',
  luxe: 'badge-luxe',
  flutter: 'badge-flutter',
  brutal: 'badge-brutal',
  editorial: 'badge-editorial',
  aurora: 'badge-aurora',
};
