import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberCard, MemberData, BehaviorMetrics } from '@/components/members/MemberCard';
import { MemberDetail } from '@/components/members/MemberDetail';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Grid, List, Users, Star, CheckCircle, 
  TrendingUp, RefreshCw, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberWithMetrics extends MemberData {
  behaviorMetrics?: BehaviorMetrics;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<MemberWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrust, setFilterTrust] = useState<string>('all');
  const [filterEvents, setFilterEvents] = useState<string>('all');
  const [filterTrustLevel, setFilterTrustLevel] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<MemberWithMetrics | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const userIds = profilesData?.map(p => p.id) || [];
      const { data: metricsData } = await supabase
        .from('user_behavior_metrics')
        .select('*')
        .in('user_id', userIds);

      const metricsMap = new Map(metricsData?.map(m => [m.user_id, m]) || []);
      
      const membersWithMetrics: MemberWithMetrics[] = (profilesData || []).map(profile => ({
        ...profile,
        behaviorMetrics: metricsMap.get(profile.id) ? {
          trust_index: metricsMap.get(profile.id)?.trust_index,
          trust_level: metricsMap.get(profile.id)?.trust_level,
          waves_sent: metricsMap.get(profile.id)?.waves_sent,
          waves_received: metricsMap.get(profile.id)?.waves_received,
          messages_sent: metricsMap.get(profile.id)?.messages_sent,
          messages_received: metricsMap.get(profile.id)?.messages_received,
          avg_response_time_mins: metricsMap.get(profile.id)?.avg_response_time_mins,
          positive_feedback_received: metricsMap.get(profile.id)?.positive_feedback_received,
          reports_received: metricsMap.get(profile.id)?.reports_received,
        } : undefined,
      }));

      setMembers(membersWithMetrics);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({ title: 'Error', description: 'Failed to load members', variant: 'destructive' });
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

    const matchesTrustLevel =
      filterTrustLevel === 'all' || member.behaviorMetrics?.trust_level === filterTrustLevel;

    return matchesSearch && matchesTrust && matchesEvents && matchesTrustLevel;
  });

  const stats = {
    total: members.length,
    trusted: members.filter((m) => m.community_trusted).length,
    verified: members.filter((m) => m.verification_level === 'verified').length,
    active: members.filter((m) => (m.events_attended || 0) >= 3).length,
  };

  const handleMemberClick = (member: MemberWithMetrics) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  const handleRolesChange = async () => {
    toast({ title: 'Roles Updated', description: `Updated roles for ${selectedMember?.name}` });
    setDetailOpen(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Members</h1>
              <p className="text-muted-foreground uppercase tracking-wide text-sm">
                {stats.total} members • {stats.trusted} trusted • {stats.active} active
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={fetchMembers} variant="outline" className="gap-2">
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Users },
              { label: 'Trusted', value: stats.trusted, icon: Star },
              { label: 'Verified', value: stats.verified, icon: CheckCircle },
              { label: 'Active', value: stats.active, icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border-2 border-border">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="SEARCH BY NAME, LOCATION, OR OCCUPATION..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={filterTrust} onValueChange={setFilterTrust}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="trusted">Trusted</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterEvents} onValueChange={setFilterEvents}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="0">New</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                      <SelectItem value="10+">10+</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 p-1 rounded-sm bg-muted border-2 border-border">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-48 rounded-sm bg-muted animate-pulse border-2 border-border" />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="p-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold uppercase mb-2">No Members Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Members will appear here once they sign up'}
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
                >
                  <MemberCard
                    member={member}
                    behaviorMetrics={member.behaviorMetrics}
                    onClick={() => handleMemberClick(member)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                      <th className="text-center py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Trust</th>
                      <th className="text-center py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Events</th>
                      <th className="text-center py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="border-b border-border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleMemberClick(member)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center text-sm font-bold border-2 border-border">
                              {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-foreground uppercase">{member.name}{member.age && `, ${member.age}`}</p>
                              <p className="text-xs text-muted-foreground uppercase">{member.occupation || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground uppercase">{member.area || '-'}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={cn(
                            'text-sm font-bold',
                            (member.behaviorMetrics?.trust_index || 50) >= 70 ? 'text-secondary' : 
                            (member.behaviorMetrics?.trust_index || 50) >= 50 ? 'text-[hsl(38_80%_55%)]' : 'text-muted-foreground'
                          )}>
                            {Math.round(member.behaviorMetrics?.trust_index || member.trust_index || 50)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground">{member.events_attended || 0}</td>
                        <td className="py-4 px-4 text-center">
                          {member.community_trusted ? (
                            <Badge>Trusted</Badge>
                          ) : (
                            <Badge variant="outline">Member</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Count */}
          <p className="text-center text-sm text-muted-foreground mt-6 uppercase tracking-wide">
            Showing {filteredMembers.length} of {members.length} members
          </p>

          {/* Member Detail */}
          <MemberDetail
            member={selectedMember}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            behaviorMetrics={selectedMember?.behaviorMetrics}
            onRolesChange={handleRolesChange}
            mode="admin"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminMembers;
