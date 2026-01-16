import { cn } from '@/lib/utils';

interface TLCBadgeProps {
  variant?: 'inline' | 'block' | 'minimal';
  className?: string;
}

export const TLCBadge = ({ variant = 'inline', className }: TLCBadgeProps) => {
  if (variant === 'minimal') {
    return (
      <span className={cn(
        'text-[10px] uppercase tracking-[0.15em] text-secondary font-semibold',
        className
      )}>
        Powered by TLC
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
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary/40" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold">
            Powered by TLC
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary/40" />
        </div>
        <p className="text-[10px] text-muted-foreground">
          A Trusted Local Community Experience
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
      <div className="h-px w-6 bg-secondary/30" />
      <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-semibold">
        Powered by TLC
      </span>
      <div className="h-px w-6 bg-secondary/30" />
    </div>
  );
};
