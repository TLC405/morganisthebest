import { Calendar, Clock, MapPin, Users, Sparkles, TrendingUp, Heart } from 'lucide-react';
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
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-glow-lg hover:-translate-y-2 border-0 bg-transparent">
      {/* Tinder-Style Full Photo Card */}
      <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Premium Gradient Overlay - Tinder Style */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
        
        {/* Top Badges Row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Category Badge */}
          <Badge className={`bg-gradient-to-r ${category.bg} text-white shadow-lg backdrop-blur-sm border-0`}>
            <span className="mr-1.5">{category.icon}</span>
            {category.label}
          </Badge>

          {/* Compatibility Ring */}
          {compatibility > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-md px-3 py-1.5 shadow-lg border border-border/50">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted/30"
                  />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="url(#compat-gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${compatibility * 0.88} 88`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="compat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </svg>
                <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">{compatibility}%</span>
            </div>
          )}
        </div>

        {/* Spots Progress Bar - Bottom of Image */}
        <div className="absolute bottom-24 left-4 right-4">
          <div className="flex items-center justify-between text-xs text-white/90 mb-1.5">
            <span className="font-medium">{spotsLeft} spots left</span>
            <span>{event.attendeeCount}/{event.maxCapacity}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                spotsPercentage < 20 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' 
                  : 'bg-gradient-to-r from-primary via-secondary to-accent'
              }`}
              style={{ width: `${100 - spotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Content Overlay - Hinge Style Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Clock className="h-4 w-4" />
              </div>
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          {/* Compatible Singles - Premium Pill */}
          {compatibleCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-white">
                {compatibleCount} compatible singles
              </span>
            </div>
          )}

          {/* CTA Buttons - Tinder Style */}
          <div className="flex items-center gap-3">
            {isRSVPd ? (
              <Button 
                className="flex-1 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg" 
                disabled
              >
                <span className="mr-2">✓</span> RSVP Confirmed
              </Button>
            ) : (
              <>
                <Button 
                  className="flex-1 h-12 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white border-0 shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all font-semibold" 
                  onClick={() => onRSVP?.(event.id)}
                >
                  RSVP Now
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-primary/80 hover:border-primary transition-all"
                  onClick={() => onRSVP?.(event.id)}
                >
                  <Heart className="h-5 w-5 text-white" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Swipe Hint Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-red-500/80 text-white px-4 py-2 rounded-lg font-bold rotate-[-15deg] opacity-0 group-hover:opacity-0">
            NOPE
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-500/80 text-white px-4 py-2 rounded-lg font-bold rotate-[15deg] opacity-0 group-hover:opacity-0">
            RSVP
          </div>
        </div>
      </div>
    </Card>
  );
};