import { useState, useEffect } from 'react';
import { Calendar, Sparkles, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { EventWithVenue } from '@/types/database';

type Category = 'all' | 'mixer' | 'speed-dating' | 'activity' | 'social';

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'mixer', label: 'Mixers', emoji: '🎉' },
  { value: 'speed-dating', label: 'Speed Dating', emoji: '⚡' },
  { value: 'activity', label: 'Activities', emoji: '🎳' },
  { value: 'social', label: 'Social', emoji: '💫' },
];

// Map database events to display format
const mapEventForDisplay = (event: EventWithVenue) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  time: event.start_time,
  location: event.venues?.name || 'TBD',
  description: event.description || '',
  category: 'mixer' as const, // Default, could be added to DB
  attendeeCount: 0,
  maxCapacity: event.max_attendees || 50,
  imageUrl: 'https://images.unsplash.com/photo-1529543544277-068cc8eda7b4?w=800',
});

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [rsvpDialog, setRsvpDialog] = useState<{ open: boolean; event: ReturnType<typeof mapEventForDisplay> | null }>({
    open: false,
    event: null,
  });
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { events: dbEvents, isLoading: eventsLoading } = useUpcomingEvents();

  const events = dbEvents.map(mapEventForDisplay);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setProfileComplete(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('name, age, area')
        .eq('id', user.id)
        .single();

      if (data && data.name && data.age && data.area) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    };

    if (!authLoading) {
      checkProfile();
    }
  }, [user, authLoading]);

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const featuredEvents = events.slice(0, 3);

  const handleRSVP = (eventId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP for events.",
      });
      navigate('/auth');
      return;
    }

    if (!profileComplete) {
      toast({
        title: "Complete your profile",
        description: "Please complete your profile before RSVPing.",
      });
      navigate('/profile');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (event) {
      setRsvpDialog({ open: true, event });
    }
  };

  const confirmRSVP = async () => {
    if (!user || !rsvpDialog.event) return;

    // PIN is automatically generated server-side by the database trigger (set_nametag_pin)
    // using the generate_event_pin() function for better security
    const { error } = await supabase.from('event_attendance').insert({
      user_id: user.id,
      event_id: rsvpDialog.event.id,
      rsvp_status: 'going',
    });

    if (error) {
      toast({
        title: "RSVP Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "You're all set! 🎉",
      description: "We'll see you at the event!",
    });
    setRsvpDialog({ open: false, event: null });
  };

  if (eventsLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-48 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[420px]" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="gradient-hero border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 gradient-spotlight pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-10 relative">
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="h-14 w-14 atomic-border bg-primary flex items-center justify-center">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono-loud uppercase tracking-tight">Upcoming Events</h1>
              <p className="text-muted-foreground">Find your next opportunity to meet amazing singles</p>
            </div>
          </div>

          {/* Story-style carousel for featured events */}
          {featuredEvents.length > 0 && (
            <div className="story-carousel -mx-4 px-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {featuredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="story-item flex-shrink-0 w-32 cursor-pointer group"
                  onClick={() => handleRSVP(event.id)}
                >
                  <div className="story-ring p-0.5 mb-2">
                    <div className="rounded-full overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-center font-medium text-foreground line-clamp-2">{event.title}</p>
                  <p className="text-[10px] text-center text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
        {/* Profile completion prompt */}
        {user && profileComplete === false && (
          <Card variant="accent" className="mb-6 animate-fade-in-up">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Complete your profile</p>
                  <p className="text-sm text-muted-foreground">Required to RSVP for events</p>
                </div>
              </div>
              <Button variant="premium" onClick={() => navigate('/profile')}>
                Complete
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`interest-pill ${selectedCategory === cat.value ? 'selected' : ''}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="opacity-0 animate-slide-up-spring"
              style={{ animationDelay: `${index * 80 + 200}ms`, animationFillMode: 'forwards' }}
            >
              <EventCard event={event} onRSVP={handleRSVP} />
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center animate-fade-in-up">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">Check back soon for new events!</p>
          </div>
        )}
      </div>

      {/* RSVP Dialog */}
      <Dialog open={rsvpDialog.open} onOpenChange={(open) => setRsvpDialog({ ...rsvpDialog, open })}>
        <DialogContent className="sm:max-w-md glass-strong border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              Confirm Your RSVP
            </DialogTitle>
            <DialogDescription>
              Ready to join {rsvpDialog.event?.title}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-2xl overflow-hidden">
              {rsvpDialog.event?.imageUrl && (
                <div className="relative h-32">
                  <img 
                    src={rsvpDialog.event.imageUrl} 
                    alt={rsvpDialog.event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 photo-card-gradient" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-lg font-bold text-white">{rsvpDialog.event?.title}</p>
                    <p className="text-sm text-white/80">{rsvpDialog.event?.date} at {rsvpDialog.event?.time}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Show up, check in, and meet amazing people!</span>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={() => setRsvpDialog({ open: false, event: null })}
              >
                Cancel
              </Button>
              <Button 
                variant="premium" 
                className="flex-1 rounded-xl" 
                onClick={confirmRSVP}
              >
                I'm In! 🎉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;
