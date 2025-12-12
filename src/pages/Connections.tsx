import { useState, useEffect } from 'react';
import { Users, Sparkles, ShieldCheck, MessageCircle, Calendar, Clock, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProfiles, currentUser, canRevealProfile, mockEvents, User } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';

interface EventConnection {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  profiles: User[];
}

const Connections = () => {
  const { toast } = useToast();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<string | null>(null);

  // Only show profiles from events you've attended
  const connectionsByEvent: EventConnection[] = currentUser.eventsAttended.map(eventId => {
    const event = mockEvents.find(e => e.id === eventId);
    const profilesFromEvent = mockProfiles.filter(profile => 
      profile.eventsAttended.includes(eventId)
    );
    
    return {
      eventId,
      eventTitle: event?.title || 'Unknown Event',
      eventDate: event?.date || '',
      profiles: profilesFromEvent,
    };
  }).filter(ec => ec.profiles.length > 0);

  const totalConnections = connectionsByEvent.reduce((acc, ec) => acc + ec.profiles.length, 0);

  const handleWave = (profileId: string) => {
    const profile = mockProfiles.find(p => p.id === profileId);
    if (profile) {
      toast({
        title: "Wave Sent! 👋",
        description: `${profile.name} will be notified. If they wave back, you'll match!`,
      });
    }
  };

  const openFeedbackForEvent = (eventId: string) => {
    setSelectedEventForFeedback(eventId);
    setFeedbackModalOpen(true);
  };

  // Check for recent events that need feedback (within 48 hours)
  const getRecentEventsNeedingFeedback = () => {
    const now = new Date();
    return currentUser.eventsAttended.filter(eventId => {
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) return false;
      
      const eventDate = new Date(event.date);
      const hoursSinceEvent = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceEvent >= 0 && hoursSinceEvent <= 48;
    });
  };

  const recentEventsForFeedback = getRecentEventsNeedingFeedback();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Connections</h1>
          </div>
          <p className="text-muted-foreground">
            People you've met at events. Real connections, real chemistry.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Social Singles OKC by TLC</p>
        </div>

        {/* Trust Badges Banner */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Zero Catfishing - All Verified
            </Badge>
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              Zero Ghosting - Response Tracking
            </Badge>
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <Calendar className="h-4 w-4 text-purple-500" />
              100% Real - Event Verified
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Every profile you see is someone you've met in person. No strangers. No catfish.
          </p>
        </div>

        {/* Feedback Window Alert */}
        {recentEventsForFeedback.length > 0 && (
          <Card className="mb-8 border-primary bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Feedback Window Open!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Help new members build trust by leaving feedback for people you met. This helps them earn their Community Trusted badge!
              </p>
              <div className="flex flex-wrap gap-2">
                {recentEventsForFeedback.map(eventId => {
                  const event = mockEvents.find(e => e.id === eventId);
                  return (
                    <Button 
                      key={eventId} 
                      size="sm" 
                      variant="outline"
                      onClick={() => openFeedbackForEvent(eventId)}
                      className="gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Leave feedback for {event?.title}
                    </Button>
                  );
                })}
              </div>
              <FeedbackCountdown />
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mb-8 rounded-xl bg-muted p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalConnections}</p>
              <p className="text-sm text-muted-foreground">People You've Met</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{currentUser.eventsAttended.length}</p>
              <p className="text-sm text-muted-foreground">Events Attended</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{currentUser.totalConnections}</p>
              <p className="text-sm text-muted-foreground">Total Waves Sent</p>
            </div>
          </div>
        </div>

        {/* No Events Attended */}
        {currentUser.eventsAttended.length === 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-2">Ready to Start Meeting People?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Attend your first event to start making real connections! 
                You can only see profiles of people you've actually met in person.
              </p>
              <Button size="lg" asChild>
                <a href="/events">Find Your First Event</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Connections by Event */}
        {connectionsByEvent.map((eventConnection) => (
          <div key={eventConnection.eventId} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {eventConnection.eventTitle}
                <Badge variant="secondary" className="ml-2">
                  {eventConnection.profiles.length} {eventConnection.profiles.length === 1 ? 'person' : 'people'}
                </Badge>
              </h2>
              <span className="text-sm text-muted-foreground">
                {new Date(eventConnection.eventDate).toLocaleDateString()}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {eventConnection.profiles.map((profile) => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onWave={handleWave}
                  forceReveal={true}
                />
              ))}
            </div>
          </div>
        ))}

        {currentUser.eventsAttended.length > 0 && totalConnections === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">🤔</div>
            <p className="text-muted-foreground mb-4">
              Looks like no one else was at those events yet. Keep attending to meet new people!
            </p>
            <Button asChild>
              <a href="/events">Find More Events</a>
            </Button>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        eventId={selectedEventForFeedback}
      />
    </Layout>
  );
};

// Countdown component for feedback window
const FeedbackCountdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      // Mock: assuming event was 24 hours ago, 24 hours left
      const hoursLeft = 24;
      const minutesLeft = 0;
      setTimeLeft(`${hoursLeft}h ${minutesLeft}m remaining`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>Feedback window closes in: <strong className="text-foreground">{timeLeft}</strong></span>
    </div>
  );
};

export default Connections;
