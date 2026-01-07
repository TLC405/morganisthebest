import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, Star, Sparkles, Target, Heart, Users, CheckCircle, 
  Clock, MapPin, Send, MessageCircle, TrendingUp, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeVariant } from '@/contexts/ThemeVariantContext';
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
  const { variant } = useThemeVariant();
  
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

  // Variant-specific tier styles
  const tierStyles: Record<string, Record<string, string>> = {
    glass: {
      platinum: 'from-[hsl(280_60%_50%/0.8)] to-[hsl(320_70%_45%/0.8)]',
      gold: 'from-[hsl(45_80%_50%/0.8)] to-[hsl(35_90%_40%/0.8)]',
      silver: 'from-[hsl(220_20%_60%/0.8)] to-[hsl(220_15%_45%/0.8)]',
      bronze: 'from-[hsl(30_50%_40%/0.8)] to-[hsl(20_40%_30%/0.8)]',
    },
    brutal: {
      platinum: 'bg-[hsl(280_60%_50%)]',
      gold: 'bg-[hsl(45_80%_50%)]',
      silver: 'bg-[hsl(220_20%_60%)]',
      bronze: 'bg-[hsl(30_50%_40%)]',
    },
    luxe: {
      platinum: 'from-[hsl(45_80%_50%)] to-[hsl(45_60%_30%)]',
      gold: 'from-[hsl(45_80%_50%)] to-[hsl(35_90%_40%)]',
      silver: 'from-[hsl(220_10%_50%)] to-[hsl(220_10%_30%)]',
      bronze: 'from-[hsl(30_30%_35%)] to-[hsl(20_20%_25%)]',
    },
    default: {
      platinum: 'from-[hsl(280_60%_50%)] to-[hsl(320_70%_45%)]',
      gold: 'from-[hsl(45_80%_50%)] to-[hsl(35_90%_40%)]',
      silver: 'from-[hsl(220_20%_60%)] to-[hsl(220_15%_45%)]',
      bronze: 'from-[hsl(30_50%_40%)] to-[hsl(20_40%_30%)]',
    }
  };

  const currentTierStyles = tierStyles[variant] || tierStyles.default;

  // Variant-specific card styles
  const variantCardStyles: Record<string, string> = {
    glass: 'card-variant bg-transparent',
    neumorphic: 'card-variant',
    swiss: 'card-variant',
    luxe: 'card-variant',
    flutter: 'card-variant',
    brutal: 'card-variant',
    editorial: 'card-variant',
    aurora: 'card-variant bg-transparent',
  };

  // Variant-specific avatar border colors
  const getAvatarBorderClass = () => {
    const base = 'border-2 transition-transform duration-300 group-hover:scale-105';
    
    if (variant === 'brutal') {
      return cn(base, 'rounded-none border-foreground');
    }
    
    if (variant === 'swiss') {
      return cn(base, 'rounded-none border-foreground');
    }

    const tierBorders: Record<string, string> = {
      platinum: 'border-[hsl(280_60%_50%)]',
      gold: 'border-[hsl(45_80%_50%)]',
      silver: 'border-[hsl(220_20%_60%)]',
      bronze: 'border-border',
    };
    
    return cn(base, tierBorders[tier]);
  };

  const staggerDelay = getStaggerDelay(index, variant);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300',
        'hover:-translate-y-1',
        variantCardStyles[variant],
        selected && 'ring-2 ring-primary border-primary',
        compact ? 'p-2' : ''
      )}
      onClick={onClick}
      style={{ animationDelay: staggerDelay }}
    >
      {/* Tier indicator line */}
      <div className={cn(
        'absolute top-0 left-0 right-0',
        variant === 'brutal' ? 'h-2' : 'h-1',
        variant === 'brutal' ? currentTierStyles[tier] : `bg-gradient-to-r ${currentTierStyles[tier]}`
      )} />

      <CardContent className={cn('pt-5', compact ? 'p-3' : 'p-5')}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className={cn(
              getAvatarBorderClass(),
              compact ? 'h-14 w-14' : 'h-16 w-16',
              variant === 'brutal' && 'rounded-none',
              variant === 'swiss' && 'rounded-none'
            )}>
              <AvatarImage src={member.photo_url || ''} alt={member.name} className="object-cover" />
              <AvatarFallback className={cn(
                'bg-muted text-foreground font-semibold',
                variant === 'brutal' && 'rounded-none font-grotesk',
                variant === 'luxe' && 'font-playfair'
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicators */}
            {checkInStatus && (
              <div className={cn(
                'absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center border-2 border-card',
                checkInStatus === 'checked_in' && 'bg-emerald-500',
                checkInStatus === 'pending' && 'bg-amber-500',
                checkInStatus === 'late' && 'bg-orange-500',
                variant === 'brutal' ? 'rounded-none' : 'rounded-full'
              )}>
                {checkInStatus === 'checked_in' ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : (
                  <Clock className="h-3 w-3 text-white" />
                )}
              </div>
            )}

            {member.community_trusted && (
              <div className={cn(
                'absolute -top-1 -right-1 h-5 w-5 bg-primary flex items-center justify-center border-2 border-card',
                variant === 'brutal' ? 'rounded-none' : 'rounded-full'
              )}>
                <Shield className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name & Basic Info */}
          <h3 className={cn(
            'font-semibold text-foreground text-sm truncate w-full',
            variant === 'luxe' && 'font-playfair text-base',
            variant === 'brutal' && 'font-grotesk uppercase',
            variant === 'swiss' && 'uppercase tracking-wider text-xs',
            variant === 'editorial' && 'font-sora font-light'
          )}>
            {member.name}{member.age ? `, ${member.age}` : ''}
          </h3>

          {member.area && !compact && (
            <p className={cn(
              'text-xs text-muted-foreground flex items-center gap-1 mt-1',
              variant === 'swiss' && 'uppercase tracking-wider text-[10px]'
            )}>
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
                  trustIndex >= 50 ? 'text-amber-400' : 'text-muted-foreground',
                  variant === 'brutal' && 'font-grotesk'
                )}>
                  {Math.round(trustIndex)}
                </span>
              </div>
              
              <span className="text-muted-foreground/30">•</span>
              
              <span className={cn(
                'text-xs text-muted-foreground',
                variant === 'swiss' && 'uppercase tracking-wider text-[10px]'
              )}>
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
                'mt-3 text-xs font-semibold badge-variant',
                compatibilityScore >= 80 && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                compatibilityScore >= 60 && compatibilityScore < 80 && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                compatibilityScore < 60 && 'bg-muted text-muted-foreground',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none uppercase text-[10px]'
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
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={cn(
                      'text-xs py-0.5 badge-variant',
                      variant === 'brutal' && 'rounded-none',
                      variant === 'swiss' && 'rounded-none uppercase text-[10px]'
                    )}
                  >
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
