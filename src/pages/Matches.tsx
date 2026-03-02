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
import { 
  Heart, MessageCircle, Sparkles, Star, MapPin, 
  Calendar, CheckCircle, Send
} from 'lucide-react';

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
    setLoading(false);
    setMatches([]);
  };

  const mutualMatches = matches.filter((m) => m.is_mutual);
  const pendingWaves = matches.filter((m) => !m.is_mutual && m.status === 'pending');
  const sentWaves = matches.filter((m) => !m.is_mutual);

  const handleStartChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  const renderMatchCard = (match: Match, showActions = true, index = 0) => {
    const initials = match.profile.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

    return (
      <Card 
        key={match.id} 
        variant="elevated"
        className="group opacity-0 animate-fade-in-up overflow-hidden"
        style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
      >
        <CardContent className="p-0">
          {/* Photo Section */}
          <div className="relative aspect-[4/5] bg-muted">
            {match.profile.photo_url ? (
              <img
                src={match.profile.photo_url}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-bold text-foreground/30">{initials}</span>
              </div>
            )}

            {/* Top badges row */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex gap-2">
                {match.is_mutual && (
                  <Badge className="gap-1">
                    <Heart className="h-3 w-3 fill-current" />
                    Match!
                  </Badge>
                )}
                {match.profile.community_trusted && (
                  <Badge variant="warning" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                  </Badge>
                )}
              </div>
              
              {match.compatibility_score && (
                <CompatibilityRing score={match.compatibility_score} size="sm" />
              )}
            </div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
              <h3 className="text-2xl font-bold text-foreground">
                {match.profile.name}
                {match.profile.age && <span className="font-normal">, {match.profile.age}</span>}
              </h3>
              {match.profile.area && (
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
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

            {match.profile.interests && match.profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {match.profile.interests.slice(0, 3).map((interest, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {match.profile.interests.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{match.profile.interests.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {showActions && match.is_mutual && (
              <Button 
                className="w-full gap-2" 
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
            <div className="h-14 w-14 rounded-sm border-4 border-primary bg-primary flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Your Matches</h1>
              <p className="text-muted-foreground">
                Connect with people you've met at events
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="mutual" className="relative">
              <Heart className="h-4 w-4 mr-2" />
              Mutual
              {mutualMatches.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-none bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {mutualMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="received" className="relative">
              <Sparkles className="h-4 w-4 mr-2" />
              Received
              {pendingWaves.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-none bg-secondary text-[10px] font-bold flex items-center justify-center text-secondary-foreground">
                  {pendingWaves.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">
              <Send className="h-4 w-4 mr-2" />
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mutual">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-sm bg-muted animate-pulse" />
                ))}
              </div>
            ) : mutualMatches.length === 0 ? (
              <Card variant="elevated" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-sm border-4 border-primary/20 flex items-center justify-center mb-6">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 uppercase">No Matches Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    When someone you've waved to waves back, you'll see them here!
                  </p>
                  <Button size="lg" onClick={() => navigate('/events')}>
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
                  <div key={i} className="aspect-[4/5] rounded-sm bg-muted animate-pulse" />
                ))}
              </div>
            ) : pendingWaves.length === 0 ? (
              <Card variant="elevated" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-sm border-4 border-secondary/20 flex items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 uppercase">No Waves Yet</h3>
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
                  <div key={i} className="aspect-[4/5] rounded-sm bg-muted animate-pulse" />
                ))}
              </div>
            ) : sentWaves.length === 0 ? (
              <Card variant="elevated" className="animate-fade-in-up">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-sm border-4 border-accent/20 flex items-center justify-center mb-6">
                    <Send className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 uppercase">No Waves Sent</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Check in at events and enter someone's PIN to send them a wave!
                  </p>
                  <Button size="lg" onClick={() => navigate('/check-in')}>
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
