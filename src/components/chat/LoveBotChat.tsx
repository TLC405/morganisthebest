import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LoveBotChatProps {
  onClose: () => void;
}

export const LoveBotChat = ({ onClose }: LoveBotChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! 💕 I'm LoveBot, your dating event assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lovebot-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            userRole: userRole || 'single',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      // Add empty assistant message to update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }
    } catch (error) {
      console.error('LoveBot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Oops! I had a little hiccup. Please try again! 💕",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I check in?",
    "Tips for my profile",
    "What are waves?",
  ];

  return (
    <Card variant="glass" className="flex h-[500px] flex-col overflow-hidden shadow-glow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="flex items-center gap-1 font-semibold">
            LoveBot
            <Sparkles className="h-4 w-4 text-primary" />
          </h3>
          <p className="text-xs text-muted-foreground">Your dating event assistant</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === 'user'
                    ? 'bg-secondary'
                    : 'bg-gradient-to-r from-primary to-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
                setTimeout(sendMessage, 100);
              }}
              className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/50 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-background/50"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
