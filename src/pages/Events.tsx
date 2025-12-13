import { useState, useEffect } from 'react';
import { Calendar, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockEvents, Event } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Category = 'all' | 'mixer' | 'speed-dating' | 'activity' | 'social';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'mixer', label: 'Mixers' },
  { value: 'speed-dating', label: 'Speed Dating' },
  { value: 'activity', label: 'Activities' },
  { value: 'social', label: 'Social' },
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [rsvpDialog, setRsvpDialog] = useState<{ open: boolean; event: Event | null }>({
    open: false,
    event: null,
  });
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if profile is complete
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

    if (!isLoading) {
      checkProfile();
    }
  }, [user, isLoading]);

  const filteredEvents = selectedCategory === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === selectedCategory);

  const handleRSVP = (eventId: string) => {
    // Check auth first
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP for events.",
      });
      navigate('/auth');
      return;
    }

    // Check profile completion
    if (!profileComplete) {
      toast({
        title: "Complete your profile",
        description: "Please complete your profile before RSVPing.",
      });
      navigate('/profile');
      return;
    }

    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      setRsvpDialog({ open: true, event });
    }
  };

  const confirmRSVP = async () => {
    if (!user || !rsvpDialog.event) return;

    // Generate a nametag PIN for the user
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    // Create attendance record (door code handled by admin/team)
    const { error } = await supabase.from('event_attendance').insert({
      user_id: user.id,
      event_id: rsvpDialog.event.id,
      rsvp_status: 'going',
      nametag_pin: pin,
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

  return (
    <Layout>
      {/* Warm gradient header with animation */}
      <div className="gradient-hero border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 gradient-spotlight pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-12 relative">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
            <div className="h-12 w-12 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
              <p className="text-muted-foreground">
                Find your next opportunity to meet amazing singles in OKC
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Profile completion prompt */}
        {user && profileComplete === false && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 p-4 flex items-center justify-between animate-fade-in-up shadow-inner-glow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium">
                Complete your profile to RSVP for events!
              </p>
            </div>
            <Button size="sm" variant="glow" onClick={() => navigate('/profile')}>
              Complete Profile
            </Button>
          </div>
        )}

        {/* Category Filter with premium badges */}
        <div className="mb-8 flex flex-wrap items-center gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'glow' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Events Grid with stagger animation */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 80 + 150}ms`, animationFillMode: 'forwards' }}
            >
              <EventCard event={event} onRSVP={handleRSVP} />
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center animate-fade-in-up">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No events in this category yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* RSVP Confirmation Dialog with premium styling */}
      <Dialog open={rsvpDialog.open} onOpenChange={(open) => setRsvpDialog({ ...rsvpDialog, open })}>
        <DialogContent className="sm:max-w-md glass border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              Confirm Your RSVP
            </DialogTitle>
            <DialogDescription>
              Ready to join {rsvpDialog.event?.title}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-2xl gradient-premium p-6 text-center shadow-inner-glow">
              <p className="text-lg font-semibold text-foreground mb-2">
                {rsvpDialog.event?.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {rsvpDialog.event?.date} at {rsvpDialog.event?.time}
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Show up, check in at the door, and meet amazing people!
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={() => setRsvpDialog({ open: false, event: null })}
              >
                Cancel
              </Button>
              <Button variant="glow" className="flex-1 rounded-xl" onClick={confirmRSVP}>
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
