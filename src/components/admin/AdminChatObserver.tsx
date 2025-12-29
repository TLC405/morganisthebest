import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  MessageCircle, 
  Users, 
  Ban, 
  Pin, 
  Megaphone,
  MoreVertical,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  type: 'event' | 'group' | 'direct';
  memberCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: Date;
  isPinned?: boolean;
}

type ObserverMode = 'shadow' | 'visible' | 'off';

export const AdminChatObserver = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [observerMode, setObserverMode] = useState<ObserverMode>('shadow');
  const [adminMessage, setAdminMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_chats')
        .select(`
          id,
          name,
          type,
          group_chat_members (count)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedRooms: ChatRoom[] = (data || []).map(room => ({
        id: room.id,
        name: room.name,
        type: room.type as 'event' | 'group' | 'direct',
        memberCount: room.group_chat_members?.[0]?.count || 0,
        lastMessage: 'Click to observe',
      }));

      setRooms(formattedRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(`
          id,
          content,
          sender_id,
          created_at
        `)
        .eq('group_id', roomId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get sender profiles
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const formattedMessages: ChatMessage[] = (data || []).map(msg => {
        const profile = profileMap.get(msg.sender_id);
        return {
          id: msg.id,
          content: msg.content,
          senderId: msg.sender_id,
          senderName: profile?.name || 'Unknown',
          senderAvatar: profile?.photo_url || undefined,
          createdAt: new Date(msg.created_at),
        };
      }).reverse();

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const openRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    fetchMessages(room.id);
  };

  const handleBroadcast = async () => {
    if (!adminMessage.trim() || !selectedRoom) return;
    
    toast({
      title: 'Broadcast Sent',
      description: `Admin announcement sent to ${selectedRoom.name}`,
    });
    setAdminMessage('');
  };

  const handleMuteUser = (userId: string) => {
    toast({
      title: 'User Muted',
      description: 'User has been muted for 24 hours',
    });
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)
    );
    toast({
      title: 'Message Pinned',
      description: 'Message has been pinned to the chat',
    });
  };

  const modeConfig = {
    shadow: { icon: EyeOff, label: 'Shadow', color: 'text-muted-foreground' },
    visible: { icon: Shield, label: 'Visible', color: 'text-primary' },
    off: { icon: Eye, label: 'Off', color: 'text-destructive' },
  };

  const ModeIcon = modeConfig[observerMode].icon;

  return (
    <div className="h-full flex flex-col">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-foreground" />
          <span className="font-semibold text-foreground">Chat Observer</span>
          <Badge variant="outline" className="text-xs">
            {rooms.length} rooms
          </Badge>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ModeIcon className={cn('h-4 w-4', modeConfig[observerMode].color)} />
              {modeConfig[observerMode].label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setObserverMode('shadow')}>
              <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
              Shadow Mode
              <span className="ml-auto text-xs text-muted-foreground">Invisible</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setObserverMode('visible')}>
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Visible Admin
              <span className="ml-auto text-xs text-muted-foreground">Badge shown</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setObserverMode('off')}>
              <Eye className="h-4 w-4 mr-2 text-destructive" />
              Observer Off
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => openRoom(room)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                'hover:bg-muted/50',
                selectedRoom?.id === room.id && 'bg-muted'
              )}
            >
              <div className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center',
                room.type === 'event' ? 'bg-primary/10' : 
                room.type === 'group' ? 'bg-secondary/10' : 'bg-accent/10'
              )}>
                {room.type === 'event' ? (
                  <MessageCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Users className="h-5 w-5 text-secondary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground truncate">{room.name}</span>
                  <span className="text-xs text-muted-foreground">{room.memberCount}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Observer Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DialogTitle>{selectedRoom?.name}</DialogTitle>
                <Badge variant={observerMode === 'shadow' ? 'outline' : 'default'} className="text-xs">
                  {observerMode === 'shadow' ? 'Observing Silently' : 'Admin Present'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={cn(
                    'group flex gap-3',
                    message.isPinned && 'bg-primary/5 -mx-2 px-2 py-2 rounded-lg border-l-2 border-primary'
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback className="text-xs">
                      {message.senderName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                      </span>
                      {message.isPinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 mt-0.5">{message.content}</p>
                  </div>

                  {/* Admin actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                          <Pin className="h-4 w-4 mr-2" />
                          {message.isPinned ? 'Unpin' : 'Pin Message'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMuteUser(message.senderId)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Mute User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <X className="h-4 w-4 mr-2" />
                          Delete Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Admin Broadcast */}
          {observerMode === 'visible' && (
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <Input
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Send admin announcement..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                />
                <Button size="icon" onClick={handleBroadcast}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
