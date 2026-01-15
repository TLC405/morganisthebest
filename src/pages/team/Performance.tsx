import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Calendar, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface PerformanceData {
  eventsManaged: number;
  avgSetupRating: number;
  avgFeedbackScore: number;
  issuesReported: number;
  issuesResolved: number;
  onTimeRate: number;
}

interface RecentEvent {
  id: string;
  title: string;
  date: string;
  rating: number;
}

const TeamPerformance = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!user) return;
      
      setIsLoading(true);

      // Fetch team performance records
      const { data: performanceData } = await supabase
        .from('team_performance')
        .select(`
          *,
          events (title, date)
        `)
        .eq('team_user_id', user.id)
        .order('created_at', { ascending: false });

      if (performanceData && performanceData.length > 0) {
        // Calculate aggregates
        const totalEvents = performanceData.length;
        const avgSetup = performanceData.reduce((acc, p) => acc + (p.setup_rating || 0), 0) / totalEvents;
        const avgFeedback = performanceData.reduce((acc, p) => acc + (p.attendee_feedback_score || 0), 0) / totalEvents;
        const totalIssues = performanceData.reduce((acc, p) => acc + (p.issues_reported || 0), 0);
        const totalResolved = performanceData.reduce((acc, p) => acc + (p.resolved_count || 0), 0);

        setPerformance({
          eventsManaged: totalEvents,
          avgSetupRating: avgSetup || 0,
          avgFeedbackScore: avgFeedback || 0,
          issuesReported: totalIssues,
          issuesResolved: totalResolved,
          onTimeRate: 98, // Would need additional logic to calculate
        });

        setRecentEvents(performanceData.slice(0, 5).map(p => ({
          id: p.id,
          title: p.events?.title || 'Unknown Event',
          date: p.events?.date || 'Unknown',
          rating: p.setup_rating || 0,
        })));
      } else {
        // Default values if no data
        setPerformance({
          eventsManaged: 0,
          avgSetupRating: 0,
          avgFeedbackScore: 0,
          issuesReported: 0,
          issuesResolved: 0,
          onTimeRate: 0,
        });
      }

      setIsLoading(false);
    };

    fetchPerformance();
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Performance</h1>
          <p className="text-muted-foreground">Track your event management performance</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} variant="elevated">
                  <CardContent className="pt-6 text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-2" />
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : performance ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card variant="elevated">
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-3xl font-bold">{performance.eventsManaged}</p>
                  <p className="text-sm text-muted-foreground">Events Managed</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-primary fill-primary mb-2" />
                  <p className="text-3xl font-bold">{performance.avgSetupRating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Setup Rating</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-secondary mb-2" />
                  <p className="text-3xl font-bold text-secondary">{performance.onTimeRate}%</p>
                  <p className="text-sm text-muted-foreground">On-Time Rate</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-accent mb-2" />
                  <p className="text-3xl font-bold">{performance.issuesResolved}/{performance.issuesReported}</p>
                  <p className="text-sm text-muted-foreground">Issues Resolved</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Performance Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Setup Quality</span>
                      <span className="font-semibold">{performance.avgSetupRating.toFixed(1)}/5</span>
                    </div>
                    <Progress value={performance.avgSetupRating * 20} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Attendee Feedback</span>
                      <span className="font-semibold">{performance.avgFeedbackScore.toFixed(1)}/5</span>
                    </div>
                    <Progress value={performance.avgFeedbackScore * 20} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Punctuality</span>
                      <span className="font-semibold">{performance.onTimeRate}%</span>
                    </div>
                    <Progress value={performance.onTimeRate} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No events managed yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div 
                          key={event.id}
                          className="flex items-center justify-between p-3 border-2 border-border"
                        >
                          <div>
                            <p className="font-medium text-foreground">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <span className="font-semibold">{event.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
};

export default TeamPerformance;
