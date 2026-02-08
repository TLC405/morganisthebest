import { Heart } from 'lucide-react';

export const BrandedSplash = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-16 w-16 atomic-border bg-primary flex items-center justify-center animate-pulse">
        <Heart className="h-8 w-8 text-primary-foreground" fill="currentColor" />
      </div>
      <span className="font-mono-loud text-xs text-muted-foreground tracking-widest">
        SS<span className="text-primary">OKC</span>
      </span>
    </div>
  </div>
);
