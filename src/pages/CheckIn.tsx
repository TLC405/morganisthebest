import { useState, useEffect } from 'react';
import { QrCode, Keyboard, CheckCircle, Sparkles, Hash, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { WelcomeAnimation } from '@/components/events/WelcomeAnimation';
import { PinEntryModal } from '@/components/matching/PinEntryModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const CheckIn = () => {
  const [doorCode, setDoorCode] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkedEvent, setCheckedEvent] = useState<{ title: string; id: string } | null>(null);
  const [nametagPin, setNametagPin] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [userRsvps, setUserRsvps] = useState<any[]>([]);
  const [geoVerified, setGeoVerified] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Fetch user's RSVPs
    const fetchRsvps = async () => {
      const { data } = await supabase
        .from('event_attendance')
        .select(`
          *,
          events (id, title, date, start_time)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setUserRsvps(data || []);
    };
    
    fetchRsvps();
  }, [user]);

  const verifyGeoLocation = async (eventId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // In production, compare with venue coordinates
          // For now, just mark as verified
          setGeoVerified(true);
          resolve(true);
        },
        () => {
          setGeoVerified(false);
          resolve(false);
        }
      );
    });
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to check in.",
        variant: "destructive",
      });
      return;
    }

    // Find RSVP with matching door code
    const rsvp = userRsvps.find(r => r.door_code?.toLowerCase() === doorCode.toLowerCase());
    
    if (rsvp && rsvp.events) {
      // Verify GPS location
      await verifyGeoLocation(rsvp.events.id);

      // Update attendance record
      await supabase
        .from('event_attendance')
        .update({
          check_in_status: 'on_time' as const,
          checked_in_at: new Date().toISOString(),
          geo_verified: geoVerified,
        })
        .eq('id', rsvp.id);

      setCheckedEvent({ title: rsvp.events.title, id: rsvp.events.id });
      setNametagPin(rsvp.nametag_pin);
      setShowWelcome(true);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your door code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleQRScan = async () => {
    // Simulate QR scan - in production this would use the camera
    if (userRsvps.length > 0 && userRsvps[0].events) {
      const rsvp = userRsvps[0];
      
      await verifyGeoLocation(rsvp.events.id);

      await supabase
        .from('event_attendance')
        .update({
          check_in_status: 'on_time' as const,
          checked_in_at: new Date().toISOString(),
          geo_verified: geoVerified,
        })
        .eq('id', rsvp.id);

      setCheckedEvent({ title: rsvp.events.title, id: rsvp.events.id });
      setNametagPin(rsvp.nametag_pin);
      setShowWelcome(true);
    } else {
      toast({
        title: "No RSVP Found",
        description: "You don't have any active RSVPs.",
        variant: "destructive",
      });
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setIsCheckedIn(true);
  };

  const handlePinSubmit = async (enteredPin: string) => {
    if (!user || !checkedEvent) return;

    // Find who has this PIN at this event
    const { data: targetAttendance } = await supabase
      .from('event_attendance')
      .select('user_id')
      .eq('event_id', checkedEvent.id)
      .eq('nametag_pin', enteredPin)
      .neq('user_id', user.id)
      .single();

    if (!targetAttendance) {
      toast({
        title: "PIN Not Found",
        description: "No one at this event has that PIN.",
        variant: "destructive",
      });
      return;
    }

    // Create a wave (interest) to this person
    const { error } = await supabase.from('waves').insert({
      from_user_id: user.id,
      to_user_id: targetAttendance.user_id,
      event_id: checkedEvent.id,
    });

    if (error) {
      if (error.code === '23505') { // Unique violation - already sent wave
        toast({
          title: "Already Sent",
          description: "You've already entered this person's PIN!",
        });
      }
      return;
    }

    // Check if they also entered our PIN (mutual match!)
    const { data: mutualWave } = await supabase
      .from('waves')
      .select('id')
      .eq('from_user_id', targetAttendance.user_id)
      .eq('to_user_id', user.id)
      .eq('event_id', checkedEvent.id)
      .single();

    if (mutualWave) {
      // Create conversation for mutual match
      await supabase.from('conversations').insert({
        user_1_id: user.id,
        user_2_id: targetAttendance.user_id,
      });

      toast({
        title: "It's a Match! 💕",
        description: "You both entered each other's PIN! Check your Chats.",
      });
    } else {
      toast({
        title: "PIN Recorded! 💫",
        description: "If they enter your PIN too, you'll match!",
      });
    }

    setShowPinEntry(false);
  };

  // Show welcome animation
  if (showWelcome && checkedEvent && nametagPin) {
    return (
      <WelcomeAnimation
        eventName={checkedEvent.title}
        nametagPin={nametagPin}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  if (isCheckedIn && checkedEvent) {
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
              <p className="text-muted-foreground mb-4">
                Welcome to {checkedEvent.title}!
              </p>

              {/* Your PIN */}
              {nametagPin && (
                <div className="rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Your Nametag PIN</p>
                  <div className="text-5xl font-bold text-primary tracking-widest">
                    #{nametagPin}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share with someone you'd like to match with!
                  </p>
                </div>
              )}

              {/* GPS Verification Status */}
              <div className={`rounded-lg p-3 mb-6 flex items-center justify-center gap-2 ${
                geoVerified ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {geoVerified ? 'Location Verified ✓' : 'Location not verified'}
                </span>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setShowPinEntry(true)} className="w-full gap-2">
                  <Hash className="h-5 w-5" />
                  Enter Someone's PIN
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="/connections">View Revealed Profiles</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <PinEntryModal
            open={showPinEntry}
            onClose={() => setShowPinEntry(false)}
            onSubmit={handlePinSubmit}
            eventName={checkedEvent.title}
          />
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
            Check in to get your nametag PIN for anonymous matching!
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
            {userRsvps.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No RSVPs yet. Browse events to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {userRsvps.map((rsvp) => (
                  <div 
                    key={rsvp.id} 
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {rsvp.events?.title || 'Event'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Code: {rsvp.door_code || 'Pending'}
                      </p>
                      {rsvp.nametag_pin && (
                        <p className="text-xs text-primary font-medium">
                          PIN: #{rsvp.nametag_pin}
                        </p>
                      )}
                    </div>
                    {rsvp.check_in_status === 'checked_in' ? (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Checked In
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckIn;
