import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

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
  return (
    <Card 
      variant="elevated"
      className={cn("p-6 hover-lift", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1.5">
              {trendUp ? (
                <ArrowUpRight className="h-4 w-4 text-secondary" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                'text-sm font-medium',
                trendUp ? 'text-secondary' : 'text-destructive'
              )}>
                {trend}
              </span>
              {description && (
                <span className="text-xs text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="h-12 w-12 rounded-sm border-2 border-border flex items-center justify-center bg-muted/50">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
