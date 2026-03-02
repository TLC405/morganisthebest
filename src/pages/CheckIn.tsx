import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Hash, MapPin, Sparkles, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [eventAttendees, setEventAttendees] = useState<any[]>([]);
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

  // Fetch attendees when checked into an event
  useEffect(() => {
    if (!checkedEvent?.id) return;

    const fetchAttendees = async () => {
      const { data } = await supabase
        .from('event_attendance')
        .select(`
          *,
          profiles:user_id (id, name, photo_url, age, occupation)
        `)
        .eq('event_id', checkedEvent.id)
        .eq('check_in_status', 'on_time');
      
      setEventAttendees(data || []);
    };

    fetchAttendees();
  }, [checkedEvent?.id]);

  const verifyGeoLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async () => {
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

    await verifyGeoLocation();

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

    const { data: mutualWave } = await supabase
      .from('waves')
      .select('id')
      .eq('from_user_id', targetAttendance.user_id)
      .eq('to_user_id', user.id)
      .eq('event_id', checkedEvent.id)
      .single();

    if (mutualWave) {
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
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

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
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Check-In Confirmation */}
          <Card variant="elevated" className="text-center mb-8">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center bg-primary shadow-brutal-sm">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                You're Checked In!
              </h2>
              <p className="text-muted-foreground mb-6">
                Welcome to {checkedEvent.title}!
              </p>

              {/* PIN Display */}
              {nametagPin && (
                <div className="bg-muted border-4 border-primary p-8 mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Your Nametag PIN</p>
                  <div className="text-6xl font-bold text-primary tracking-widest animate-fade-in">
                    #{nametagPin}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Share with someone you'd like to match with!
                  </p>
                </div>
              )}

              {/* GPS Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 border-2 ${
                geoVerified 
                  ? 'bg-secondary/10 text-secondary border-secondary' 
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {geoVerified ? 'Location Verified ✓' : 'Location not verified'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowPinEntry(true)} 
                  className="flex-1 gap-2 shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all"
                  size="lg"
                >
                  <Hash className="h-5 w-5" />
                  Enter Someone's PIN
                </Button>
                <Button asChild variant="outline" className="flex-1" size="lg">
                  <Link to="/matches">View Profiles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendee Photo Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Who's Here
              </h3>
              <Badge variant="secondary">
                {eventAttendees.length} checked in
              </Badge>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {eventAttendees.map((attendee, index) => (
                <div 
                  key={attendee.id}
                  className="group relative aspect-square overflow-hidden cursor-pointer animate-fade-in border-2 border-border hover:border-primary transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {attendee.profiles?.photo_url ? (
                    <img 
                      src={attendee.profiles.photo_url} 
                      alt={attendee.profiles.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {attendee.profiles?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-medium text-foreground truncate">
                      {attendee.profiles?.name?.split(' ')[0] || 'Guest'}
                    </p>
                    {attendee.profiles?.age && (
                      <p className="text-xs text-muted-foreground">
                        {attendee.profiles.age}
                      </p>
                    )}
                  </div>
                  {/* Mystery overlay for non-matches */}
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-primary drop-shadow-lg" />
                  </div>
                </div>
              ))}

              {eventAttendees.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No one else has checked in yet</p>
                  <p className="text-sm">Be the icebreaker!</p>
                </div>
              )}
            </div>
          </div>

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
      {/* Header */}
      <div className="border-b-4 border-primary bg-card">
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="mb-4 mx-auto flex h-20 w-20 items-center justify-center bg-primary shadow-brutal-sm">
            <QrCode className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Event Check-In</h1>
          <p className="text-muted-foreground">
            Get your nametag PIN for anonymous matching!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Upcoming Events
            </CardTitle>
            <CardDescription>
              Tap an event when you arrive to check in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userRsvps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-6">
                  No RSVPs yet. Browse events to get started!
                </p>
                <Button 
                  onClick={() => navigate('/events')}
                  className="shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Find Events
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRsvps.map((rsvp, index) => (
                  <div 
                    key={rsvp.id} 
                    className="group border-2 border-border hover:border-primary transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-lg">
                          {rsvp.events?.title || 'Event'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rsvp.events?.date} • {rsvp.events?.start_time}
                        </p>
                      </div>
                      {rsvp.check_in_status ? (
                        <Badge className="bg-secondary text-secondary-foreground gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Checked In
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => handleCheckIn(rsvp)}
                          className="gap-2 shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all"
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
