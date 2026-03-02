import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Users, Navigation, Edit, Trash2, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number | null;
  geo_fence_radius: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
}

const AdminVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: 50,
    geo_fence_radius: 100,
    latitude: '',
    longitude: '',
  });

  const fetchVenues = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('name');

    if (error) {
      toast({ title: 'Error fetching venues', variant: 'destructive' });
    } else {
      setVenues(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const venueData = {
      name: formData.name,
      address: formData.address,
      capacity: formData.capacity,
      geo_fence_radius: formData.geo_fence_radius,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      status: 'active',
    };

    if (editingVenue) {
      const { error } = await supabase
        .from('venues')
        .update(venueData)
        .eq('id', editingVenue.id);

      if (error) {
        toast({ title: 'Failed to update venue', variant: 'destructive' });
      } else {
        toast({ title: 'Venue updated successfully' });
        setIsDialogOpen(false);
        fetchVenues();
      }
    } else {
      const { error } = await supabase.from('venues').insert(venueData);

      if (error) {
        toast({ title: 'Failed to create venue', variant: 'destructive' });
      } else {
        toast({ title: 'Venue created successfully' });
        setIsDialogOpen(false);
        fetchVenues();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    
    const { error } = await supabase.from('venues').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Failed to delete venue', variant: 'destructive' });
    } else {
      toast({ title: 'Venue deleted' });
      fetchVenues();
    }
  };

  const openEditDialog = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity || 50,
      geo_fence_radius: venue.geo_fence_radius || 100,
      latitude: venue.latitude?.toString() || '',
      longitude: venue.longitude?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVenue(null);
    setFormData({
      name: '',
      address: '',
      capacity: 50,
      geo_fence_radius: 100,
      latitude: '',
      longitude: '',
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        toast({ title: 'Location captured' });
      }, () => {
        toast({ title: 'Failed to get location', variant: 'destructive' });
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 border-2 border-foreground bg-foreground flex items-center justify-center">
                <Building2 className="h-6 w-6 text-background" />
              </div>
              <h1 className="text-3xl font-bold text-foreground font-mono uppercase tracking-tight">Venues Management</h1>
            </div>
            <p className="text-muted-foreground">GPS-integrated locations with capacity tracking</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Venue Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="The Social Lounge"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, OKC"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="geo_fence_radius">Geo-fence Radius (m)</Label>
                    <Input
                      id="geo_fence_radius"
                      type="number"
                      value={formData.geo_fence_radius}
                      onChange={(e) => setFormData({ ...formData, geo_fence_radius: parseInt(e.target.value) })}
                      min={10}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>GPS Coordinates</Label>
                    <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                      <Navigation className="h-4 w-4 mr-1" />
                      Use Current
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                    <Input
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all">
                  {editingVenue ? 'Update Venue' : 'Add Venue'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="elevated">
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {venues.length === 0 ? (
              <Card variant="elevated" className="col-span-2">
                <CardContent className="p-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No venues yet. Add your first venue!</p>
                </CardContent>
              </Card>
            ) : (
              venues.map((venue) => (
                <Card key={venue.id} variant="elevated">
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
                        <span>Geo-fence: <strong>{venue.geo_fence_radius}m</strong></span>
                      </div>
                    </div>
                    
                    {venue.latitude && venue.longitude && (
                      <div className="text-sm text-muted-foreground">
                        <p>GPS: {venue.latitude.toFixed(4)}, {venue.longitude.toFixed(4)}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(venue)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(venue.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminVenues;
