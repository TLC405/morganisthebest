import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
}

const icebreakers = [
  "What's your go-to weekend activity?",
  "Coffee or tea person? ☕",
  "What's the best concert you've been to?",
  "If you could travel anywhere right now, where?",
  "What's on your bucket list?",
];

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<{ name: string; photoUrl: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user || !conversationId) return;

    const fetchMessages = async () => {
      try {
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;

        setMessages(
          (msgData || []).map(m => ({
            id: m.id,
            content: m.content,
            senderId: m.sender_id,
            createdAt: m.created_at,
            readAt: m.read_at,
          }))
        );

        // Get conversation to find other user
        const { data: convData } = await supabase
          .from('conversations')
          .select('user_1_id, user_2_id')
          .eq('id', conversationId)
          .single();

        if (convData) {
          const otherUserId = convData.user_1_id === user.id 
            ? convData.user_2_id 
            : convData.user_1_id;
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, photo_url')
            .eq('id', otherUserId)
            .single();

          if (profileData) {
            setOtherUser({
              name: profileData.name,
              photoUrl: profileData.photo_url,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages(prev => [
            ...prev,
            {
              id: newMsg.id,
              content: newMsg.content,
              senderId: newMsg.sender_id,
              createdAt: newMsg.created_at,
              readAt: newMsg.read_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendIcebreaker = (question: string) => {
    setNewMessage(question);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate('/chats')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.photoUrl || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {otherUser?.name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-foreground">
            {otherUser?.name || 'Your Match'}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3 text-primary" />
            Matched at event
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              You matched! 🎉
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Break the ice with a fun question:
            </p>
            <div className="space-y-2 max-w-sm mx-auto">
              {icebreakers.map((question, i) => (
                <button
                  key={i}
                  onClick={() => sendIcebreaker(question)}
                  className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.senderId === user?.id
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {format(new Date(msg.createdAt), 'h:mm a')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
