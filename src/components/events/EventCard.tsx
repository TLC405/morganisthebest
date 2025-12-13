import { Calendar, Clock, MapPin, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, userRSVPs, getEventCompatibility, getCompatibleSinglesCount } from '@/data/mockData';

interface EventCardProps {
  event: Event;
  onRSVP?: (eventId: string) => void;
}

const categoryStyles = {
  mixer: { bg: 'from-primary to-primary/80', label: 'Mixer', icon: '🎉' },
  'speed-dating': { bg: 'from-secondary to-secondary/80', label: 'Speed Dating', icon: '⚡' },
  activity: { bg: 'from-accent to-accent/80', label: 'Activity', icon: '🎳' },
  social: { bg: 'from-primary to-secondary', label: 'Social', icon: '✨' },
};

export const EventCard = ({ event, onRSVP }: EventCardProps) => {
  const isRSVPd = userRSVPs.some((r) => r.eventId === event.id);
  const spotsLeft = event.maxCapacity - event.attendeeCount;
  const compatibility = getEventCompatibility(event);
  const compatibleCount = getCompatibleSinglesCount(event.id);
  const category = categoryStyles[event.category];
  const spotsPercentage = (spotsLeft / event.maxCapacity) * 100;

  return (
    <Card variant="glass" className="group overflow-hidden transition-all duration-500 hover:shadow-glow-lg hover:-translate-y-1">
      {/* Event Image with Premium Overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge className={`absolute right-3 top-3 bg-gradient-to-r ${category.bg} text-white shadow-lg`}>
          <span className="mr-1">{category.icon}</span>
          {category.label}
        </Badge>

        {/* Compatibility Badge */}
        {compatibility > 0 && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-gradient">{compatibility}% Match</span>
          </div>
        )}

        {/* Spots Left Indicator */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between text-xs text-white/90">
            <span>{spotsLeft} spots left</span>
            <span>{event.attendeeCount}/{event.maxCapacity}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div 
              className={`h-full rounded-full transition-all ${
                spotsPercentage < 20 ? 'bg-destructive animate-pulse' : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${100 - spotsPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold text-foreground group-hover:text-gradient transition-all">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
            <Calendar className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-foreground">
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
            <Clock className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-foreground">{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground font-medium">{event.location}</span>
        </div>
        
        {/* Compatible Singles */}
        {compatibleCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 p-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <span className="font-semibold text-primary">{compatibleCount}</span>
              <span className="text-muted-foreground"> compatible singles attending</span>
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter>
        {isRSVPd ? (
          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white" disabled>
            <span className="mr-2">✓</span> RSVP Confirmed
          </Button>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary shadow-glow transition-all hover:shadow-glow-lg hover:scale-[1.02]" 
            onClick={() => onRSVP?.(event.id)}
          >
            RSVP Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
