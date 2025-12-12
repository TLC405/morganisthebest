import { VerificationLevel, getVerificationBadge } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  level: VerificationLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge = ({ level, showLabel = false, size = 'md' }: VerificationBadgeProps) => {
  const badge = getVerificationBadge(level);
  
  if (!badge) return null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-center gap-1 cursor-help', sizeClasses[size])}>
            <span>{badge.icon}</span>
            {showLabel && <span className={badge.color}>{badge.label}</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{badge.label}</p>
          <p className="text-xs text-muted-foreground">
            {level === 'trusted' && 'Attended 3+ events - highly trusted member'}
            {level === 'event' && 'Verified by attending a real event'}
            {level === 'photo' && 'Photo verified with live selfie'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
