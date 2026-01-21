import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { TLCWatermark } from '@/components/brand/TLCWatermark';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* TLC Watermark */}
      <TLCWatermark />
      
      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Main Brand Card */}
        <div className="atomic-border-thick atomic-shadow bg-card p-8 md:p-12 max-w-lg w-full text-center mb-12 animate-fade-in">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 atomic-border-thick bg-primary flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="font-mono-loud text-3xl md:text-4xl text-foreground mb-2">
            SOCIAL SINGLES OKC
          </h1>
          
          {/* Divider */}
          <div className="w-24 h-1 bg-foreground mx-auto my-4" />
          
          {/* Tagline */}
          <p className="font-mono-loud text-sm md:text-base text-muted-foreground mb-2">
            PREMIUM DATING
          </p>
          <p className="font-mono-loud text-xs text-primary">
            POWERED BY TLC
          </p>
        </div>
        
        {/* CTA Button */}
        <Link
          to="/social"
          className="atomic-border-thick atomic-shadow bg-primary text-primary-foreground px-8 py-4 font-mono-loud text-lg flex items-center gap-3 hover:bg-primary/90 atomic-shadow-hover"
        >
          ENTER THE SOCIAL
          <ArrowRight className="h-5 w-5" />
        </Link>
        
        {/* Bottom Attribution */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="font-mono-loud text-xs text-muted-foreground tracking-[0.3em]">
            © {new Date().getFullYear()} TLC
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
