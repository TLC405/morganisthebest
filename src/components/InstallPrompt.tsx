import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useState } from 'react';

export const InstallPrompt = () => {
  const { isInstallable, installApp } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleInstall = async () => {
    const accepted = await installApp();
    if (accepted) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-fade-in-up">
      <Card variant="glass" className="shadow-glow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">
                Install Morgan Is The Best
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Install our app for quick access and offline support!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="glow"
                  onClick={handleInstall}
                  className="flex-1"
                >
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
