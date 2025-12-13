import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberCard, MemberData, EventRole } from '@/components/members/MemberCard';
import { MemberDetail } from '@/components/members/MemberDetail';
import { RoleType } from '@/components/events/EventRoleSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Filter, Grid, List, Users, Star, CheckCircle, 
  TrendingUp, Calendar, Heart, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminMembers = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrust, setFilterTrust] = useState<string>('all');
  const [filterEvents, setFilterEvents] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.occupation?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrust =
      filterTrust === 'all' ||
      (filterTrust === 'trusted' && member.community_trusted) ||
      (filterTrust === 'verified' && member.verification_level === 'verified') ||
      (filterTrust === 'pending' && member.verification_level === 'pending');

    const matchesEvents =
      filterEvents === 'all' ||
      (filterEvents === '5+' && (member.events_attended || 0) >= 5) ||
      (filterEvents === '10+' && (member.events_attended || 0) >= 10) ||
      (filterEvents === '0' && (member.events_attended || 0) === 0);

    return matchesSearch && matchesTrust && matchesEvents;
  });

  const stats = {
    total: members.length,
    trusted: members.filter((m) => m.community_trusted).length,
    verified: members.filter((m) => m.verification_level === 'verified').length,
    active: members.filter((m) => (m.events_attended || 0) >= 3).length,
  };

  const handleMemberClick = (member: MemberData) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  const handleRolesChange = async (roles: RoleType[], description?: string) => {
    // In a full implementation, this would save to the database
    toast({
      title: 'Roles Updated',
      description: `Updated roles for ${selectedMember?.name}`,
    });
    setDetailOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Member Database
              </h1>
              <p className="text-muted-foreground">
                Manage members, assign event roles, and track engagement
              </p>
            </div>
            <Button onClick={fetchMembers} variant="outline">
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.trusted}</div>
                <div className="text-sm text-muted-foreground">Community Trusted</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.verified}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active (3+ events)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or occupation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={filterTrust} onValueChange={setFilterTrust}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Trust Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="trusted">Community Trusted</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterEvents} onValueChange={setFilterEvents}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="0">No Events</SelectItem>
                    <SelectItem value="5+">5+ Events</SelectItem>
                    <SelectItem value="10+">10+ Events</SelectItem>
                  </SelectContent>
                </Select>

                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                  <TabsList className="h-10">
                    <TabsTrigger value="grid" className="px-3">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="px-3">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid/List */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Members will appear here once they sign up'}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onClick={() => handleMemberClick(member)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Events</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Show-up</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Response</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="border-b border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleMemberClick(member)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-semibold">
                              {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {member.name}{member.age && `, ${member.age}`}
                              </p>
                              {member.looking_for && (
                                <p className="text-xs text-muted-foreground">
                                  Looking for {member.looking_for}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{member.area || '-'}</td>
                        <td className="py-3 px-4 text-center">{member.events_attended || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={(member.show_up_rate || 0) >= 90 ? 'text-emerald-400' : 'text-muted-foreground'}>
                            {member.show_up_rate || 0}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={(member.response_rate || 0) >= 80 ? 'text-emerald-400' : 'text-muted-foreground'}>
                            {member.response_rate || 0}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {member.community_trusted ? (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Trusted
                            </Badge>
                          ) : (
                            <Badge variant="outline">Member</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Showing count */}
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {filteredMembers.length} of {members.length} members
        </div>

        {/* Member Detail Modal */}
        <MemberDetail
          member={selectedMember}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onRolesChange={handleRolesChange}
          mode="admin"
        />
      </div>
    </Layout>
  );
};

export default AdminMembers;
