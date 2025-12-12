import { useState } from 'react';
import { Users, Sparkles, ShieldCheck, MessageCircle, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockProfiles, currentUser, canRevealProfile } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

type Filter = 'all' | 'revealed';

const Community = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const { toast } = useToast();

  const revealedProfiles = mockProfiles.filter(p => canRevealProfile(p.id));
  const mysteryProfiles = mockProfiles.filter(p => !canRevealProfile(p.id));
  
  const revealedCount = revealedProfiles.length;
  const mysteryCount = mysteryProfiles.length;

  const displayProfiles = filter === 'revealed' ? revealedProfiles : mockProfiles;

  const handleWave = (profileId: string) => {
    const profile = mockProfiles.find(p => p.id === profileId);
    if (profile) {
      toast({
        title: "Wave Sent! 👋",
        description: `${profile.name} will be notified. If they wave back, you'll match!`,
      });
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Singles Community</h1>
          </div>
          <p className="text-muted-foreground">
            Real people, real connections. Meet at events to reveal profiles.
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
            Every profile you see has been verified. No bots. No fakes. Just real OKC singles.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-8 rounded-xl bg-muted p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{mockProfiles.length}</p>
              <p className="text-sm text-muted-foreground">Total Singles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{revealedCount}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> People You've Met
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground">{mysteryCount}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                ✨ Mystery Singles
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            You've attended {currentUser.eventsAttended.length} events • Keep going to meet more!
          </p>
        </div>

        {/* No Events Attended CTA */}
        {currentUser.eventsAttended.length === 0 && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Ready to Start Meeting People?</h3>
              <p className="text-muted-foreground mb-4">
                Attend your first event to reveal profiles and start making real connections!
              </p>
              <Button asChild>
                <a href="/events">Find Your First Event</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({mockProfiles.length})
          </Button>
          <Button 
            variant={filter === 'revealed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('revealed')}
            className="gap-1"
          >
            <Sparkles className="h-3 w-3" />
            People You've Met ({revealedCount})
          </Button>
        </div>

        {/* People You've Met Section */}
        {filter === 'all' && revealedCount > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              People You've Met
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {revealedProfiles.map((profile) => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onWave={handleWave}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mystery Singles Section */}
        {filter === 'all' && mysteryCount > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ✨ Mystery Singles
              <span className="text-sm font-normal text-muted-foreground">
                (Attend an event to reveal!)
              </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mysteryProfiles.map((profile) => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onWave={handleWave}
                />
              ))}
            </div>
          </div>
        )}

        {/* Revealed Only View */}
        {filter === 'revealed' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProfiles.map((profile) => (
              <ProfileCard 
                key={profile.id} 
                profile={profile} 
                onWave={handleWave}
              />
            ))}
          </div>
        )}

        {displayProfiles.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">👀</div>
            <p className="text-muted-foreground mb-4">
              You haven't met anyone yet! Attend an event to start revealing profiles.
            </p>
            <Button asChild>
              <a href="/events">Browse Events</a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
