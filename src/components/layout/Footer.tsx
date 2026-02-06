import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("bg-card border-t-2 border-foreground mt-auto", className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary atomic-border flex items-center justify-center">
              <Heart className="h-3 w-3 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-mono-loud text-[10px] text-foreground">
              SOCIAL SINGLES OKC
            </span>
          </div>

          <p className="font-mono-loud text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} TLC — PREMIUM DATING
          </p>
        </div>
      </div>
    </footer>
  );
};
