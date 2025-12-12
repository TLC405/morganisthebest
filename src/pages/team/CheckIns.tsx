import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, XCircle, Search, MapPin } from 'lucide-react';

const TeamCheckIns = () => {
  const attendees = [
    {
      id: '1',
      name: 'Sarah Johnson',
      doorCode: 'ABC123',
      status: 'checked_in',
      checkInTime: '6:55 PM',
      geoVerified: true,
    },
    {
      id: '2',
      name: 'Mike Chen',
      doorCode: 'XYZ789',
      status: 'pending',
      checkInTime: null,
      geoVerified: false,
    },
    {
      id: '3',
      name: 'Emily Davis',
      doorCode: 'DEF456',
      status: 'late',
      checkInTime: '7:15 PM',
      geoVerified: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked_in':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            On Time
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Check-In Management</h1>
          <p className="text-muted-foreground">Speed Dating Night - The Social Lounge</p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or door code..." className="pl-10" />
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Attendees (18/24 checked in)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendees.map((attendee) => (
                <div 
                  key={attendee.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-foreground">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {attendee.doorCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {attendee.geoVerified && (
                      <Badge variant="outline" className="text-secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        GPS Verified
                      </Badge>
                    )}
                    {getStatusBadge(attendee.status)}
                    {attendee.status === 'pending' && (
                      <Button size="sm">Check In</Button>
                    )}
                    {attendee.checkInTime && (
                      <span className="text-sm text-muted-foreground">
                        {attendee.checkInTime}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamCheckIns;
