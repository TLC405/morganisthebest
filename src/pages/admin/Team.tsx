import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Star, AlertCircle, CheckCircle } from 'lucide-react';

const AdminTeam = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'Emily Davis',
      email: 'emily@tlc.com',
      eventsManaged: 12,
      avgSetupRating: 4.8,
      avgFeedbackScore: 4.9,
      issuesReported: 3,
      issuesResolved: 3,
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@tlc.com',
      eventsManaged: 8,
      avgSetupRating: 4.5,
      avgFeedbackScore: 4.6,
      issuesReported: 5,
      issuesResolved: 4,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Performance</h1>
            <p className="text-muted-foreground">Operations crew performance scoring and management</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.id} className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="secondary">Team</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Events Managed:</span>
                  <span className="font-semibold ml-2">{member.eventsManaged}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Setup Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="font-semibold">{member.avgSetupRating}/5</span>
                    </div>
                  </div>
                  <Progress value={member.avgSetupRating * 20} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attendee Feedback</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="font-semibold">{member.avgFeedbackScore}/5</span>
                    </div>
                  </div>
                  <Progress value={member.avgFeedbackScore * 20} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>{member.issuesReported} issues reported</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{member.issuesResolved} resolved</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Full History
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminTeam;
