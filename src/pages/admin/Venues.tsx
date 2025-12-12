import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Users, Navigation } from 'lucide-react';

const AdminVenues = () => {
  const venues = [
    {
      id: '1',
      name: 'The Social Lounge',
      address: '123 Main St, OKC',
      capacity: 50,
      geoFenceRadius: 100,
      coordinates: { lat: 35.4676, lng: -97.5164 },
      status: 'active',
      eventsHosted: 12,
    },
    {
      id: '2',
      name: 'Vino Bistro',
      address: '456 Wine Ave, OKC',
      capacity: 30,
      geoFenceRadius: 75,
      coordinates: { lat: 35.4789, lng: -97.5201 },
      status: 'active',
      eventsHosted: 8,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Venues Management</h1>
            <p className="text-muted-foreground">GPS-integrated locations with capacity tracking</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Venue
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {venues.map((venue) => (
            <Card key={venue.id} className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {venue.address}
                    </p>
                  </div>
                  <Badge variant={venue.status === 'active' ? 'default' : 'secondary'}>
                    {venue.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: <strong>{venue.capacity}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span>Geo-fence: <strong>{venue.geoFenceRadius}m</strong></span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>GPS: {venue.coordinates.lat.toFixed(4)}, {venue.coordinates.lng.toFixed(4)}</p>
                  <p>{venue.eventsHosted} events hosted</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" className="flex-1">View Events</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminVenues;
