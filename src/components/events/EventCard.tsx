import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, userRSVPs } from '@/data/mockData';

interface EventCardProps {
  event: Event;
  onRSVP?: (eventId: string) => void;
}

const categoryColors = {
  mixer: 'bg-primary text-primary-foreground',
  'speed-dating': 'bg-secondary text-secondary-foreground',
  activity: 'bg-accent text-accent-foreground',
  social: 'bg-muted text-muted-foreground',
};

const categoryLabels = {
  mixer: 'Mixer',
  'speed-dating': 'Speed Dating',
  activity: 'Activity',
  social: 'Social',
};

export const EventCard = ({ event, onRSVP }: EventCardProps) => {
  const isRSVPd = userRSVPs.some((r) => r.eventId === event.id);
  const spotsLeft = event.maxCapacity - event.attendeeCount;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Badge className={`absolute right-3 top-3 ${categoryColors[event.category]}`}>
          {categoryLabels[event.category]}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          <span>{event.attendeeCount} attending · {spotsLeft} spots left</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter>
        {isRSVPd ? (
          <Button className="w-full" variant="secondary" disabled>
            ✓ RSVP Confirmed
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onRSVP?.(event.id)}>
            RSVP Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
