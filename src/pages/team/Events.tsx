import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  venue_name: string;
  date: string;
  start_time: string;
  status: string;
  checked_in: number;
  expected: number;
}

const TeamEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      // Fetch events with venue names
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          start_time,
          status,
          venues!events_venue_id_fkey(name)
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
        return;
      }

      // Get attendance counts for each event
      const eventsWithCounts: Event[] = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count: totalCount } = await supabase
            .from('event_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const { count: checkedInCount } = await supabase
            .from('event_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .not('check_in_status', 'is', null);

          return {
            id: event.id,
            title: event.title,
            date: event.date,
            start_time: event.start_time,
            status: event.status || 'upcoming',
            venue_name: (event.venues as any)?.name || 'TBD',
            checked_in: checkedInCount || 0,
            expected: totalCount || 0
          };
        })
      );

      setEvents(eventsWithCounts);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground">Events assigned to you for management</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">No events found</p>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                        <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.venue_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(event.date)} at {formatTime(event.start_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.checked_in}/{event.expected} checked in
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={event.status === 'active' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => navigate(`/team/check-ins?event=${event.id}`)}
                      >
                        {event.status === 'active' ? 'Manage Check-ins' : 'View Check-ins'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamEvents;
