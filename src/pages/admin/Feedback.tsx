import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Minus, MessageCircle } from 'lucide-react';

const AdminFeedback = () => {
  const feedbackStats = {
    totalToday: 45,
    positive: 38,
    neutral: 5,
    negative: 2,
  };

  const recentFeedback = [
    {
      id: '1',
      from: 'Sarah J.',
      to: 'Mike C.',
      event: 'Speed Dating Night',
      type: 'positive',
      tags: ['Great conversation', 'Friendly'],
      date: '2024-01-20',
    },
    {
      id: '2',
      from: 'Emily D.',
      to: 'John S.',
      event: 'Wine & Mingle',
      type: 'positive',
      tags: ['Respectful', 'Fun to talk to'],
      date: '2024-01-20',
    },
    {
      id: '3',
      from: 'Alex R.',
      to: 'Chris M.',
      event: 'Speed Dating Night',
      type: 'neutral',
      tags: ['Brief interaction'],
      date: '2024-01-20',
    },
  ];

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Feedback Analytics</h1>
          <p className="text-muted-foreground">Monitor community feedback and badge qualification progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold">{feedbackStats.totalToday}</p>
              <p className="text-sm text-muted-foreground">Today's Feedback</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <ThumbsUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">{feedbackStats.positive}</p>
              <p className="text-sm text-muted-foreground">Positive</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <Minus className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-3xl font-bold text-yellow-600">{feedbackStats.neutral}</p>
              <p className="text-sm text-muted-foreground">Neutral</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <ThumbsDown className="h-8 w-8 mx-auto text-destructive mb-2" />
              <p className="text-3xl font-bold text-destructive">{feedbackStats.negative}</p>
              <p className="text-sm text-muted-foreground">Negative</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getFeedbackIcon(feedback.type)}
                      <span className="font-medium">{feedback.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{feedback.to}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.event}</p>
                    <div className="flex gap-1 flex-wrap">
                      {feedback.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminFeedback;
