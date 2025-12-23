import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatThread } from '@/components/chat/ChatThread';
import { CreateGroupModal } from '@/components/chat/CreateGroupModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatPreview {
  id: string;
  type: 'direct' | 'event' | 'match_group' | 'friend_group';
  name: string;
  photoUrl?: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
  memberCount?: number;
  isOnline?: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt: string;
  type: 'text' | 'image' | 'system';
}

const Messages = () => {
  const { chatId, chatType } = useParams<{ chatId?: string; chatType?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; name: string; photoUrl?: string }[]>([]);

  // Fetch all chats (direct + groups)
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        // Fetch direct conversations
        const { data: directChats } = await supabase
          .from('conversations')
          .select('id, user_1_id, user_2_id, last_message_at, status')
          .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
          .eq('status', 'active')
          .order('last_message_at', { ascending: false });

        // Fetch group chats
        const { data: groupMemberships } = await supabase
          .from('group_chat_members')
          .select('group_id')
          .eq('user_id', user.id);

        const groupIds = groupMemberships?.map(m => m.group_id) || [];

        let groupChats: any[] = [];
        if (groupIds.length > 0) {
          const { data: groups } = await supabase
            .from('group_chats')
            .select('*')
            .in('id', groupIds);
          groupChats = groups || [];
        }

        // Format chats
        const formattedDirectChats: ChatPreview[] = await Promise.all(
          (directChats || []).map(async (conv) => {
            const otherUserId = conv.user_1_id === user.id ? conv.user_2_id : conv.user_1_id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, photo_url')
              .eq('id', otherUserId)
              .single();

            return {
              id: conv.id,
              type: 'direct' as const,
              name: profile?.name || 'Unknown',
              photoUrl: profile?.photo_url || undefined,
              lastMessage: undefined,
              lastMessageAt: conv.last_message_at || new Date().toISOString(),
              unreadCount: 0,
            };
          })
        );

        const formattedGroupChats: ChatPreview[] = groupChats.map((group) => ({
          id: group.id,
          type: group.type as 'event' | 'match_group' | 'friend_group',
          name: group.name,
          photoUrl: group.photo_url || undefined,
          lastMessage: undefined,
          lastMessageAt: group.updated_at || group.created_at,
          unreadCount: 0,
          memberCount: 0,
        }));

        setChats([...formattedDirectChats, ...formattedGroupChats].sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        ));
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Fetch contacts for creating groups
  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, photo_url')
        .neq('id', user.id)
        .limit(50);

      setContacts(
        (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          photoUrl: p.photo_url || undefined,
        }))
      );
    };

    fetchContacts();
  }, [user]);

  // Handle chat selection
  useEffect(() => {
    if (chatId && chatType) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);
        fetchMessages(chatId, chatType as any);
      }
    } else {
      setSelectedChat(null);
      setMessages([]);
    }
  }, [chatId, chatType, chats]);

  const fetchMessages = async (id: string, type: string) => {
    if (!user) return;
    setIsMessagesLoading(true);

    try {
      if (type === 'direct') {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', id)
          .order('created_at', { ascending: true });

        setMessages(
          (data || []).map((m) => ({
            id: m.id,
            content: m.content,
            senderId: m.sender_id,
            senderName: 'User',
            createdAt: m.created_at || new Date().toISOString(),
            type: 'text' as const,
          }))
        );
      } else {
        const { data } = await supabase
          .from('group_messages')
          .select('*')
          .eq('group_id', id)
          .order('created_at', { ascending: true });

        // Fetch sender profiles
        const senderIds = [...new Set((data || []).map(m => m.sender_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, photo_url')
          .in('id', senderIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        setMessages(
          (data || []).map((m) => {
            const profile = profileMap.get(m.sender_id);
            return {
              id: m.id,
              content: m.content,
              senderId: m.sender_id,
              senderName: profile?.name || 'User',
              senderPhoto: profile?.photo_url || undefined,
              createdAt: m.created_at,
              type: m.message_type as 'text' | 'image' | 'system',
            };
          })
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Subscribe to realtime messages
  useEffect(() => {
    if (!chatId || !chatType) return;

    const table = chatType === 'direct' ? 'messages' : 'group_messages';
    const filterColumn = chatType === 'direct' ? 'conversation_id' : 'group_id';

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter: `${filterColumn}=eq.${chatId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          
          // For group messages, fetch sender info
          let senderName = 'User';
          let senderPhoto: string | undefined;
          
          if (chatType !== 'direct') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, photo_url')
              .eq('id', newMsg.sender_id)
              .single();
            senderName = profile?.name || 'User';
            senderPhoto = profile?.photo_url || undefined;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              content: newMsg.content,
              senderId: newMsg.sender_id,
              senderName,
              senderPhoto,
              createdAt: newMsg.created_at,
              type: newMsg.message_type || 'text',
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, chatType]);

  const handleSelectChat = (id: string, type: string) => {
    navigate(`/messages/${type}/${id}`);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !chatId || !chatType) return;

    try {
      if (chatType === 'direct') {
        await supabase.from('messages').insert({
          conversation_id: chatId,
          sender_id: user.id,
          content,
        });

        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', chatId);
      } else {
        await supabase.from('group_messages').insert({
          group_id: chatId,
          sender_id: user.id,
          content,
          message_type: 'text',
        });

        await supabase
          .from('group_chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', chatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = async (
    type: 'event' | 'match_group' | 'friend_group',
    name: string,
    memberIds: string[]
  ) => {
    if (!user) return;

    try {
      const { data: group, error: groupError } = await supabase
        .from('group_chats')
        .insert({
          name,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as owner
      await supabase.from('group_chat_members').insert({
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
      });

      // Add selected members
      await supabase.from('group_chat_members').insert(
        memberIds.map((userId) => ({
          group_id: group.id,
          user_id: userId,
          role: 'member',
        }))
      );

      // Navigate to new group
      navigate(`/messages/${type}/${group.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleBack = () => {
    navigate('/messages');
  };

  // Mobile: show either sidebar or thread
  if (isMobile) {
    if (selectedChat) {
      return (
        <div className="h-screen">
          <ChatThread
            chatId={selectedChat.id}
            chatType={selectedChat.type}
            chatName={selectedChat.name}
            chatPhoto={selectedChat.photoUrl}
            memberCount={selectedChat.memberCount}
            messages={messages}
            currentUserId={user?.id || ''}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            isLoading={isMessagesLoading}
          />
        </div>
      );
    }

    return (
      <Layout>
        <div className="h-[calc(100vh-120px)]">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat}
            onCreateGroup={() => setIsCreateModalOpen(true)}
          />
        </div>
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateGroup}
          contacts={contacts}
        />
      </Layout>
    );
  }

  // Desktop: side-by-side layout
  return (
    <Layout>
      <div className="h-[calc(100vh-80px)] flex">
        <div className="w-80 flex-shrink-0">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat}
            onCreateGroup={() => setIsCreateModalOpen(true)}
          />
        </div>
        <div className="flex-1 border-l border-border/50">
          {selectedChat ? (
            <ChatThread
              chatId={selectedChat.id}
              chatType={selectedChat.type}
              chatName={selectedChat.name}
              chatPhoto={selectedChat.photoUrl}
              memberCount={selectedChat.memberCount}
              messages={messages}
              currentUserId={user?.id || ''}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              isLoading={isMessagesLoading}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose from your existing chats or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateGroup}
        contacts={contacts}
      />
    </Layout>
  );
};

export default Messages;
