import { useState } from 'react';
import { Users, Sparkles, Lock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProfiles, currentUser, canRevealProfile } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

type Filter = 'all' | 'revealed' | 'hidden';

const Community = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const { toast } = useToast();

  const revealedCount = mockProfiles.filter(p => canRevealProfile(p.id)).length;
  const hiddenCount = mockProfiles.length - revealedCount;

  const filteredProfiles = mockProfiles.filter(profile => {
    const isRevealed = canRevealProfile(profile.id);
    if (filter === 'revealed') return isRevealed;
    if (filter === 'hidden') return !isRevealed;
    return true;
  });

  const handleSpark = (profileId: string) => {
    const profile = mockProfiles.find(p => p.id === profileId);
    if (profile) {
      toast({
        title: "Spark Sent! ✨",
        description: `${profile.name} will be notified that you're interested!`,
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
            Browse profiles of singles in OKC. Meet at events to reveal their photos!
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
                <Sparkles className="h-3 w-3" /> Revealed to You
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground">{hiddenCount}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Still Hidden
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            You've attended {currentUser.eventsAttended.length} events
          </p>
        </div>

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
            Revealed ({revealedCount})
          </Button>
          <Button 
            variant={filter === 'hidden' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('hidden')}
            className="gap-1"
          >
            <Lock className="h-3 w-3" />
            Hidden ({hiddenCount})
          </Button>
        </div>

        {/* Profiles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onSpark={handleSpark}
            />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No profiles match this filter.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
