import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CompatibilityRing } from '@/components/profiles/CompatibilityRing';
import { HingePrompt } from '@/components/profiles/HingePrompt';
import { 
  Heart, MessageCircle, Sparkles, Star, MapPin, 
  Calendar, CheckCircle, Send, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: string;
  profile: {
    id: string;
    name: string;
    age: number | null;
    photo_url: string | null;
    area: string | null;
    bio: string | null;
    interests: string[] | null;
    community_trusted: boolean | null;
  };
  compatibility_score: number | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  is_mutual: boolean;
  event_title?: string;
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mutual');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: waves, error } = await supabase
        .from('waves')
        .select(`
          id,
          status,
          compatibility_score,
          created_at,
          from_user_id,
          to_user_id,
          event_id
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userIds = new Set<string>();
      waves?.forEach((wave) => {
        if (wave.from_user_id !== user.id) userIds.add(wave.from_user_id);
        if (wave.to_user_id !== user.id) userIds.add(wave.to_user_id);
      });

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, age, photo_url, area, bio, interests, community_trusted')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]));

      const waveMap = new Map<string, typeof waves[0]>();
      waves?.forEach((wave) => {
        const key = [wave.from_user_id, wave.to_user_id].sort().join('-');
        if (waveMap.has(key)) {
          const existing = waveMap.get(key)!;
          existing.status = 'accepted';
        } else {
          waveMap.set(key, wave);
        }
      });

      const transformedMatches: Match[] = [];
      waveMap.forEach((wave) => {
        const otherId = wave.from_user_id === user.id ? wave.to_user_id : wave.from_user_id;
        const profile = profileMap.get(otherId);
        if (profile) {
          const reverseWave = waves?.find(
            (w) => w.from_user_id === otherId && w.to_user_id === user.id
          );
          const isMutual = !!reverseWave;

          transformedMatches.push({
            id: wave.id,
            profile,
            compatibility_score: wave.compatibility_score,
            status: isMutual ? 'accepted' : wave.status,
            created_at: wave.created_at || '',
            is_mutual: isMutual,
          });
        }
      });

      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load matches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const mutualMatches = matches.filter((m) => m.is_mutual);
  const pendingWaves = matches.filter((m) => !m.is_mutual && m.status === 'pending');
  const sentWaves = matches.filter((m) => !m.is_mutual);

  const handleStartChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  // Tinder/Hinge style photo-first match card
  const renderMatchCard = (match: Match, showActions = true, index = 0) => {
    const initials = match.profile.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

    return (
      <Card 
        key={match.id} 
        variant="photo-card"
        className="group opacity-0 animate-slide-up-spring"
        style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
      >
        <CardContent className="p-0">
          {/* Photo Section - Tinder style */}
          <div className="relative aspect-[4/5] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
            {match.profile.photo_url ? (
              <img
                src={match.profile.photo_url}
                alt={match.profile.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-bold text-foreground/30">{initials}</span>
              </div>
            )}
            
            {/* Photo gradient overlay */}
            <div className="absolute inset-0 photo-card-gradient" />

            {/* Top badges row */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex gap-2">
                {match.is_mutual && (
                  <Badge className="bg-primary/90 text-primary-foreground gap-1 shadow-lg animate-spring-bounce">
                    <Heart className="h-3 w-3 fill-current" />
                    Match!
                  </Badge>
                )}
                {match.profile.community_trusted && (
                  <Badge variant="warning" className="gap-1 shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                  </Badge>
                )}
              </div>
              
              {/* Compatibility ring */}
              {match.compatibility_score && (
                <CompatibilityRing score={match.compatibility_score} size="sm" />
              )}
            </div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-2xl font-bold text-white">
                {match.profile.name}
                {match.profile.age && <span className="font-normal">, {match.profile.age}</span>}
              </h3>
              {match.profile.area && (
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {match.profile.area}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {match.profile.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {match.profile.bio}
              </p>
            )}

            {/* Interests as pills */}
            {match.profile.interests && match.profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {match.profile.interests.slice(0, 3).map((interest, i) => (
                  <span key={i} className="interest-pill text-xs py-1 px-2.5">
                    {interest}
                  </span>
                ))}
                {match.profile.interests.length > 3 && (
                  <span className="interest-pill text-xs py-1 px-2.5">
                    +{match.profile.interests.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            {showActions && match.is_mutual && (
              <Button 
                variant="glow"
                className="w-full gap-2 rounded-xl animate-spring-bounce" 
                onClick={() => handleStartChat(match.profile.id)}
              >
                <MessageCircle className="h-4 w-4" />
                Start Chatting
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Matches</h1>
              <p className="text-muted-foreground">
                Connect with people you've met at events
              </p>
            </div>
          </div>
        </div>

        {/* Tabs - Tinder style segmented control */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md glass-strong border-0 p-1.5 rounded-2xl h-auto">
            <TabsTrigger 
              value="mutual" 
              className="relative rounded-xl py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all"
            >
              <Heart className="h-4 w-4 mr-2" />
              Mutual
              {mutualMatches.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground shadow-lg">
                  {mutualMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="received" 
              className="relative rounded-xl py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-glow-thunder transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Received
              {pendingWaves.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-secondary-foreground shadow-lg">
                  {pendingWaves.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="rounded-xl py-3 transition-all">
              <Send className="h-4 w-4 mr-2" />
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mutual">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl skeleton-shimmer" />
                ))}
              </div>
            ) : mutualMatches.length === 0 ? (
              <Card variant="glass" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full gradient-primary/20 flex items-center justify-center mb-6">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Matches Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    When someone you've waved to waves back, you'll see them here!
                  </p>
                  <Button variant="glow" size="lg" onClick={() => navigate('/events')}>
                    <Calendar className="h-5 w-5 mr-2" />
                    Find Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mutualMatches.map((match, index) => renderMatchCard(match, true, index))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl skeleton-shimmer" />
                ))}
              </div>
            ) : pendingWaves.length === 0 ? (
              <Card variant="glass" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Waves Yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Attend more events and make great impressions to receive waves!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pendingWaves.map((match, index) => renderMatchCard(match, false, index))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl skeleton-shimmer" />
                ))}
              </div>
            ) : sentWaves.length === 0 ? (
              <Card variant="glass" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                    <Send className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Waves Sent</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Check in at events and enter someone's PIN to send them a wave!
                  </p>
                  <Button variant="gradient" size="lg" onClick={() => navigate('/check-in')}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Check In Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sentWaves.map((match, index) => renderMatchCard(match, false, index))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Matches;
