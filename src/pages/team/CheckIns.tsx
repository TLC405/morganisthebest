import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, XCircle, Search, MapPin, UserCheck, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
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
      
      // Get attendance records with profile names
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

      // Get profile names and roles for each attendee
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
      
      // Check if current team member is checked in
      if (user) {
        const myAttendance = formattedAttendees.find(a => a.user_id === user.id);
        setTeamCheckedIn(!!myAttendance?.check_in_status);
      }
      
      setLoading(false);
    };

    fetchAttendees();
  }, [selectedEvent, user]);

  // Filter attendees by door code search
  const filteredAttendees = attendees.filter(attendee => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(query) ||
      attendee.door_code?.toLowerCase().includes(query)
    );
  });

  // Check in attendee by door code
  const handleCheckIn = async (attendeeId: string, doorCode: string | null) => {
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

    // Update local state
    setAttendees(prev => prev.map(a => 
      a.id === attendeeId 
        ? { ...a, check_in_status: 'on_time', checked_in_at: new Date().toISOString(), geo_verified: true }
        : a
    ));
    
    toast.success('Attendee checked in successfully!');
  };

  // Team member self check-in
  const handleTeamCheckIn = async () => {
    if (!user || !selectedEvent) return;

    // Check if already has attendance record
    const existing = attendees.find(a => a.user_id === user.id);
    
    if (existing) {
      // Update existing record
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
      // Create new attendance record for team member
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
    
    // Refresh attendees
    setSelectedEvent(prev => prev);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'on_time':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Checked In
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case 'no_show':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            No Show
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Check-In Management</h1>
          {currentEvent && (
            <p className="text-muted-foreground">{currentEvent.title} - {currentEvent.venue_name}</p>
          )}
        </div>

        {/* Event Selector */}
        {events.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {events.map(event => (
              <Button
                key={event.id}
                variant={selectedEvent === event.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedEvent(event.id)}
              >
                {event.title}
              </Button>
            ))}
          </div>
        )}

        {/* Team Self Check-In */}
        <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Team Check-In</p>
                  <p className="text-sm text-muted-foreground">Mark yourself as attending this event</p>
                </div>
              </div>
              {teamCheckedIn ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  You're Checked In
                </Badge>
              ) : (
                <Button onClick={handleTeamCheckIn} size="sm">
                  Check In Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search by Door Code */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or door code..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Attendees ({checkedInCount}/{attendees.length} checked in)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading attendees...</p>
            ) : filteredAttendees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchQuery ? 'No attendees match your search' : 'No attendees yet'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAttendees.map((attendee) => (
                  <div 
                    key={attendee.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{attendee.name}</p>
                          {attendee.is_team && (
                            <Badge variant="secondary" className="text-xs">Team</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Door Code: <span className="font-mono font-semibold">{attendee.door_code || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {attendee.check_in_status && attendee.nametag_pin && (
                        <Badge variant="outline" className="text-primary border-primary">
                          <Hash className="h-3 w-3 mr-1" />
                          PIN: {attendee.nametag_pin}
                        </Badge>
                      )}
                      {attendee.geo_verified && (
                        <Badge variant="outline" className="text-secondary">
                          <MapPin className="h-3 w-3 mr-1" />
                          GPS
                        </Badge>
                      )}
                      {getStatusBadge(attendee.check_in_status)}
                      {!attendee.check_in_status && (
                        <Button 
                          size="sm"
                          onClick={() => handleCheckIn(attendee.id, attendee.door_code)}
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
