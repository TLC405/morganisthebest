import { useState } from 'react';
import { Users, Sparkles, ShieldCheck, MessageCircle, Calendar, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConnectionsByEvent } from '@/hooks/useProfiles';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/use-toast';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import type { Profile } from '@/types/database';

const Connections = () => {
  const { toast } = useToast();
  const { profile } = useCurrentUser();
  const { connections, isLoading, error } = useConnectionsByEvent();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<string | null>(null);

  const totalConnections = connections.reduce((acc, ec) => acc + ec.profiles.length, 0);

  const handleWave = (profileId: string) => {
    const person = connections.flatMap(c => c.profiles).find(p => p.id === profileId);
    if (person) {
      toast({
        title: "Wave Sent! 👋",
        description: `${person.name} will be notified. If they wave back, you'll match!`,
      });
    }
  };

  const openFeedbackForEvent = (eventId: string) => {
    setSelectedEventForFeedback(eventId);
    setFeedbackModalOpen(true);
  };

  // Transform Profile to match ProfileCard expected type
  const transformProfile = (p: Profile) => ({
    id: p.id,
    name: p.name,
    age: p.age || 0,
    ageRange: '25-30' as const,
    area: (p.area || 'OKC') as any,
    bio: p.bio || '',
    interests: p.interests || [],
    interestTags: p.interests?.slice(0, 4) || [],
    photoUrl: p.photo_url || '',
    eventsAttended: [],
    role: 'single' as const,
    verificationLevel: (p.verification_level || 'pending') as any,
    responseRate: p.response_rate || 0,
    showUpRate: p.show_up_rate || 0,
    totalConnections: 0,
    religion: p.religion,
    lookingFor: p.looking_for as any,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

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

        {/* Stats */}
        <div className="mb-8 rounded-xl bg-muted p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalConnections}</p>
              <p className="text-sm text-muted-foreground">People You've Met</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{connections.length}</p>
              <p className="text-sm text-muted-foreground">Events Attended</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Total Waves Sent</p>
            </div>
          </div>
        </div>

        {/* No Events Attended */}
        {connections.length === 0 && (
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
        {connections.map((eventConnection) => (
          <div key={eventConnection.eventId} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {eventConnection.eventTitle}
                <Badge variant="secondary" className="ml-2">
                  {eventConnection.profiles.length} {eventConnection.profiles.length === 1 ? 'person' : 'people'}
                </Badge>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(eventConnection.eventDate).toLocaleDateString()}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openFeedbackForEvent(eventConnection.eventId)}
                  className="gap-2"
                >
                  <Star className="h-4 w-4" />
                  Leave Feedback
                </Button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {eventConnection.profiles.map((p) => (
                <ProfileCard 
                  key={p.id} 
                  profile={transformProfile(p)} 
                  onWave={handleWave}
                  forceReveal={true}
                />
              ))}
            </div>
          </div>
        ))}
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

export default Connections;
