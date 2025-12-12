import { MessageCircle, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ResponseStatsProps {
  responseRate: number;
  showUpRate: number;
  className?: string;
}

const getRateColor = (rate: number) => {
  if (rate >= 90) return 'text-green-500';
  if (rate >= 70) return 'text-yellow-500';
  return 'text-red-500';
};

const getRateLabel = (rate: number) => {
  if (rate >= 90) return 'Excellent';
  if (rate >= 70) return 'Good';
  return 'Low';
};

export const ResponseStats = ({ responseRate, showUpRate, className }: ResponseStatsProps) => {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-3 text-xs', className)}>
        {/* Response Rate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <MessageCircle className="h-3 w-3" />
              <span className={getRateColor(responseRate)}>{responseRate}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Response Rate: {responseRate}%</p>
            <p className="text-xs text-muted-foreground">
              {getRateLabel(responseRate)} - Responds to {responseRate}% of connections
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Show Up Rate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <Calendar className="h-3 w-3" />
              <span className={getRateColor(showUpRate)}>{showUpRate}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Show-up Rate: {showUpRate}%</p>
            <p className="text-xs text-muted-foreground">
              {getRateLabel(showUpRate)} - Shows up to {showUpRate}% of RSVPs
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
