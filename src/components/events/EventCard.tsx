import { Calendar, Clock, MapPin, Users, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useThemeVariant } from '@/contexts/ThemeVariantContext';
import { cn } from '@/lib/utils';
import { getStaggerDelay } from '@/lib/animations';

// Simple event type for display
interface DisplayEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  category: 'mixer' | 'speed-dating' | 'activity' | 'social';
  attendeeCount: number;
  maxCapacity: number;
  imageUrl: string;
}

interface EventCardProps {
  event: DisplayEvent;
  onRSVP?: (eventId: string) => void;
  index?: number;
  isRSVPd?: boolean;
}

const categoryStyles = {
  mixer: { bg: 'from-primary to-primary/80', label: 'Mixer', icon: '🎉' },
  'speed-dating': { bg: 'from-secondary to-secondary/80', label: 'Speed Dating', icon: '⚡' },
  activity: { bg: 'from-accent to-accent/80', label: 'Activity', icon: '🎳' },
  social: { bg: 'from-primary to-secondary', label: 'Social', icon: '✨' },
};

export const EventCard = ({ event, onRSVP, index = 0, isRSVPd = false }: EventCardProps) => {
  const { variant } = useThemeVariant();
  const spotsLeft = event.maxCapacity - event.attendeeCount;
  const category = categoryStyles[event.category];
  const spotsPercentage = (spotsLeft / event.maxCapacity) * 100;

  const variantCardStyles: Record<string, string> = {
    glass: 'card-variant bg-transparent backdrop-blur-xl border-0',
    neumorphic: 'card-variant bg-card border-0',
    swiss: 'card-variant bg-card',
    luxe: 'card-variant bg-card border-0',
    flutter: 'card-variant bg-card border-0',
    brutal: 'card-variant bg-card',
    editorial: 'card-variant bg-card',
    aurora: 'card-variant bg-transparent',
  };

  const variantImageStyles: Record<string, string> = {
    glass: 'rounded-2xl',
    neumorphic: 'rounded-[1.25rem]',
    swiss: 'rounded-none',
    luxe: 'rounded-lg',
    flutter: 'rounded-xl',
    brutal: 'rounded-none',
    editorial: 'rounded-sm',
    aurora: 'rounded-3xl',
  };

  const variantButtonStyles: Record<string, string> = {
    glass: 'btn-variant rounded-full',
    neumorphic: 'btn-variant rounded-2xl',
    swiss: 'btn-variant rounded-none uppercase tracking-wider text-sm',
    luxe: 'btn-variant rounded-lg font-playfair',
    flutter: 'btn-variant rounded-full',
    brutal: 'btn-variant rounded-none uppercase font-bold',
    editorial: 'btn-variant rounded-none uppercase tracking-widest text-xs',
    aurora: 'btn-variant rounded-full',
  };

  const staggerDelay = getStaggerDelay(index, variant);

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-500 hover:-translate-y-2',
        variantCardStyles[variant]
      )}
      style={{ animationDelay: staggerDelay }}
    >
      <div className={cn(
        'relative h-[420px] overflow-hidden shadow-xl',
        variantImageStyles[variant]
      )}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className={cn(
            'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
            variantImageStyles[variant]
          )}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
        
        {/* Top Badges Row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge className={cn(
            `bg-gradient-to-r ${category.bg} text-white shadow-lg border-0`,
            variant === 'brutal' && 'rounded-none border-2 border-foreground',
            variant === 'swiss' && 'rounded-none uppercase text-xs tracking-wider',
          )}>
            <span className="mr-1.5">{category.icon}</span>
            {category.label}
          </Badge>
        </div>

        {/* Spots Progress Bar */}
        <div className="absolute bottom-24 left-4 right-4">
          <div className="flex items-center justify-between text-xs text-white/90 mb-1.5">
            <span className={cn(
              'font-medium',
              variant === 'swiss' && 'uppercase tracking-wider text-[10px]',
              variant === 'brutal' && 'uppercase font-bold'
            )}>{spotsLeft} spots left</span>
            <span>{event.attendeeCount}/{event.maxCapacity}</span>
          </div>
          <div className={cn(
            'h-2 overflow-hidden bg-white/20 backdrop-blur-sm',
            variant === 'glass' && 'rounded-full',
            variant === 'neumorphic' && 'rounded-full',
            variant === 'swiss' && 'rounded-none',
            variant === 'luxe' && 'rounded-sm',
            variant === 'flutter' && 'rounded-full',
            variant === 'brutal' && 'rounded-none',
            variant === 'editorial' && 'rounded-none h-1',
            variant === 'aurora' && 'rounded-full',
          )}>
            <div 
              className={cn(
                'h-full transition-all duration-500',
                spotsPercentage < 20 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' 
                  : 'bg-gradient-to-r from-primary via-secondary to-accent',
              )}
              style={{ width: `${100 - spotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className={cn(
            'text-2xl font-bold text-white mb-3 drop-shadow-lg line-clamp-2',
            variant === 'luxe' && 'font-playfair text-3xl',
            variant === 'swiss' && 'font-inter uppercase tracking-tight',
            variant === 'brutal' && 'font-grotesk uppercase',
            variant === 'editorial' && 'font-sora font-light text-3xl'
          )}>
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center bg-white/20 backdrop-blur-sm',
                variant === 'glass' && 'rounded-full',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none',
                variant !== 'glass' && variant !== 'brutal' && variant !== 'swiss' && 'rounded-full'
              )}>
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className={cn(
                'flex h-8 w-8 items-center justify-center bg-white/20 backdrop-blur-sm',
                variant === 'glass' && 'rounded-full',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none',
                variant !== 'glass' && variant !== 'brutal' && variant !== 'swiss' && 'rounded-full'
              )}>
                <Clock className="h-4 w-4" />
              </div>
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center bg-white/20 backdrop-blur-sm',
                variant === 'glass' && 'rounded-full',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none',
                variant !== 'glass' && variant !== 'brutal' && variant !== 'swiss' && 'rounded-full'
              )}>
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isRSVPd ? (
              <Button 
                className={cn(
                  'flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg',
                  variantButtonStyles[variant]
                )} 
                disabled
              >
                <span className="mr-2">✓</span> RSVP Confirmed
              </Button>
            ) : (
              <>
                <Button 
                  className={cn(
                    'flex-1 h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white border-0 shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all font-semibold',
                    variantButtonStyles[variant]
                  )} 
                  onClick={() => onRSVP?.(event.id)}
                >
                  RSVP Now
                </Button>
                <Button
                  size="icon"
                  className={cn(
                    'h-12 w-12 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-primary/80 hover:border-primary transition-all',
                    variant === 'glass' && 'rounded-full',
                    variant === 'brutal' && 'rounded-none',
                    variant === 'swiss' && 'rounded-none',
                    variant !== 'glass' && variant !== 'brutal' && variant !== 'swiss' && 'rounded-full'
                  )}
                  onClick={() => onRSVP?.(event.id)}
                >
                  <Heart className="h-5 w-5 text-white" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
