import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, Star, Sparkles, Target, Heart, Users, CheckCircle, 
  Clock, MapPin, Send, MessageCircle, TrendingUp, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStaggerDelay } from '@/lib/animations';

export interface MemberData {
  id: string;
  name: string;
  age?: number | null;
  photo_url?: string | null;
  area?: string | null;
  looking_for?: string | null;
  community_trusted?: boolean | null;
  events_attended?: number | null;
  show_up_rate?: number | null;
  response_rate?: number | null;
  interests?: string[] | null;
  occupation?: string | null;
  bio?: string | null;
  verification_level?: string | null;
  trust_index?: number | null;
  trust_level?: string | null;
}

export interface BehaviorMetrics {
  trust_index?: number | null;
  trust_level?: string | null;
  waves_sent?: number | null;
  waves_received?: number | null;
  messages_sent?: number | null;
  messages_received?: number | null;
  avg_response_time_mins?: number | null;
  positive_feedback_received?: number | null;
  reports_received?: number | null;
}

export interface EventRole {
  role_type: 'host' | 'icebreaker' | 'mentor' | 'newcomer' | 'regular' | 'success_story';
  role_description?: string | null;
}

interface MemberCardProps {
  member: MemberData;
  behaviorMetrics?: BehaviorMetrics;
  eventRoles?: EventRole[];
  compatibilityScore?: number;
  checkInStatus?: 'checked_in' | 'pending' | 'late';
  checkInTime?: string;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
  index?: number;
}

const roleIcons: Record<string, typeof Crown> = {
  host: Crown,
  icebreaker: Users,
  mentor: Star,
  newcomer: Sparkles,
  regular: Target,
  success_story: Heart,
};

const roleLabels: Record<string, string> = {
  host: 'Host',
  icebreaker: 'Icebreaker',
  mentor: 'Mentor',
  newcomer: 'Newcomer',
  regular: 'Regular',
  success_story: 'Success Story',
};

export const MemberCard = ({
  member,
  behaviorMetrics,
  eventRoles = [],
  compatibilityScore,
  checkInStatus,
  checkInTime,
  onClick,
  selected = false,
  compact = false,
  index = 0,
}: MemberCardProps) => {
  const initials = member.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const trustIndex = behaviorMetrics?.trust_index ?? member.trust_index ?? 50;
  const eventsCount = member.events_attended || 0;

  // Determine tier
  const getTier = () => {
    if (trustIndex >= 80 && eventsCount >= 10) return 'platinum';
    if (trustIndex >= 60 && eventsCount >= 5) return 'gold';
    if (trustIndex >= 40) return 'silver';
    return 'bronze';
  };

  const tier = getTier();

  const tierColors: Record<string, string> = {
    platinum: 'bg-[hsl(280_60%_50%)]',
    gold: 'bg-[hsl(45_80%_50%)]',
    silver: 'bg-[hsl(220_20%_60%)]',
    bronze: 'bg-[hsl(30_50%_40%)]',
  };

  const staggerDelay = getStaggerDelay(index);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-hard-primary',
        selected && 'ring-2 ring-primary border-primary',
        compact ? 'p-2' : ''
      )}
      onClick={onClick}
      style={{ animationDelay: staggerDelay }}
    >
      {/* Tier indicator */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', tierColors[tier])} />

      <CardContent className={cn('pt-5', compact ? 'p-3' : 'p-5')}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className={cn(
              'border-2 border-primary rounded-sm transition-transform duration-200 group-hover:scale-105',
              compact ? 'h-14 w-14' : 'h-16 w-16'
            )}>
              <AvatarImage src={member.photo_url || ''} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-muted text-foreground font-bold rounded-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicators */}
            {checkInStatus && (
              <div className={cn(
                'absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center border-2 border-card rounded-sm',
                checkInStatus === 'checked_in' && 'bg-secondary',
                checkInStatus === 'pending' && 'bg-[hsl(38_80%_55%)]',
                checkInStatus === 'late' && 'bg-[hsl(25_80%_50%)]'
              )}>
                {checkInStatus === 'checked_in' ? (
                  <CheckCircle className="h-3 w-3 text-secondary-foreground" />
                ) : (
                  <Clock className="h-3 w-3 text-foreground" />
                )}
              </div>
            )}

            {member.community_trusted && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary flex items-center justify-center border-2 border-card rounded-sm">
                <Shield className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wide truncate w-full">
            {member.name}{member.age ? `, ${member.age}` : ''}
          </h3>

          {member.area && !compact && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 uppercase tracking-wide">
              <MapPin className="h-3 w-3" />
              {member.area}
            </p>
          )}

          {/* Trust Score */}
          {!compact && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className={cn(
                  'text-xs font-bold',
                  trustIndex >= 70 ? 'text-secondary' :
                  trustIndex >= 50 ? 'text-[hsl(38_80%_55%)]' : 'text-muted-foreground'
                )}>
                  {Math.round(trustIndex)}
                </span>
              </div>
              
              <span className="text-muted-foreground/30">•</span>
              
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {eventsCount} events
              </span>
            </div>
          )}

          {/* Activity */}
          {!compact && behaviorMetrics && (
            <div className="flex items-center gap-3 mt-2">
              {behaviorMetrics.waves_sent !== undefined && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Send className="h-3 w-3 text-primary" />
                  {behaviorMetrics.waves_sent}
                </span>
              )}
              {behaviorMetrics.messages_sent !== undefined && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3 text-secondary" />
                  {behaviorMetrics.messages_sent}
                </span>
              )}
            </div>
          )}

          {/* Compatibility */}
          {compatibilityScore !== undefined && (
            <Badge 
              variant="outline" 
              className={cn(
                'mt-3 text-xs',
                compatibilityScore >= 80 && 'bg-secondary/10 text-secondary border-secondary/30',
                compatibilityScore >= 60 && compatibilityScore < 80 && 'bg-[hsl(38_80%_55%)/0.1] text-[hsl(38_80%_55%)] border-[hsl(38_80%_55%)/0.3]',
                compatibilityScore < 60 && 'bg-muted text-muted-foreground'
              )}
            >
              {compatibilityScore}% Match
            </Badge>
          )}

          {/* Event roles */}
          {eventRoles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 justify-center">
              {eventRoles.slice(0, 2).map((role, idx) => {
                const Icon = roleIcons[role.role_type] || Target;
                return (
                  <Badge key={idx} variant="outline" className="text-xs py-0.5">
                    <Icon className="h-3 w-3 mr-1" />
                    {roleLabels[role.role_type]}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
