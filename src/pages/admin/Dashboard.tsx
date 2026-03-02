import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Building2, Star, MessageCircle, TrendingUp,
  Plus, Command, ArrowRight, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { LiveActivityFeed } from '@/components/admin/LiveActivityFeed';
import { AdminChatObserver } from '@/components/admin/AdminChatObserver';
import { StatCard } from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  activeEvents: number;
  venues: number;
  communityTrusted: number;
  feedbackToday: number;
  checkInRate: number;
}

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

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEvents: 0,
    venues: 0,
    communityTrusted: 0,
    feedbackToday: 0,
    checkInRate: 94
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showChatObserver, setShowChatObserver] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, venuesRes, trustedRes, feedbackRes, attendanceRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase.from('venues').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('community_trusted', true),
          supabase.from('feedback').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
          supabase.from('event_attendance').select('check_in_status').not('check_in_status', 'is', null),
        ]);

        const totalCheckins = attendanceRes.data?.length || 0;
        const onTimeCheckins = attendanceRes.data?.filter(a => a.check_in_status === 'on_time').length || 0;
        const checkInRate = totalCheckins > 0 ? Math.round((onTimeCheckins / totalCheckins) * 100) : 94;

        setStats({
          totalUsers: usersRes.count || 0,
          activeEvents: eventsRes.count || 0,
          venues: venuesRes.count || 0,
          communityTrusted: trustedRes.count || 0,
          feedbackToday: feedbackRes.count || 0,
          checkInRate,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, trend: '+12%', trendUp: true },
    { title: 'Active Events', value: stats.activeEvents.toString(), icon: Calendar, trend: '+2', trendUp: true },
    { title: 'Venues', value: stats.venues.toString(), icon: Building2, trend: '+1', trendUp: true },
    { title: 'Trusted Members', value: stats.communityTrusted.toString(), icon: Star, trend: '+23', trendUp: true },
    { title: 'Feedback Today', value: stats.feedbackToday.toString(), icon: MessageCircle, trend: '+8', trendUp: true },
    { title: 'Check-in Rate', value: `${stats.checkInRate}%`, icon: TrendingUp, trend: '+3%', trendUp: true },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tight text-foreground font-mono">
                Dashboard
              </h1>
              <p className="text-muted-foreground uppercase tracking-wide text-sm">
                Real-time overview of your community
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowChatObserver(!showChatObserver)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Chat</span>
              </Button>
              
              <Button asChild className="gap-2">
                <Link to="/admin/events">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">New Event</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Stats & Charts */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statsConfig.map((stat, index) => (
                  <div
                    key={stat.title}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <StatCard
                      title={stat.title}
                      value={isLoading ? '...' : stat.value}
                      icon={stat.icon}
                      trend={stat.trend}
                      trendUp={stat.trendUp}
                    />
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-in Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Check-in Performance
                    </CardTitle>
                    <div className="flex gap-4 text-xs mt-2 uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-secondary" />
                        On Time
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-[hsl(38_80%_55%)]" />
                        Late
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-destructive" />
                        No Show
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={checkInData}>
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11} 
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              border: '2px solid hsl(var(--border))',
                              borderRadius: '2px',
                            }}
                          />
                          <Bar dataKey="onTime" stackId="a" fill="hsl(150 25% 45%)" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="late" stackId="a" fill="hsl(38 80% 55%)" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="noShow" stackId="a" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      User Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowthData}>
                          <defs>
                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              border: '2px solid hsl(var(--border))',
                              borderRadius: '2px',
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="users" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorGrowth)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                    <Command className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Events', icon: Calendar, href: '/admin/events' },
                      { label: 'Members', icon: Users, href: '/admin/members' },
                      { label: 'Venues', icon: Building2, href: '/admin/venues' },
                      { label: 'Feedback', icon: MessageCircle, href: '/admin/feedback' },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        to={action.href}
                        className="group flex items-center gap-3 p-4 rounded-sm transition-all border-2 border-foreground hover:border-primary hover:bg-muted"
                      >
                        <div className="h-10 w-10 rounded-sm flex items-center justify-center bg-primary/10 border-2 border-primary/20">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wide">{action.label}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Live Activity */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <LiveActivityFeed />
                </CardContent>
              </Card>

              {showChatObserver && (
                <Card className="h-[500px]">
                  <AdminChatObserver />
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
