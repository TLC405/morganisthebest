import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';

const TeamEvents = () => {
  const events = [
    {
      id: '1',
      title: 'Speed Dating Night',
      venue: 'The Social Lounge',
      date: 'Today',
      time: '7:00 PM',
      checkedIn: 18,
      expected: 24,
      status: 'active',
    },
    {
      id: '2',
      title: 'Wine & Mingle',
      venue: 'Vino Bistro',
      date: 'Tomorrow',
      time: '6:30 PM',
      checkedIn: 0,
      expected: 18,
      status: 'upcoming',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground">Events assigned to you for management</p>
        </div>

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
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.checkedIn}/{event.expected} checked in
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={event.status === 'active' ? 'default' : 'outline'} 
                      size="sm"
                    >
                      {event.status === 'active' ? 'Manage Check-ins' : 'View Details'}
                    </Button>
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

export default TeamEvents;
