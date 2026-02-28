import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("bg-card border-t-2 border-foreground mt-auto", className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-foreground border-2 border-foreground flex items-center justify-center">
              <Compass className="h-3 w-3 text-background" />
            </div>
            <span className="font-mono font-bold text-[10px] text-foreground uppercase tracking-widest">
              INSPIRE OKC
            </span>
          </div>

          <p className="font-mono font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
            © {new Date().getFullYear()} INSPIRE OKLAHOMA CITY
          </p>
        </div>
      </div>
    </footer>
  );
};
