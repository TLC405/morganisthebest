import { useState } from 'react';
import { MessageCircleHeart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoveBotChat } from './LoveBotChat';

export const LoveBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Bottom LEFT to not conflict with PanelSwitcher */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 h-14 w-14 shadow-hard-sm transition-all duration-300 ${
          isOpen 
            ? 'bg-muted hover:bg-muted/80 text-foreground' 
            : 'bg-primary hover:bg-primary/90 hover:translate-y-0.5 hover:shadow-none'
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircleHeart className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Panel - Bottom LEFT */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-48px)] animate-fade-in">
          <LoveBotChat onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};
