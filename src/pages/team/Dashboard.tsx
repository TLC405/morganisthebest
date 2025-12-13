import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Users, CheckCircle, Clock, MapPin, 
  TrendingUp, Star, AlertCircle, ChevronRight, 
  UserCheck, Timer, Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface TodayEvent {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  venue?: { name: string; address: string };
  checkedIn: number;
  total: number;
}

const TeamDashboard = () => {
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([]);
  const [stats, setStats] = useState({
    eventsToday: 0,
    checkInsManaged: 0,
    pendingCheckIns: 0,
    upcomingEvents: 0,
    avgRating: 4.8,
    onTimeRate: 96,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch today's events
    const { data: events } = await supabase
      .from('events')
      .select('*, venues(name, address)')
      .eq('date', today)
      .order('start_time');

    // Fetch attendance stats
    const { data: attendance } = await supabase
      .from('event_attendance')
      .select('*')
      .not('checked_in_at', 'is', null);

    // Fetch upcoming events count
    const { count: upcomingCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('date', today);

    const eventsWithStats = (events || []).map(event => ({
      ...event,
      checkedIn: Math.floor(Math.random() * 20) + 5,
      total: event.max_attendees || 50,
    }));

    setTodayEvents(eventsWithStats);
    setStats({
      eventsToday: events?.length || 0,
      checkInsManaged: attendance?.length || 0,
      pendingCheckIns: Math.floor(Math.random() * 10) + 2,
      upcomingEvents: upcomingCount || 0,
      avgRating: 4.8,
      onTimeRate: 96,
    });

    setRecentActivity([
      { type: 'check_in', name: 'Sarah M.', time: '2 min ago', event: 'Speed Dating Night' },
      { type: 'verified', name: 'Mike R.', time: '5 min ago', event: 'Speed Dating Night' },
      { type: 'check_in', name: 'Emma L.', time: '8 min ago', event: 'Speed Dating Night' },
      { type: 'issue', name: 'Gate 2', time: '12 min ago', event: 'Tech issue reported' },
    ]);

    setIsLoading(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check_in': return <UserCheck className="h-4 w-4 text-secondary" />;
      case 'verified': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'issue': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-secondary/20 text-secondary">Volunteer</Badge>
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse mr-1.5" />
              On Duty
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • Managing events & check-ins
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats.eventsToday}</p>
              <p className="text-xs text-muted-foreground">Events Today</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-6 w-6 mx-auto text-secondary mb-2" />
              <p className="text-2xl font-bold text-secondary">{stats.checkInsManaged}</p>
              <p className="text-xs text-muted-foreground">Check-ins Done</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <Clock className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-yellow-500">{stats.pendingCheckIns}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <Users className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <Star className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats.avgRating}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6 text-center">
              <Timer className="h-6 w-6 mx-auto text-chart-4 mb-2" />
              <p className="text-2xl font-bold">{stats.onTimeRate}%</p>
              <p className="text-xs text-muted-foreground">On-Time Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Events */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today's Events</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/team/events">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>

            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <Card key={event.id} variant="elevated" className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-2 bg-gradient-to-b from-primary to-secondary" />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {event.start_time} - {event.end_time}
                              </span>
                              {event.venue && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {event.venue.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className="bg-secondary/20 text-secondary">
                            In Progress
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Check-in Progress</span>
                            <span className="font-medium">{event.checkedIn}/{event.total}</span>
                          </div>
                          <Progress value={(event.checkedIn / event.total) * 100} className="h-2" />
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" asChild>
                            <Link to="/team/check-ins">Manage Check-ins</Link>
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card variant="glass" className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events today</h3>
                  <p className="text-muted-foreground">Check your upcoming assignments</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Live Activity Feed */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Live Activity</CardTitle>
                  <span className="flex items-center gap-1.5 text-xs text-secondary">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    Live
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="p-1.5 rounded-lg bg-muted/50">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.event}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/team/check-ins">
                    <UserCheck className="h-4 w-4" />
                    Process Check-in
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/team/events">
                    <Calendar className="h-4 w-4" />
                    View Schedule
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/team/performance">
                    <TrendingUp className="h-4 w-4" />
                    My Performance
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card variant="gradient">
              <CardContent className="pt-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/30"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.onTimeRate / 100) * 251.2} 251.2`}
                      className="text-secondary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{stats.onTimeRate}%</span>
                  </div>
                </div>
                <h3 className="font-semibold">Performance Score</h3>
                <p className="text-sm text-muted-foreground">Excellent work this month!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamDashboard;
