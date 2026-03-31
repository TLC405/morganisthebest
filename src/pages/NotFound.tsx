import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center border-4 border-foreground bg-foreground shadow-brutal">
          <Compass className="h-10 w-10 text-background" />
        </div>
        <h1 className="mb-2 font-mono font-black text-6xl md:text-8xl text-foreground uppercase">404</h1>
        <p className="mb-6 font-mono text-sm text-muted-foreground uppercase tracking-[0.3em]">
          Route not found
        </p>
        <div className="inline-block border-2 border-foreground bg-card p-4 mb-8 shadow-brutal-sm">
          <code className="font-mono text-xs text-muted-foreground">{location.pathname}</code>
        </div>
        <div>
          <Button variant="primary" size="lg" asChild>
            <Link to="/explore">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Command Center
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
