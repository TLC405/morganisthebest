import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, XCircle, Search, MapPin, UserCheck, Hash, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Attendee {
  id: string;
  user_id: string;
  name: string;
  door_code: string | null;
  nametag_pin: string | null;
  check_in_status: string | null;
  checked_in_at: string | null;
  geo_verified: boolean;
  is_team: boolean;
}

interface Event {
  id: string;
  title: string;
  venue_name: string;
  date: string;
  start_time: string;
}

const TeamCheckIns = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const eventId = searchParams.get('event');
  
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(eventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamCheckedIn, setTeamCheckedIn] = useState(false);

  // Fetch events for team member
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          start_time,
          venues!events_venue_id_fkey(name)
        `)
        .in('status', ['upcoming', 'active'])
        .order('date', { ascending: true });

      if (!error && data) {
        setEvents(data.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          start_time: e.start_time,
          venue_name: (e.venues as any)?.name || 'TBD'
        })));
        if (!selectedEvent && data.length > 0) {
          setSelectedEvent(data[0].id);
        }
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Fetch attendees for selected event
  useEffect(() => {
    if (!selectedEvent) return;

    const fetchAttendees = async () => {
      setLoading(true);
      
      const { data: attendanceData, error } = await supabase
        .from('event_attendance')
        .select(`
          id,
          user_id,
          door_code,
          nametag_pin,
          check_in_status,
          checked_in_at,
          geo_verified
        `)
        .eq('event_id', selectedEvent);

      if (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
        return;
      }

      const userIds = attendanceData?.map(a => a.user_id) || [];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      const formattedAttendees: Attendee[] = (attendanceData || []).map(a => ({
        id: a.id,
        user_id: a.user_id,
        name: profileMap.get(a.user_id) || 'Unknown',
        door_code: a.door_code,
        nametag_pin: a.nametag_pin,
        check_in_status: a.check_in_status,
        checked_in_at: a.checked_in_at,
        geo_verified: a.geo_verified || false,
        is_team: roleMap.get(a.user_id) === 'team' || roleMap.get(a.user_id) === 'admin'
      }));

      setAttendees(formattedAttendees);
      
      if (user) {
        const myAttendance = formattedAttendees.find(a => a.user_id === user.id);
        setTeamCheckedIn(!!myAttendance?.check_in_status);
      }
      
      setLoading(false);
    };

    fetchAttendees();
  }, [selectedEvent, user]);

  const filteredAttendees = attendees.filter(attendee => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(query) ||
      attendee.door_code?.toLowerCase().includes(query)
    );
  });

  const handleCheckIn = async (attendeeId: string) => {
    const { error } = await supabase
      .from('event_attendance')
      .update({
        check_in_status: 'on_time',
        checked_in_at: new Date().toISOString(),
        geo_verified: true
      })
      .eq('id', attendeeId);

    if (error) {
      toast.error('Failed to check in attendee');
      return;
    }

    setAttendees(prev => prev.map(a => 
      a.id === attendeeId 
        ? { ...a, check_in_status: 'on_time', checked_in_at: new Date().toISOString(), geo_verified: true }
        : a
    ));
    
    toast.success('Attendee checked in successfully!');
  };

  const handleTeamCheckIn = async () => {
    if (!user || !selectedEvent) return;

    const existing = attendees.find(a => a.user_id === user.id);
    
    if (existing) {
      const { error } = await supabase
        .from('event_attendance')
        .update({
          check_in_status: 'on_time',
          checked_in_at: new Date().toISOString(),
          geo_verified: true
        })
        .eq('id', existing.id);

      if (error) {
        toast.error('Failed to check in');
        return;
      }
    } else {
      const { error } = await supabase
        .from('event_attendance')
        .insert({
          event_id: selectedEvent,
          user_id: user.id,
          rsvp_status: 'going',
          check_in_status: 'on_time',
          checked_in_at: new Date().toISOString(),
          geo_verified: true
        });

      if (error) {
        toast.error('Failed to check in');
        return;
      }
    }

    setTeamCheckedIn(true);
    toast.success("You're checked in for this event!");
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'on_time':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Checked In
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Late
          </Badge>
        );
      case 'no_show':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            No Show
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const currentEvent = events.find(e => e.id === selectedEvent);
  const checkedInCount = attendees.filter(a => a.check_in_status).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Check-In Management</h1>
              {currentEvent && (
                <p className="text-muted-foreground">{currentEvent.title} — {currentEvent.venue_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Selector */}
        {events.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {events.map(event => (
              <Button
                key={event.id}
                variant={selectedEvent === event.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedEvent(event.id)}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                {event.title}
              </Button>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card variant="elevated" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{attendees.length}</div>
                <div className="text-xs text-muted-foreground">RSVPs</div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{checkedInCount}</div>
                <div className="text-xs text-muted-foreground">Checked In</div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{attendees.length - checkedInCount}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Self Check-In */}
        <Card variant="accent" className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Team Check-In</p>
                  <p className="text-sm text-muted-foreground">Mark yourself as attending this event</p>
                </div>
              </div>
              {teamCheckedIn ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  You're Checked In
                </Badge>
              ) : (
                <Button onClick={handleTeamCheckIn} variant="primary" size="sm">
                  Check In Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or door code..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Attendees List */}
        <Card variant="elevated" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Attendees ({checkedInCount}/{attendees.length} checked in)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 skeleton-shimmer rounded-xl" />
                ))}
              </div>
            ) : filteredAttendees.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No attendees match your search' : 'No attendees yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAttendees.map((attendee, index) => (
                  <div 
                    key={attendee.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl transition-all opacity-0 animate-fade-in-up",
                      attendee.check_in_status ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-muted/50 hover:bg-muted/70"
                    )}
                    style={{ animationDelay: `${index * 50 + 450}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm",
                        attendee.check_in_status 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-primary/20 text-primary"
                      )}>
                        {attendee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{attendee.name}</p>
                          {attendee.is_team && (
                            <Badge variant="secondary" className="text-xs">Team</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Door Code: <span className="font-mono font-semibold text-foreground">{attendee.door_code || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {attendee.check_in_status && attendee.nametag_pin && (
                        <Badge variant="default" className="gap-1">
                          <Hash className="h-3 w-3" />
                          PIN: {attendee.nametag_pin}
                        </Badge>
                      )}
                      {attendee.geo_verified && (
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          GPS
                        </Badge>
                      )}
                      {getStatusBadge(attendee.check_in_status)}
                      {!attendee.check_in_status && (
                        <Button 
                          size="sm"
                          variant="primary"
                          onClick={() => handleCheckIn(attendee.id)}
                        >
                          Check In
                        </Button>
                      )}
                      {attendee.checked_in_at && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(attendee.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
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

export default TeamCheckIns;
