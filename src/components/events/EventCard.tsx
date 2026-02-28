import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  mixer: { label: 'Mixer', icon: '🎉' },
  'speed-dating': { label: 'Speed Dating', icon: '⚡' },
  activity: { label: 'Activity', icon: '🎳' },
  social: { label: 'Social', icon: '✨' },
};

export const EventCard = ({ event, onRSVP, index = 0, isRSVPd = false }: EventCardProps) => {
  const spotsLeft = event.maxCapacity - event.attendeeCount;
  const category = categoryStyles[event.category];
  const spotsPercentage = (spotsLeft / event.maxCapacity) * 100;

  return (
    <Card 
      variant="brutal"
      className="group relative overflow-hidden"
    >
      <div className="relative h-[420px] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 photo-card-gradient" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge variant="default">
            <span className="mr-1.5">{category.icon}</span>
            {category.label}
          </Badge>
        </div>

        {/* Spots Progress */}
        <div className="absolute bottom-28 left-4 right-4">
          <div className="flex items-center justify-between text-xs text-foreground mb-2">
            <span className="font-medium">{spotsLeft} spots left</span>
            <span className="text-muted-foreground">{event.attendeeCount}/{event.maxCapacity}</span>
          </div>
          <div className="h-1.5 overflow-hidden bg-muted/50">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                spotsPercentage < 20 ? 'bg-destructive' : 'bg-primary',
              )}
              style={{ width: `${100 - spotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 text-foreground/90">
              <div className="flex h-8 w-8 items-center justify-center bg-muted border-2 border-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className="flex h-8 w-8 items-center justify-center bg-muted border-2 border-foreground">
                <Clock className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/90">
              <div className="flex h-8 w-8 items-center justify-center bg-muted border-2 border-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{event.location}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isRSVPd ? (
              <Button className="flex-1 h-12" variant="secondary" disabled>
                <span className="mr-2">✓</span> RSVP Confirmed
              </Button>
            ) : (
              <>
                <Button 
                  className="flex-1 h-12" 
                  onClick={() => onRSVP?.(event.id)}
                >
                  RSVP Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => onRSVP?.(event.id)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
