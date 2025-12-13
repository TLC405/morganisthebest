import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, MessageCircle, Sparkles, Star, MapPin, 
  Calendar, CheckCircle, Clock, Send, X
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
      // Fetch waves sent to/from current user
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

      // Get unique user IDs to fetch profiles
      const userIds = new Set<string>();
      waves?.forEach((wave) => {
        if (wave.from_user_id !== user.id) userIds.add(wave.from_user_id);
        if (wave.to_user_id !== user.id) userIds.add(wave.to_user_id);
      });

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, age, photo_url, area, bio, interests, community_trusted')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]));

      // Check for mutual waves
      const waveMap = new Map<string, typeof waves[0]>();
      waves?.forEach((wave) => {
        const key = [wave.from_user_id, wave.to_user_id].sort().join('-');
        if (waveMap.has(key)) {
          // This is a mutual wave
          const existing = waveMap.get(key)!;
          existing.status = 'accepted';
        } else {
          waveMap.set(key, wave);
        }
      });

      // Transform to matches
      const transformedMatches: Match[] = [];
      waveMap.forEach((wave, key) => {
        const otherId = wave.from_user_id === user.id ? wave.to_user_id : wave.from_user_id;
        const profile = profileMap.get(otherId);
        if (profile) {
          // Check if mutual
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

  const renderMatchCard = (match: Match, showActions = true) => {
    const initials = match.profile.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

    return (
      <Card 
        key={match.id} 
        className="border-border/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden"
      >
        <CardContent className="p-0">
          {/* Photo area */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
            {match.profile.photo_url ? (
              <img
                src={match.profile.photo_url}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground/50">{initials}</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {match.is_mutual && (
                <Badge className="bg-primary/90 text-primary-foreground">
                  <Heart className="h-3 w-3 mr-1 fill-current" />
                  Mutual
                </Badge>
              )}
              {match.profile.community_trusted && (
                <Badge className="bg-amber-500/90 text-white">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                </Badge>
              )}
            </div>

            {/* Compatibility score */}
            {match.compatibility_score && (
              <Badge 
                className={cn(
                  'absolute top-2 right-2',
                  match.compatibility_score >= 80 
                    ? 'bg-emerald-500/90' 
                    : match.compatibility_score >= 60 
                    ? 'bg-amber-500/90' 
                    : 'bg-muted/90'
                )}
              >
                {match.compatibility_score}% Match
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {match.profile.name}{match.profile.age && `, ${match.profile.age}`}
              </h3>
              {match.profile.area && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {match.profile.area}
                </p>
              )}
            </div>

            {match.profile.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {match.profile.bio}
              </p>
            )}

            {match.profile.interests && match.profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {match.profile.interests.slice(0, 3).map((interest, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {match.profile.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.profile.interests.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && match.is_mutual && (
              <Button 
                className="w-full" 
                onClick={() => handleStartChat(match.profile.id)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Your Matches
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with people you've met at events
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="mutual" className="relative">
              Mutual
              {mutualMatches.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary">
                  {mutualMatches.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="received" className="relative">
              Received
              {pendingWaves.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-secondary">
                  {pendingWaves.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="mutual">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : mutualMatches.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Mutual Matches Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    When someone you've waved to waves back, you'll see them here!
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Find Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mutualMatches.map((match) => renderMatchCard(match))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : pendingWaves.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Waves Received</h3>
                  <p className="text-muted-foreground">
                    Attend more events and make great impressions to receive waves!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingWaves.map((match) => renderMatchCard(match, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : sentWaves.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <Send className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Waves Sent</h3>
                  <p className="text-muted-foreground mb-6">
                    Check in at events and enter someone's PIN to send them a wave!
                  </p>
                  <Button onClick={() => navigate('/check-in')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentWaves.map((match) => renderMatchCard(match, false))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Matches;
