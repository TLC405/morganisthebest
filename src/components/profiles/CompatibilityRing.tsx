import { cn } from '@/lib/utils';

interface CompatibilityRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CompatibilityRing = ({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: CompatibilityRingProps) => {
  const sizes = {
    sm: { container: 40, stroke: 3, fontSize: 'text-xs' },
    md: { container: 56, stroke: 4, fontSize: 'text-sm' },
    lg: { container: 80, stroke: 5, fontSize: 'text-lg' },
  };

  const { container, stroke, fontSize } = sizes[size];
  const radius = (container - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'hsl(var(--primary))';
    if (score >= 60) return 'hsl(var(--accent))';
    if (score >= 40) return 'hsl(var(--secondary))';
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: container, height: container }}>
      <svg width={container} height={container} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          className="stroke-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke={getColor()}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showLabel && (
        <span className={cn("absolute font-bold", fontSize)}>
          {score}%
        </span>
      )}
    </div>
  );
};
