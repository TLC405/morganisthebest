import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberCard, MemberData, BehaviorMetrics } from '@/components/members/MemberCard';
import { MemberDetail } from '@/components/members/MemberDetail';
import { RoleType } from '@/components/events/EventRoleSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Grid, List, Users, Star, CheckCircle, 
  TrendingUp, RefreshCw, Activity
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
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch behavior metrics
      const userIds = profilesData?.map(p => p.id) || [];
      const { data: metricsData, error: metricsError } = await supabase
        .from('user_behavior_metrics')
        .select('*')
        .in('user_id', userIds);

      if (metricsError) {
        console.error('Error fetching metrics:', metricsError);
      }

      // Combine profiles with metrics
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

    const matchesTrustLevel =
      filterTrustLevel === 'all' ||
      (member.behaviorMetrics?.trust_level === filterTrustLevel);

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

  const handleRolesChange = async (roles: RoleType[], description?: string) => {
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
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Member Database</h1>
                <p className="text-muted-foreground">
                  Manage members, track behavior, and assign roles
                </p>
              </div>
            </div>
            <Button onClick={fetchMembers} variant="premium">
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Members', value: stats.total, color: 'primary' },
            { icon: Star, label: 'Community Trusted', value: stats.trusted, color: 'amber-400' },
            { icon: CheckCircle, label: 'Verified', value: stats.verified, color: 'emerald-400' },
            { icon: TrendingUp, label: 'Active (3+ events)', value: stats.active, color: 'secondary' },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              variant="glass"
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold animate-count-up">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card variant="glass" className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
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
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select value={filterTrust} onValueChange={setFilterTrust}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Trust Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="trusted">Trusted</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterTrustLevel} onValueChange={setFilterTrustLevel}>
                  <SelectTrigger className="w-[140px]">
                    <Activity className="h-4 w-4 mr-1" />
                    <SelectValue placeholder="Trust Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="rising_star">Rising Star</SelectItem>
                    <SelectItem value="community_trusted">Community Trusted</SelectItem>
                    <SelectItem value="veteran">Veteran</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterEvents} onValueChange={setFilterEvents}>
                  <SelectTrigger className="w-[130px]">
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
                  <TabsList className="h-10 glass border-0">
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
              <Card key={i} variant="glass" className="h-48 skeleton-shimmer" />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card variant="glass" className="animate-fade-in-up">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
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
            {filteredMembers.map((member, index) => (
              <div key={member.id} style={{ animationDelay: `${index * 50}ms` }}>
                <MemberCard
                  member={member}
                  behaviorMetrics={member.behaviorMetrics}
                  onClick={() => handleMemberClick(member)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card variant="glass">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Trust</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Events</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Waves</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
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
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'font-semibold',
                            (member.behaviorMetrics?.trust_index || 50) >= 70 ? 'text-emerald-400' : 
                            (member.behaviorMetrics?.trust_index || 50) >= 50 ? 'text-amber-400' : 'text-muted-foreground'
                          )}>
                            {Math.round(member.behaviorMetrics?.trust_index || member.trust_index || 50)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{member.events_attended || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-primary">{member.behaviorMetrics?.waves_sent || 0}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-secondary">{member.behaviorMetrics?.waves_received || 0}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {member.community_trusted ? (
                            <Badge variant="glow" className="text-xs">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Trusted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Member</Badge>
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
          behaviorMetrics={selectedMember?.behaviorMetrics}
          onRolesChange={handleRolesChange}
          mode="admin"
        />
      </div>
    </Layout>
  );
};

export default AdminMembers;
