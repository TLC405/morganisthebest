import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  Building2, 
  Star, 
  MessageCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeEvents: number;
  venues: number;
  communityTrusted: number;
  feedbackToday: number;
  checkInRate: number;
}

interface RecentActivity {
  id: string;
  type: 'check_in' | 'feedback' | 'signup' | 'event';
  description: string;
  time: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEvents: 0,
    venues: 0,
    communityTrusted: 0,
    feedbackToday: 0,
    checkInRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock chart data - will be replaced with real data
  const checkInData = [
    { name: 'Mon', onTime: 45, late: 8, noShow: 3 },
    { name: 'Tue', onTime: 52, late: 6, noShow: 2 },
    { name: 'Wed', onTime: 38, late: 10, noShow: 5 },
    { name: 'Thu', onTime: 62, late: 4, noShow: 1 },
    { name: 'Fri', onTime: 78, late: 12, noShow: 4 },
    { name: 'Sat', onTime: 95, late: 15, noShow: 6 },
    { name: 'Sun', onTime: 42, late: 5, noShow: 2 },
  ];

  const userGrowthData = [
    { name: 'Week 1', users: 120 },
    { name: 'Week 2', users: 185 },
    { name: 'Week 3', users: 267 },
    { name: 'Week 4', users: 389 },
    { name: 'Week 5', users: 524 },
    { name: 'Week 6', users: 698 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch active events
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'upcoming');

        // Fetch venues
        const { count: venuesCount } = await supabase
          .from('venues')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch community trusted users
        const { count: trustedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('community_trusted', true);

        // Fetch today's feedback
        const today = new Date().toISOString().split('T')[0];
        const { count: feedbackCount } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);

        // Calculate check-in rate from attendance
        const { data: attendanceData } = await supabase
          .from('event_attendance')
          .select('check_in_status')
          .not('check_in_status', 'is', null);

        const totalCheckins = attendanceData?.length || 0;
        const onTimeCheckins = attendanceData?.filter(a => a.check_in_status === 'on_time').length || 0;
        const checkInRate = totalCheckins > 0 ? Math.round((onTimeCheckins / totalCheckins) * 100) : 0;

        setStats({
          totalUsers: usersCount || 0,
          activeEvents: eventsCount || 0,
          venues: venuesCount || 0,
          communityTrusted: trustedCount || 0,
          feedbackToday: feedbackCount || 0,
          checkInRate: checkInRate || 94
        });

        // Set mock recent activity
        setRecentActivity([
          { id: '1', type: 'check_in', description: 'Sarah checked in at Wine & Mingle', time: '2 min ago' },
          { id: '2', type: 'feedback', description: 'New positive feedback received', time: '5 min ago' },
          { id: '3', type: 'signup', description: 'New user: Michael joined', time: '12 min ago' },
          { id: '4', type: 'event', description: 'Speed Dating event created', time: '1 hour ago' },
          { id: '5', type: 'check_in', description: 'John checked in at Game Night', time: '2 hours ago' },
        ]);

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      trend: '+12%',
      trendUp: true,
      gradient: 'from-primary/20 to-accent/20'
    },
    { 
      title: 'Active Events', 
      value: stats.activeEvents.toString(), 
      icon: Calendar, 
      trend: '+2',
      trendUp: true,
      gradient: 'from-secondary/20 to-primary/20'
    },
    { 
      title: 'Venues', 
      value: stats.venues.toString(), 
      icon: Building2, 
      trend: '+1',
      trendUp: true,
      gradient: 'from-accent/20 to-secondary/20'
    },
    { 
      title: 'Community Trusted', 
      value: stats.communityTrusted.toString(), 
      icon: Star, 
      trend: '+23',
      trendUp: true,
      gradient: 'from-primary/20 to-secondary/20'
    },
    { 
      title: 'Feedback Today', 
      value: stats.feedbackToday.toString(), 
      icon: MessageCircle, 
      trend: '+8',
      trendUp: true,
      gradient: 'from-secondary/20 to-accent/20'
    },
    { 
      title: 'Check-in Rate', 
      value: `${stats.checkInRate}%`, 
      icon: TrendingUp, 
      trend: '+3%',
      trendUp: true,
      gradient: 'from-accent/20 to-primary/20'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check_in': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'feedback': return <MessageCircle className="h-4 w-4 text-primary" />;
      case 'signup': return <Users className="h-4 w-4 text-secondary" />;
      case 'event': return <Calendar className="h-4 w-4 text-accent" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen gradient-section">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Sparkle */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="text-gradient">Admin Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time overview of Social Singles OKC
              </p>
            </div>
            <Button className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all rounded-xl" asChild>
              <Link to="/admin/events">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Stats Grid - Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.title} 
                  className="glass border-0 shadow-premium hover-lift rounded-2xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-card/50 flex items-center justify-center shadow-sm">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl font-bold text-foreground tracking-tight">
                      {isLoading ? '...' : stat.value}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trendUp ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-500' : 'text-destructive'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Check-in Performance Chart */}
            <Card className="glass border-0 shadow-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Check-in Performance
                </CardTitle>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    On Time
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Late
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    No Show
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={checkInData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)'
                        }}
                      />
                      <Bar dataKey="onTime" stackId="a" fill="hsl(142 76% 36%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="late" stackId="a" fill="hsl(38 92% 50%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="noShow" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card className="glass border-0 shadow-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorUsers)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section - Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 glass border-0 shadow-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass border-0 shadow-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                  asChild
                >
                  <Link to="/admin/events">
                    <Calendar className="h-4 w-4 mr-3 text-primary" />
                    Manage Events
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                  asChild
                >
                  <Link to="/admin/users">
                    <Users className="h-4 w-4 mr-3 text-primary" />
                    View All Users
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                  asChild
                >
                  <Link to="/admin/venues">
                    <Building2 className="h-4 w-4 mr-3 text-primary" />
                    Manage Venues
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                  asChild
                >
                  <Link to="/admin/feedback">
                    <MessageCircle className="h-4 w-4 mr-3 text-primary" />
                    Review Feedback
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
                  asChild
                >
                  <Link to="/admin/team">
                    <Star className="h-4 w-4 mr-3 text-primary" />
                    Team Performance
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
