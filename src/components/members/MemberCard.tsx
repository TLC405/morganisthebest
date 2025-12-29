import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, Star, Sparkles, Target, Heart, Users, CheckCircle, 
  Clock, MapPin, Send, MessageCircle, TrendingUp, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
}: MemberCardProps) => {
  const initials = member.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const trustIndex = behaviorMetrics?.trust_index ?? member.trust_index ?? 50;
  const eventsCount = member.events_attended || 0;

  // Determine tier based on trust and activity
  const getTier = () => {
    if (trustIndex >= 80 && eventsCount >= 10) return 'platinum';
    if (trustIndex >= 60 && eventsCount >= 5) return 'gold';
    if (trustIndex >= 40) return 'silver';
    return 'bronze';
  };

  const tier = getTier();

  const tierStyles = {
    platinum: 'from-[hsl(280_60%_50%)] to-[hsl(320_70%_45%)]',
    gold: 'from-[hsl(45_80%_50%)] to-[hsl(35_90%_40%)]',
    silver: 'from-[hsl(220_20%_60%)] to-[hsl(220_15%_45%)]',
    bronze: 'from-[hsl(30_50%_40%)] to-[hsl(20_40%_30%)]',
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300',
        'bg-card border-border/50 rounded-2xl',
        'hover:border-border hover:-translate-y-1',
        'hover:shadow-[0_20px_40px_hsl(0_0%_0%/0.25)]',
        selected && 'ring-2 ring-primary border-primary',
        compact ? 'p-2' : ''
      )}
      onClick={onClick}
    >
      {/* Tier indicator line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1',
        `bg-gradient-to-r ${tierStyles[tier]}`
      )} />

      <CardContent className={cn('pt-5', compact ? 'p-3' : 'p-5')}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className={cn(
              'border-2 transition-transform duration-300',
              'group-hover:scale-105',
              tier === 'platinum' ? 'border-[hsl(280_60%_50%)]' :
              tier === 'gold' ? 'border-[hsl(45_80%_50%)]' :
              tier === 'silver' ? 'border-[hsl(220_20%_60%)]' :
              'border-border',
              compact ? 'h-14 w-14' : 'h-16 w-16'
            )}>
              <AvatarImage src={member.photo_url || ''} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-muted text-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicators */}
            {checkInStatus && (
              <div className={cn(
                'absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-card',
                checkInStatus === 'checked_in' && 'bg-emerald-500',
                checkInStatus === 'pending' && 'bg-amber-500',
                checkInStatus === 'late' && 'bg-orange-500'
              )}>
                {checkInStatus === 'checked_in' ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : (
                  <Clock className="h-3 w-3 text-white" />
                )}
              </div>
            )}

            {member.community_trusted && (
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                <Shield className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name & Basic Info */}
          <h3 className="font-semibold text-foreground text-sm truncate w-full">
            {member.name}{member.age ? `, ${member.age}` : ''}
          </h3>

          {member.area && !compact && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {member.area}
            </p>
          )}

          {/* Trust Score - Minimal */}
          {!compact && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className={cn(
                  'text-xs font-semibold',
                  trustIndex >= 70 ? 'text-emerald-400' :
                  trustIndex >= 50 ? 'text-amber-400' : 'text-muted-foreground'
                )}>
                  {Math.round(trustIndex)}
                </span>
              </div>
              
              <span className="text-muted-foreground/30">•</span>
              
              <span className="text-xs text-muted-foreground">
                {eventsCount} events
              </span>
            </div>
          )}

          {/* Activity indicators */}
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
                'mt-3 text-xs font-semibold',
                compatibilityScore >= 80 && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                compatibilityScore >= 60 && compatibilityScore < 80 && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
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
