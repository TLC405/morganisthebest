import { Compass } from 'lucide-react';

export const BrandedSplash = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-16 w-16 border-4 border-foreground bg-foreground flex items-center justify-center animate-pulse">
        <Compass className="h-8 w-8 text-background" />
      </div>
      <span className="font-mono font-bold text-xs text-muted-foreground tracking-[0.3em] uppercase">
        INSPIRE<span className="text-primary">OKC</span>
      </span>
    </div>
  </div>
);
