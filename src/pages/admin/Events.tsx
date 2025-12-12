import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Users, Clock } from 'lucide-react';

const AdminEvents = () => {
  const events = [
    {
      id: '1',
      title: 'Speed Dating Night',
      venue: 'The Social Lounge',
      date: '2024-01-20',
      time: '7:00 PM',
      attendees: 24,
      maxAttendees: 30,
      status: 'upcoming',
      geoFenceEnabled: true,
    },
    {
      id: '2',
      title: 'Wine & Mingle',
      venue: 'Vino Bistro',
      date: '2024-01-22',
      time: '6:30 PM',
      attendees: 18,
      maxAttendees: 25,
      status: 'upcoming',
      geoFenceEnabled: true,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
            <p className="text-muted-foreground">Create and manage singles events with geo-fencing</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      {event.geoFenceEnabled && (
                        <Badge variant="outline" className="text-secondary">
                          <MapPin className="h-3 w-3 mr-1" />
                          Geo-Fence
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees} attendees
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Attendance</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminEvents;
