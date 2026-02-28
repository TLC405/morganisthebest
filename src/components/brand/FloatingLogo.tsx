import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
}

export const FloatingLogo = ({ 
  size = 'md', 
  showTagline = true,
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
    },
    md: {
      container: 'p-6',
      icon: 'h-10 w-10',
      iconContainer: 'h-18 w-18',
      title: 'text-xl',
      okc: 'text-xl',
      tagline: 'text-[10px]',
    },
    lg: {
      container: 'p-8',
      icon: 'h-12 w-12',
      iconContainer: 'h-20 w-20',
      title: 'text-2xl',
      okc: 'text-2xl',
      tagline: 'text-xs',
    },
    hero: {
      container: 'p-10 md:p-12',
      icon: 'h-14 w-14 md:h-16 md:w-16',
      iconContainer: 'h-24 w-24 md:h-28 md:w-28',
      title: 'text-2xl md:text-3xl',
      okc: 'text-2xl md:text-3xl',
      tagline: 'text-xs md:text-sm',
    },
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={cn(
        'relative inline-flex flex-col items-center',
        'bg-card border-4 border-foreground shadow-brutal-lg',
        config.container,
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'mb-4 border-4 border-foreground bg-foreground flex items-center justify-center',
        config.iconContainer
      )}>
        <Compass className={cn(config.icon, 'text-background')} />
      </div>
      
      {/* Brand Name */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={cn('font-mono uppercase tracking-widest font-black text-foreground', config.title)}>
            INSPIRE
          </span>
          <span className={cn('font-mono uppercase tracking-widest font-black text-primary', config.okc)}>
            OKC
          </span>
        </div>
        
        {showTagline && (
          <p className={cn(
            'mt-2 uppercase tracking-[0.3em] text-muted-foreground font-bold font-mono',
            config.tagline
          )}>
            Cure Isolation. Get Out.
          </p>
        )}
      </div>
    </div>
  );
};

// Compact inline version for nav/footer
export const InlineBrand = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-2', className)}>
    <div className="h-8 w-8 border-2 border-foreground bg-foreground flex items-center justify-center">
      <Compass className="h-4 w-4 text-background" />
    </div>
    <div className="flex items-center gap-1">
      <span className="font-mono font-bold text-sm text-foreground uppercase tracking-wider">Inspire</span>
      <span className="font-mono font-bold text-sm text-primary uppercase tracking-wider">OKC</span>
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
      <span className="text-[12vw] md:text-[10vw] font-mono font-black tracking-tighter text-foreground/[0.02] uppercase">
        INSPIRE OKC
      </span>
    </div>
  </div>
);
