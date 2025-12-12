import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface ConversationPreview {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
  eventName: string | null;
}

const Chats = () => {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            user_1_id,
            user_2_id,
            last_message_at,
            status
          `)
          .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
          .eq('status', 'active')
          .order('last_message_at', { ascending: false });

        if (error) throw error;

        // For now, return empty array since we don't have profiles data yet
        // In production, you'd join with profiles table
        const previews: ConversationPreview[] = (data || []).map(conv => ({
          id: conv.id,
          otherUser: {
            id: conv.user_1_id === user.id ? conv.user_2_id : conv.user_1_id,
            name: 'Match',
            photoUrl: null,
          },
          lastMessage: null,
          lastMessageAt: conv.last_message_at,
          unreadCount: 0,
          eventName: null,
        }));

        setConversations(previews);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('conversations-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Chats</h1>
          </div>
          <p className="text-muted-foreground">
            Your conversations with matched singles
          </p>
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Matches Yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                When you and someone else both enter each other's PIN at an event, 
                you'll match and a chat will appear here!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Conversations List */}
        <div className="space-y-3">
          {conversations.map(conv => (
            <Card 
              key={conv.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/chat/${conv.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={conv.otherUser.photoUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {conv.otherUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {conv.otherUser.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(conv.lastMessageAt), 'MMM d')}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage || 'Start the conversation!'}
                    </p>

                    {conv.eventName && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Met at {conv.eventName}
                      </Badge>
                    )}
                  </div>

                  {conv.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Chats;
