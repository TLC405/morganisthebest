import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

const TeamDashboard = () => {
  const todayStats = {
    eventsToday: 2,
    checkInsManaged: 18,
    pendingCheckIns: 6,
    upcomingEvents: 3,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Team Dashboard</h1>
          <p className="text-muted-foreground">Manage events and check-ins for Social Singles OKC</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold">{todayStats.eventsToday}</p>
              <p className="text-sm text-muted-foreground">Events Today</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">{todayStats.checkInsManaged}</p>
              <p className="text-sm text-muted-foreground">Check-ins Done</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-3xl font-bold text-yellow-600">{todayStats.pendingCheckIns}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-secondary mb-2" />
              <p className="text-3xl font-bold">{todayStats.upcomingEvents}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your assigned events will appear here with check-in management tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamDashboard;
