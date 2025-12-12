import { cn } from '@/lib/utils';
import { Heart, Flame, Sparkles } from 'lucide-react';

interface CompatibilityBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showReasons?: boolean;
  reasons?: string[];
}

export const CompatibilityBadge = ({ 
  percentage, 
  size = 'md',
  showReasons = false,
  reasons = []
}: CompatibilityBadgeProps) => {
  // Determine badge style based on percentage
  const getBadgeStyle = () => {
    if (percentage >= 85) {
      return {
        bgClass: 'bg-gradient-to-r from-rose-500 to-pink-500',
        textClass: 'text-white',
        icon: Flame,
        label: 'Perfect Match!',
      };
    }
    if (percentage >= 70) {
      return {
        bgClass: 'bg-gradient-to-r from-primary to-primary/80',
        textClass: 'text-primary-foreground',
        icon: Heart,
        label: 'Great Match',
      };
    }
    if (percentage >= 50) {
      return {
        bgClass: 'bg-gradient-to-r from-amber-400 to-orange-400',
        textClass: 'text-white',
        icon: Sparkles,
        label: 'Good Vibes',
      };
    }
    return {
      bgClass: 'bg-muted',
      textClass: 'text-muted-foreground',
      icon: Sparkles,
      label: 'Explore',
    };
  };
  
  const style = getBadgeStyle();
  const Icon = style.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };
  
  return (
    <div className="flex flex-col items-start gap-1">
      <div
        className={cn(
          'inline-flex items-center rounded-full font-semibold',
          style.bgClass,
          style.textClass,
          sizeClasses[size]
        )}
      >
        <Icon size={iconSizes[size]} className="animate-pulse" />
        <span>{percentage}%</span>
        {size === 'lg' && <span className="ml-1">{style.label}</span>}
      </div>
      
      {showReasons && reasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {reasons.map((reason, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
