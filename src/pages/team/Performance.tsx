import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const TeamPerformance = () => {
  const performance = {
    eventsManaged: 12,
    avgSetupRating: 4.8,
    avgFeedbackScore: 4.9,
    issuesReported: 3,
    issuesResolved: 3,
    onTimeRate: 98,
  };

  const recentEvents = [
    { id: '1', title: 'Speed Dating Night', date: 'Jan 15', rating: 5.0 },
    { id: '2', title: 'Wine & Mingle', date: 'Jan 12', rating: 4.8 },
    { id: '3', title: 'Coffee Connections', date: 'Jan 8', rating: 4.7 },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Performance</h1>
          <p className="text-muted-foreground">Track your event management performance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold">{performance.eventsManaged}</p>
              <p className="text-sm text-muted-foreground">Events Managed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto text-primary fill-primary mb-2" />
              <p className="text-3xl font-bold">{performance.avgSetupRating}</p>
              <p className="text-sm text-muted-foreground">Setup Rating</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">{performance.onTimeRate}%</p>
              <p className="text-sm text-muted-foreground">On-Time Rate</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-secondary mb-2" />
              <p className="text-3xl font-bold">{performance.issuesResolved}/{performance.issuesReported}</p>
              <p className="text-sm text-muted-foreground">Issues Resolved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Performance Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Setup Quality</span>
                  <span className="font-semibold">{performance.avgSetupRating}/5</span>
                </div>
                <Progress value={performance.avgSetupRating * 20} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Attendee Feedback</span>
                  <span className="font-semibold">{performance.avgFeedbackScore}/5</span>
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

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="font-semibold">{event.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeamPerformance;
