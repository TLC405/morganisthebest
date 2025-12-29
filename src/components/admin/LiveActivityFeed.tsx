import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle2, 
  MessageCircle, 
  Users, 
  Calendar, 
  Heart,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'check_in' | 'wave' | 'message' | 'signup' | 'event' | 'match';
  title: string;
  description: string;
  timestamp: Date;
  avatar?: string;
  meta?: string;
}

const activityConfig = {
  check_in: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  wave: { icon: Heart, color: 'text-primary', bg: 'bg-primary/10' },
  message: { icon: MessageCircle, color: 'text-secondary', bg: 'bg-secondary/10' },
  signup: { icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
  event: { icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  match: { icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-400/10' },
};

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initial mock data - will be replaced with real subscriptions
    setActivities([
      { id: '1', type: 'check_in', title: 'Check-in', description: 'Sarah arrived at Wine & Mingle', timestamp: new Date(Date.now() - 120000), meta: 'On time' },
      { id: '2', type: 'wave', title: 'New Wave', description: 'Alex waved at Jordan', timestamp: new Date(Date.now() - 300000), meta: '92% match' },
      { id: '3', type: 'match', title: 'Mutual Match', description: 'Emma & Michael matched!', timestamp: new Date(Date.now() - 600000) },
      { id: '4', type: 'message', title: 'Conversation', description: 'New group chat created', timestamp: new Date(Date.now() - 900000), meta: 'Event Chat' },
      { id: '5', type: 'signup', title: 'New Member', description: 'Chris joined the community', timestamp: new Date(Date.now() - 1800000) },
    ]);

    // Subscribe to realtime changes
    const channel = supabase
      .channel('live-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_attendance' }, (payload) => {
        const newActivity: ActivityItem = {
          id: payload.new.id,
          type: 'check_in',
          title: 'Check-in',
          description: 'Someone checked in',
          timestamp: new Date(),
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waves' }, (payload) => {
        const newActivity: ActivityItem = {
          id: payload.new.id,
          type: 'wave',
          title: 'New Wave',
          description: 'Someone sent a wave',
          timestamp: new Date(),
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-foreground" />
          <span className="font-semibold text-foreground">Live Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'h-2 w-2 rounded-full animate-pulse',
            isLive ? 'bg-emerald-400' : 'bg-muted-foreground'
          )} />
          <span className="text-xs text-muted-foreground">
            {isLive ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div
              key={activity.id}
              className={cn(
                'group flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
                'hover:bg-muted/50 cursor-pointer',
                'opacity-0 animate-fade-in-up'
              )}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className={cn('p-2 rounded-lg', config.bg)}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{activity.title}</span>
                  {activity.meta && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {activity.meta}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
