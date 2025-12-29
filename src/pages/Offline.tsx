import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';

const Offline = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mb-6 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
              <WifiOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              You're Offline
            </h1>
            <p className="mb-8 text-muted-foreground leading-relaxed">
              It looks like you've lost your internet connection. Don't worry - 
              some features are still available offline! You can browse cached events 
              and view your profile.
            </p>
            <Button
              variant="glow"
              size="lg"
              onClick={handleRetry}
              className="gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Offline;
