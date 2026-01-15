import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Minus, MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackItem {
  id: string;
  feedback_type: 'positive' | 'neutral' | 'negative';
  feedback_tags: string[] | null;
  comment: string | null;
  created_at: string;
  from_user: { name: string } | null;
  to_user: { name: string } | null;
  event: { title: string } | null;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState({ total: 0, positive: 0, neutral: 0, negative: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    setIsLoading(true);
    
    // Fetch recent feedback with related data
    const { data: feedbackData } = await supabase
      .from('feedback')
      .select(`
        id,
        feedback_type,
        feedback_tags,
        comment,
        created_at,
        from_user:from_user_id(name),
        to_user:to_user_id(name),
        event:event_id(title)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get counts by type
    const { count: totalCount } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true });

    const { count: positiveCount } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('feedback_type', 'positive');

    const { count: neutralCount } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('feedback_type', 'neutral');

    const { count: negativeCount } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('feedback_type', 'negative');

    setFeedback((feedbackData as unknown as FeedbackItem[]) || []);
    setStats({
      total: totalCount || 0,
      positive: positiveCount || 0,
      neutral: neutralCount || 0,
      negative: negativeCount || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-secondary" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-accent" />;
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
          <Card variant="elevated">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto" />
              ) : (
                <p className="text-3xl font-bold">{stats.total}</p>
              )}
              <p className="text-sm text-muted-foreground">Total Feedback</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6 text-center">
              <ThumbsUp className="h-8 w-8 mx-auto text-secondary mb-2" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto" />
              ) : (
                <p className="text-3xl font-bold text-secondary">{stats.positive}</p>
              )}
              <p className="text-sm text-muted-foreground">Positive</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6 text-center">
              <Minus className="h-8 w-8 mx-auto text-accent mb-2" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto" />
              ) : (
                <p className="text-3xl font-bold text-accent-foreground">{stats.neutral}</p>
              )}
              <p className="text-sm text-muted-foreground">Neutral</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6 text-center">
              <ThumbsDown className="h-8 w-8 mx-auto text-destructive mb-2" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto" />
              ) : (
                <p className="text-3xl font-bold text-destructive">{stats.negative}</p>
              )}
              <p className="text-sm text-muted-foreground">Negative</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No feedback submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start justify-between p-4 border-2 border-border hover:border-primary transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getFeedbackIcon(item.feedback_type)}
                        <span className="font-medium">{item.from_user?.name || 'Unknown'}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{item.to_user?.name || 'Unknown'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.event?.title || 'Unknown Event'}</p>
                      {item.comment && (
                        <p className="text-sm text-foreground italic">"{item.comment}"</p>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        {item.feedback_tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminFeedback;
