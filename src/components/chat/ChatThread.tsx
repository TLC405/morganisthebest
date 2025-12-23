import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreHorizontal, Phone, Video, Send, Smile, Image as ImageIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt: string;
  type: 'text' | 'image' | 'system';
}

interface ChatThreadProps {
  chatId: string;
  chatType: 'direct' | 'event' | 'match_group' | 'friend_group';
  chatName: string;
  chatPhoto?: string;
  memberCount?: number;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const formatDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d');
};

export const ChatThread = ({
  chatId,
  chatType,
  chatName,
  chatPhoto,
  memberCount,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  isLoading,
}: ChatThreadProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    await onSendMessage(newMessage.trim());
    setNewMessage('');
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const isGroup = chatType !== 'direct';

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="h-9 w-9 rounded-full md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={chatPhoto} />
          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
            {chatName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm text-foreground truncate">{chatName}</h2>
          <p className="text-xs text-muted-foreground">
            {isGroup ? (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {memberCount} members
              </span>
            ) : (
              'Active now'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={chatPhoto} />
              <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-medium">
                {chatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold text-foreground mb-1">{chatName}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {isGroup 
                ? 'This is the beginning of your group conversation.'
                : 'This is the beginning of your conversation.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-3 py-1 text-xs text-muted-foreground bg-muted/50 rounded-full">
                    {formatDateHeader(msgs[0].createdAt)}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-1">
                  {msgs.map((msg, idx) => {
                    const isOwn = msg.senderId === currentUserId;
                    const showAvatar = isGroup && !isOwn && 
                      (idx === 0 || msgs[idx - 1].senderId !== msg.senderId);
                    const showName = isGroup && !isOwn && showAvatar;
                    const isLastInGroup = idx === msgs.length - 1 || 
                      msgs[idx + 1]?.senderId !== msg.senderId;

                    if (msg.type === 'system') {
                      return (
                        <div key={msg.id} className="flex justify-center py-2">
                          <span className="text-xs text-muted-foreground">{msg.content}</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2",
                          isOwn ? "justify-end" : "justify-start",
                          !isLastInGroup && "mb-0.5"
                        )}
                      >
                        {!isOwn && isGroup && (
                          <div className="w-8 flex-shrink-0">
                            {showAvatar && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.senderPhoto} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                  {msg.senderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}

                        <div className={cn("max-w-[70%]", isOwn && "items-end")}>
                          {showName && (
                            <span className="text-xs text-muted-foreground mb-1 block ml-1">
                              {msg.senderName}
                            </span>
                          )}
                          <div
                            className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            )}
                          >
                            {msg.content}
                          </div>
                          {isLastInGroup && (
                            <span className={cn(
                              "text-[10px] text-muted-foreground mt-1 block",
                              isOwn ? "text-right mr-1" : "ml-1"
                            )}>
                              {format(new Date(msg.createdAt), 'h:mm a')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-background">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full flex-shrink-0">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </Button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className={cn(
                "w-full resize-none bg-muted/50 rounded-2xl px-4 py-2.5 pr-10",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-1 focus:ring-border",
                "min-h-[42px] max-h-[120px]"
              )}
              style={{ 
                height: 'auto',
                overflow: newMessage.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 bottom-1 h-8 w-8 rounded-full"
            >
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="h-10 w-10 rounded-full flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
