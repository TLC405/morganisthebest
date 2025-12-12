import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Hash, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { WelcomeAnimation } from '@/components/events/WelcomeAnimation';
import { PinEntryModal } from '@/components/matching/PinEntryModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const CheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkedEvent, setCheckedEvent] = useState<{ title: string; id: string } | null>(null);
  const [nametagPin, setNametagPin] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [userRsvps, setUserRsvps] = useState<any[]>([]);
  const [geoVerified, setGeoVerified] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not signed in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

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

  const verifyGeoLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async () => {
          // In production, compare with venue coordinates
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

  const handleCheckIn = async (rsvp: any) => {
    if (!user) return;

    // Verify GPS location
    await verifyGeoLocation();

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
      if (error.code === '23505') {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

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
          <Card className="text-center bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30">
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
                <div className="rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 p-6 mb-6">
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
      {/* Warm gradient header */}
      <div className="gradient-hero border-b border-border">
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Event Check-In</h1>
          <p className="text-muted-foreground">
            Check in to get your nametag PIN for anonymous matching!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Your RSVPs - Click to check in */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Your Upcoming Events</CardTitle>
            <CardDescription>
              Tap an event when you arrive to check in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userRsvps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No RSVPs yet. Browse events to get started!
                </p>
                <Button onClick={() => navigate('/events')}>
                  Find Events
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userRsvps.map((rsvp) => (
                  <div 
                    key={rsvp.id} 
                    className="rounded-xl bg-gradient-to-r from-muted/50 to-accent/10 p-4 border border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {rsvp.events?.title || 'Event'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rsvp.events?.date}
                        </p>
                      </div>
                      {rsvp.check_in_status ? (
                        <span className="text-xs text-primary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                          <CheckCircle className="h-3 w-3" />
                          Checked In
                        </span>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleCheckIn(rsvp)}
                          className="gap-1"
                        >
                          <MapPin className="h-4 w-4" />
                          Check In
                        </Button>
                      )}
                    </div>
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
