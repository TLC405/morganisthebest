import { cn } from '@/lib/utils';

interface InspireBadgeProps {
  variant?: 'inline' | 'block' | 'minimal';
  className?: string;
}

export const TLCBadge = ({ variant = 'inline', className }: InspireBadgeProps) => {
  if (variant === 'minimal') {
    return (
      <span className={cn(
        'text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono font-bold',
        className
      )}>
        Inspire Oklahoma City
      </span>
    );
  }

  if (variant === 'block') {
    return (
      <div className={cn(
        'flex flex-col items-center gap-2 py-4',
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-foreground" />
          <span className="text-xs uppercase tracking-[0.2em] text-foreground font-mono font-bold">
            Inspire OKC
          </span>
          <div className="h-px w-12 bg-foreground" />
        </div>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          Cure Isolation. Get Out.
        </p>
      </div>
    );
  }

  // Default inline
  return (
    <div className={cn(
      'inline-flex items-center gap-2',
      className
    )}>
      <div className="h-px w-6 bg-foreground" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground font-mono font-bold">
        Inspire OKC
      </span>
      <div className="h-px w-6 bg-foreground" />
    </div>
  );
};
