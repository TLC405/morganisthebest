import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeVariant } from '@/contexts/ThemeVariantContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  onClick?: () => void;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp = true,
  description,
  onClick 
}: StatCardProps) => {
  const { variant } = useThemeVariant();

  const baseStyles = 'relative overflow-hidden rounded-2xl p-6 transition-all duration-300';
  
  const variantStyles = {
    glass: cn(
      'bg-card/60 backdrop-blur-xl border border-border/40',
      'shadow-[0_8px_32px_hsl(0_0%_0%/0.2)]',
      'hover:shadow-[0_20px_40px_hsl(var(--primary)/0.15)]',
      'hover:-translate-y-1'
    ),
    neumorphic: cn(
      'bg-[hsl(var(--card))]',
      'shadow-[6px_6px_12px_hsl(0_0%_0%/0.25),-6px_-6px_12px_hsl(var(--border)/0.1)]',
      'hover:shadow-[8px_8px_16px_hsl(0_0%_0%/0.3),-8px_-8px_16px_hsl(var(--border)/0.12)]'
    ),
    swiss: cn(
      'bg-card border-l-4 border-l-primary border border-border/20',
      'hover:border-l-secondary'
    ),
    luxe: cn(
      'bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(225_24%_6%)]',
      'border border-[hsl(45_30%_30%/0.3)]',
      'shadow-[0_0_40px_hsl(45_50%_40%/0.05)]',
      'hover:border-[hsl(45_50%_50%/0.4)]',
      'hover:shadow-[0_0_60px_hsl(45_50%_40%/0.1)]'
    ),
  };

  return (
    <div 
      className={cn(baseStyles, variantStyles[variant], onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      {/* Background gradient accent */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      )}
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className={cn(
            'text-sm font-medium',
            variant === 'swiss' ? 'uppercase tracking-wider text-muted-foreground' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          
          <p className={cn(
            'text-4xl font-bold tracking-tight',
            variant === 'luxe' ? 'text-[hsl(45_80%_60%)]' : 'text-foreground'
          )}>
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1.5">
              {trendUp ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                'text-sm font-medium',
                trendUp ? 'text-emerald-400' : 'text-destructive'
              )}>
                {trend}
              </span>
              {description && (
                <span className="text-xs text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={cn(
          'h-12 w-12 rounded-xl flex items-center justify-center',
          variant === 'glass' && 'bg-primary/10 shadow-inner',
          variant === 'neumorphic' && 'bg-muted shadow-[inset_2px_2px_4px_hsl(0_0%_0%/0.2),inset_-2px_-2px_4px_hsl(var(--border)/0.1)]',
          variant === 'swiss' && 'border-2 border-primary',
          variant === 'luxe' && 'bg-[hsl(45_30%_20%/0.3)] border border-[hsl(45_50%_40%/0.2)]'
        )}>
          <Icon className={cn(
            'h-6 w-6',
            variant === 'luxe' ? 'text-[hsl(45_70%_55%)]' : 'text-primary'
          )} />
        </div>
      </div>
    </div>
  );
};
