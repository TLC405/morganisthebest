import { useEffect, useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeAnimationProps {
  eventName: string;
  nametagPin: string;
  onComplete: () => void;
}

export const WelcomeAnimation = ({ eventName, nametagPin, onComplete }: WelcomeAnimationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate floating hearts
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setHearts(newHearts);

    // Show content after brief delay
    setTimeout(() => setShowContent(true), 300);

    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => onComplete(), 8000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-secondary/80 backdrop-blur-sm"
      onClick={onComplete}
    >
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: '-20px',
            animationDelay: `${heart.delay}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          <Heart 
            className="h-6 w-6 text-white/30" 
            fill="currentColor"
          />
        </div>
      ))}

      {/* Sparkle decorations */}
      <Sparkles className="absolute top-20 left-10 h-8 w-8 text-white/40 animate-pulse" />
      <Star className="absolute top-32 right-16 h-6 w-6 text-white/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <Sparkles className="absolute bottom-40 left-20 h-10 w-10 text-white/30 animate-pulse" style={{ animationDelay: '1s' }} />
      <Star className="absolute bottom-32 right-10 h-8 w-8 text-white/40 animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Main Content */}
      <div 
        className={`text-center px-6 transition-all duration-700 transform ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Welcome Text */}
        <div className="mb-6">
          <p className="text-white/80 text-lg font-medium mb-2">Welcome to</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {eventName}
          </h1>
        </div>

        {/* PIN Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/30 shadow-2xl">
          <p className="text-white/90 text-sm uppercase tracking-wider mb-2">
            Your Nametag PIN
          </p>
          <div className="text-6xl font-bold text-white tracking-widest drop-shadow-lg">
            #{nametagPin}
          </div>
          <p className="text-white/70 text-sm mt-3">
            Share this with someone you'd like to match with!
          </p>
        </div>

        {/* Instructions */}
        <div className="text-white/80 text-sm mb-6 max-w-sm mx-auto">
          <p>When you meet someone you like, exchange PINs!</p>
          <p className="mt-1">Both enter each other's PIN to match and reveal names.</p>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={onComplete}
          variant="secondary"
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
        >
          Let's Go! 🎉
        </Button>

        <p className="text-white/50 text-xs mt-4">
          Tap anywhere to continue
        </p>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};
