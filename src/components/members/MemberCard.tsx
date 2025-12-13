import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Sparkles, Target, Heart, Users, CheckCircle, Clock, MapPin, Send, MessageCircle, TrendingUp } from 'lucide-react';
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

const roleColors: Record<string, string> = {
  host: 'bg-primary/20 text-primary border-primary/30',
  icebreaker: 'bg-secondary/20 text-secondary border-secondary/30',
  mentor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  newcomer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  regular: 'bg-muted text-muted-foreground border-border',
  success_story: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const roleLabels: Record<string, string> = {
  host: 'Host',
  icebreaker: 'Icebreaker',
  mentor: 'Mentor',
  newcomer: 'Newcomer',
  regular: 'Regular',
  success_story: 'Success Story',
};

const trustLevelColors: Record<string, string> = {
  rising_star: 'text-emerald-400',
  community_trusted: 'text-amber-400',
  veteran: 'text-purple-400',
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
  const trustLevel = behaviorMetrics?.trust_level ?? member.trust_level ?? 'rising_star';

  return (
    <Card
      variant="glass"
      className={cn(
        'cursor-pointer hover-lift border-border/50 opacity-0 animate-fade-in-up',
        selected && 'ring-2 ring-primary border-primary',
        compact ? 'p-2' : ''
      )}
      style={{ animationFillMode: 'forwards' }}
      onClick={onClick}
    >
      <CardContent className={compact ? 'p-2' : 'p-4'}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar with status indicator */}
          <div className="relative mb-3">
            <Avatar className={cn('border-2 border-border', compact ? 'h-16 w-16' : 'h-20 w-20')}>
              <AvatarImage src={member.photo_url || ''} alt={member.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Check-in status indicator */}
            {checkInStatus && (
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background',
                  checkInStatus === 'checked_in' && 'bg-emerald-500',
                  checkInStatus === 'pending' && 'bg-amber-500',
                  checkInStatus === 'late' && 'bg-orange-500'
                )}
              >
                {checkInStatus === 'checked_in' ? (
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-white" />
                )}
              </div>
            )}

            {/* Community trusted badge */}
            {member.community_trusted && (
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-glow">
                <Star className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name and age */}
          <h3 className="font-semibold text-foreground truncate w-full">
            {member.name}{member.age && `, ${member.age}`}
          </h3>

          {/* Location */}
          {member.area && !compact && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {member.area}
            </p>
          )}

          {/* Trust Index Bar */}
          {!compact && (
            <div className="w-full mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  Trust
                </span>
                <span className={cn('font-semibold', trustLevelColors[trustLevel] || 'text-foreground')}>
                  {Math.round(trustIndex)}%
                </span>
              </div>
              <Progress 
                value={trustIndex} 
                className="h-1.5"
              />
            </div>
          )}

          {/* Behavior metrics summary */}
          {!compact && behaviorMetrics && (
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {behaviorMetrics.waves_sent !== undefined && (
                <span className="flex items-center gap-1" title="Waves sent/received">
                  <Send className="h-3 w-3 text-primary" />
                  {behaviorMetrics.waves_sent}/{behaviorMetrics.waves_received || 0}
                </span>
              )}
              {behaviorMetrics.messages_sent !== undefined && (
                <span className="flex items-center gap-1" title="Messages">
                  <MessageCircle className="h-3 w-3 text-secondary" />
                  {behaviorMetrics.messages_sent}
                </span>
              )}
            </div>
          )}

          {/* Compatibility score */}
          {compatibilityScore !== undefined && (
            <div className="mt-2">
              <Badge 
                variant="outline" 
                className={cn(
                  'font-bold',
                  compatibilityScore >= 80 && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  compatibilityScore >= 60 && compatibilityScore < 80 && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  compatibilityScore < 60 && 'bg-muted text-muted-foreground'
                )}
              >
                {compatibilityScore}% Match
              </Badge>
            </div>
          )}

          {/* Check-in time */}
          {checkInTime && checkInStatus === 'checked_in' && !compact && (
            <p className="text-xs text-muted-foreground mt-1">
              ✓ {checkInTime}
            </p>
          )}

          {/* Event roles */}
          {eventRoles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 justify-center">
              {eventRoles.map((role, idx) => {
                const Icon = roleIcons[role.role_type] || Target;
                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={cn('text-xs', roleColors[role.role_type])}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {roleLabels[role.role_type]}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Stats row - fallback if no behavior metrics */}
          {!compact && !behaviorMetrics && (
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {member.events_attended !== undefined && member.events_attended !== null && (
                <span>{member.events_attended} events</span>
              )}
              {member.show_up_rate !== undefined && member.show_up_rate !== null && (
                <span className={member.show_up_rate >= 90 ? 'text-emerald-400' : ''}>
                  {member.show_up_rate}% show-up
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
