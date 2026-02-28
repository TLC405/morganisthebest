import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { TLCWatermark } from '@/components/brand/TLCWatermark';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <TLCWatermark />
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="border-4 border-foreground shadow-brutal-lg bg-card p-8 md:p-12 max-w-lg w-full text-center mb-12 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 border-4 border-foreground bg-foreground flex items-center justify-center">
              <Compass className="h-10 w-10 text-background" />
            </div>
          </div>
          
          <h1 className="font-mono font-black text-3xl md:text-4xl text-foreground uppercase tracking-tight mb-2">
            INSPIRE OKLAHOMA CITY
          </h1>
          
          <div className="w-24 h-1 bg-foreground mx-auto my-4" />
          
          <p className="font-mono font-bold text-sm md:text-base text-muted-foreground uppercase tracking-[0.3em] mb-2">
            Cure Isolation. Get Out.
          </p>
        </div>
        
        <Link
          to="/auth"
          className="border-4 border-foreground shadow-brutal bg-primary text-primary-foreground px-8 py-4 font-mono font-bold text-lg uppercase tracking-wider flex items-center gap-3 brutal-hover"
        >
          GET STARTED
          <ArrowRight className="h-5 w-5" />
        </Link>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="font-mono font-bold text-xs text-muted-foreground tracking-[0.3em] uppercase">
            © {new Date().getFullYear()} INSPIRE OKC
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
