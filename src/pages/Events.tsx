import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockEvents, generateDoorCode, Event } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

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
  const [rsvpDialog, setRsvpDialog] = useState<{ open: boolean; event: Event | null; code: string }>({
    open: false,
    event: null,
    code: '',
  });
  const { toast } = useToast();

  const filteredEvents = selectedCategory === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === selectedCategory);

  const handleRSVP = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      const code = generateDoorCode();
      setRsvpDialog({ open: true, event, code });
    }
  };

  const confirmRSVP = () => {
    toast({
      title: "RSVP Confirmed! 🎉",
      description: `Your door code is ${rsvpDialog.code}. Save it for check-in!`,
    });
    setRsvpDialog({ open: false, event: null, code: '' });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
          </div>
          <p className="text-muted-foreground">
            Find your next opportunity to meet amazing singles in OKC
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No events in this category yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* RSVP Confirmation Dialog */}
      <Dialog open={rsvpDialog.open} onOpenChange={(open) => setRsvpDialog({ ...rsvpDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RSVP Confirmed! 🎉</DialogTitle>
            <DialogDescription>
              You're all set for {rsvpDialog.event?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Door Code</p>
              <p className="text-3xl font-bold text-primary tracking-wider">{rsvpDialog.code}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Save this code! You'll need it to check in at the event entrance.
            </p>
            <Button className="w-full" onClick={confirmRSVP}>
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;
