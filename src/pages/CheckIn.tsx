import { useState } from 'react';
import { QrCode, Keyboard, CheckCircle, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockEvents, userRSVPs } from '@/data/mockData';

const CheckIn = () => {
  const [doorCode, setDoorCode] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkedEvent, setCheckedEvent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find RSVP with matching code
    const rsvp = userRSVPs.find(r => r.doorCode.toLowerCase() === doorCode.toLowerCase());
    
    if (rsvp) {
      const event = mockEvents.find(e => e.id === rsvp.eventId);
      setIsCheckedIn(true);
      setCheckedEvent(event?.title || 'the event');
      toast({
        title: "Check-in Successful! 🎉",
        description: "Profiles of attendees will now be revealed to you!",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your door code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleQRScan = () => {
    // Simulate QR scan success
    setTimeout(() => {
      setIsCheckedIn(true);
      setCheckedEvent("Friday Night Mixer");
      toast({
        title: "QR Check-in Successful! 🎉",
        description: "Welcome to the event! Profiles are now being revealed.",
      });
    }, 1500);
  };

  if (isCheckedIn) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                You're Checked In!
              </h2>
              <p className="text-muted-foreground mb-6">
                Welcome to {checkedEvent}! Have an amazing time meeting new people.
              </p>
              <div className="rounded-lg bg-muted p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Profiles Unlocked!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You can now see unblurred photos of everyone at this event.
                </p>
              </div>
              <Button asChild className="w-full">
                <a href="/community">View Revealed Profiles</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Event Check-In</h1>
          <p className="text-muted-foreground">
            Check in when you arrive to unlock profile reveals!
          </p>
        </div>

        {/* Check-in Methods */}
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="gap-2">
              <Keyboard className="h-4 w-4" />
              Door Code
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="h-4 w-4" />
              QR Scan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Enter Door Code</CardTitle>
                <CardDescription>
                  Use the code from your RSVP confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="e.g., LOVE2024"
                    value={doorCode}
                    onChange={(e) => setDoorCode(e.target.value.toUpperCase())}
                    className="text-center text-xl tracking-widest uppercase"
                    maxLength={10}
                  />
                  <Button type="submit" className="w-full" disabled={!doorCode}>
                    Check In
                  </Button>
                </form>
                <p className="mt-4 text-xs text-center text-muted-foreground">
                  Demo codes: LOVE2024, SPARK789, NYE2025
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Point your camera at the QR code at the event entrance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Camera access needed
                    </p>
                  </div>
                </div>
                <Button onClick={handleQRScan} variant="outline" className="w-full">
                  Simulate QR Scan (Demo)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Your RSVPs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Your RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userRSVPs.map((rsvp) => {
                const event = mockEvents.find(e => e.id === rsvp.eventId);
                return (
                  <div 
                    key={rsvp.eventId} 
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{event?.title}</p>
                      <p className="text-xs text-muted-foreground">Code: {rsvp.doorCode}</p>
                    </div>
                    {rsvp.checkedIn ? (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Checked In
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckIn;
