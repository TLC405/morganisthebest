import { Heart, Instagram, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("bg-card border-t border-border mt-auto", className)}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl gradient-gold flex items-center justify-center shadow-soft">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Social Singles OKC</span>
                <p className="text-xs text-muted-foreground">by TLC</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Oklahoma's premier dating community. Meet verified singles at curated events. 
              No catfishing. No ghosting. Just real connections.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/events" className="hover:text-primary transition-colors">Upcoming Events</Link>
              <Link to="/guide" className="hover:text-primary transition-colors">How It Works</Link>
              <Link to="/auth" className="hover:text-primary transition-colors">Join Now</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Social Singles OKC. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a 
              href="mailto:hello@socialsinglesokc.com" 
              className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
