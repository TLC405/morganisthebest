import { useState } from 'react';
import { Search, Plus, Users, Calendar, Heart, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

type ChatType = 'all' | 'direct' | 'event' | 'match_group' | 'friend_group';

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

interface ChatSidebarProps {
  chats: ChatPreview[];
  selectedChatId?: string;
  onSelectChat: (chatId: string, type: string) => void;
  onCreateGroup: () => void;
}

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'event': return Calendar;
    case 'match_group': return Heart;
    case 'friend_group': return Users;
    default: return null;
  }
};

export const ChatSidebar = ({ chats, selectedChatId, onSelectChat, onCreateGroup }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ChatType>('all');

  const filters: { type: ChatType; label: string; icon?: any }[] = [
    { type: 'all', label: 'All' },
    { type: 'direct', label: 'Direct' },
    { type: 'event', label: 'Events', icon: Calendar },
    { type: 'match_group', label: 'Groups', icon: Users },
    { type: 'friend_group', label: 'Friends', icon: UserPlus },
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || chat.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Messages</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCreateGroup}
            className="h-9 w-9 rounded-full hover:bg-muted"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-border rounded-xl"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-1 p-1 bg-muted/30 rounded-xl">
          {filters.map((filter) => (
            <button
              key={filter.type}
              onClick={() => setActiveFilter(filter.type)}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                activeFilter === filter.type
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredChats.map((chat) => {
              const TypeIcon = getTypeIcon(chat.type);
              const isSelected = selectedChatId === chat.id;
              
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id, chat.type)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left group",
                    isSelected
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.photoUrl} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                        {chat.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                    {TypeIcon && chat.type !== 'direct' && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center">
                        <TypeIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn(
                        "font-medium text-sm truncate",
                        isSelected ? "text-foreground" : "text-foreground"
                      )}>
                        {chat.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatMessageTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate pr-2">
                        {chat.lastMessage || 'Start the conversation'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="flex-shrink-0 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
