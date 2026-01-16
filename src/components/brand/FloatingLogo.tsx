import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  showTLC?: boolean;
  className?: string;
}

export const FloatingLogo = ({ 
  size = 'md', 
  showTagline = true,
  showTLC = true,
  className 
}: FloatingLogoProps) => {
  const sizeConfig = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8',
      iconContainer: 'h-14 w-14',
      title: 'text-lg',
      okc: 'text-lg',
      tagline: 'text-[9px]',
      tlc: 'text-[8px]',
    },
    md: {
      container: 'p-6',
      icon: 'h-10 w-10',
      iconContainer: 'h-18 w-18',
      title: 'text-xl',
      okc: 'text-xl',
      tagline: 'text-[10px]',
      tlc: 'text-[9px]',
    },
    lg: {
      container: 'p-8',
      icon: 'h-12 w-12',
      iconContainer: 'h-20 w-20',
      title: 'text-2xl',
      okc: 'text-2xl',
      tagline: 'text-xs',
      tlc: 'text-[10px]',
    },
    hero: {
      container: 'p-10 md:p-12',
      icon: 'h-14 w-14 md:h-16 md:w-16',
      iconContainer: 'h-24 w-24 md:h-28 md:w-28',
      title: 'text-2xl md:text-3xl',
      okc: 'text-2xl md:text-3xl',
      tagline: 'text-xs md:text-sm',
      tlc: 'text-[10px] md:text-xs',
    },
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={cn(
        'relative inline-flex flex-col items-center',
        'bg-card/95 backdrop-blur-xl',
        'rounded-3xl border border-border/50',
        'shadow-depth-lg',
        'animate-float',
        config.container,
        className
      )}
      style={{
        boxShadow: `
          0 25px 50px -12px hsl(220 20% 50% / 0.15),
          0 0 0 1px hsl(var(--border) / 0.5),
          0 0 80px hsl(var(--primary) / 0.08)
        `,
      }}
    >
      {/* Subtle glow behind card */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent blur-2xl scale-110" />
      
      {/* Heart Icon */}
      <div className={cn(
        'mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow',
        config.iconContainer
      )}>
        <Heart className={cn(config.icon, 'text-primary-foreground')} fill="currentColor" />
      </div>
      
      {/* Brand Name */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={cn('font-black tracking-tight text-foreground', config.title)}>
            SOCIAL SINGLES
          </span>
          <span className={cn('font-black text-primary', config.okc)}>
            OKC
          </span>
        </div>
        
        {showTagline && (
          <p className={cn(
            'mt-1 uppercase tracking-[0.25em] text-muted-foreground font-medium',
            config.tagline
          )}>
            Where Science Meets Chemistry
          </p>
        )}
        
        {showTLC && (
          <div className={cn(
            'mt-4 pt-4 border-t border-border/50',
            'flex items-center justify-center gap-2'
          )}>
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/50" />
            <span className={cn(
              'uppercase tracking-[0.2em] text-secondary font-semibold',
              config.tlc
            )}>
              Powered by TLC
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/50" />
          </div>
        )}
      </div>
    </div>
  );
};

// Compact inline version for nav/footer
export const InlineBrand = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-2', className)}>
    <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
      <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className="font-bold text-sm text-foreground">Social Singles</span>
        <span className="font-bold text-sm text-primary">OKC</span>
      </div>
    </div>
  </div>
);

// Background watermark text
export const BrandWatermark = ({ className }: { className?: string }) => (
  <div className={cn(
    'absolute inset-0 overflow-hidden pointer-events-none select-none',
    className
  )}>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
      <span className="text-[12vw] md:text-[10vw] font-black tracking-tighter text-foreground/[0.02] uppercase">
        Social Singles OKC
      </span>
    </div>
  </div>
);
