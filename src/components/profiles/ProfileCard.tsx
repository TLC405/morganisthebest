import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerificationBadge } from './VerificationBadge';
import { ResponseStats } from './ResponseStats';
import { MysteryCard } from './MysteryCard';
import { CompatibilityBadge } from '@/components/quiz/CompatibilityBadge';
import { useThemeVariant } from '@/contexts/ThemeVariantContext';
import { cn } from '@/lib/utils';
import { getStaggerDelay } from '@/lib/animations';

// Simple profile type for display (works with both mock and real data)
interface DisplayProfile {
  id: string;
  name: string;
  age: number;
  ageRange?: string;
  area: string;
  bio: string;
  interests: string[];
  interestTags?: string[];
  photoUrl: string;
  eventsAttended?: string[];
  role?: string;
  verificationLevel: string;
  responseRate: number;
  showUpRate: number;
  totalConnections?: number;
  religion?: string | null;
  lookingFor?: string | null;
}

interface ProfileCardProps {
  profile: DisplayProfile;
  onWave?: (profileId: string) => void;
  forceReveal?: boolean;
  compatibilityPercentage?: number;
  compatibilityReasons?: string[];
  index?: number;
}

export const ProfileCard = ({ 
  profile, 
  onWave, 
  forceReveal = false, 
  compatibilityPercentage, 
  compatibilityReasons,
  index = 0 
}: ProfileCardProps) => {
  const { variant } = useThemeVariant();
  
  // Always reveal if forceReveal is true (for connections page)
  const isRevealed = forceReveal;

  // Show mystery card for unrevealed profiles
  if (!isRevealed) {
    return <MysteryCard profile={profile as any} upcomingEventCount={1} />;
  }

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

  const variantImageStyles: Record<string, string> = {
    glass: 'rounded-t-2xl',
    neumorphic: 'rounded-t-[1.25rem]',
    swiss: 'rounded-none',
    luxe: 'rounded-t-lg',
    flutter: 'rounded-t-xl',
    brutal: 'rounded-none',
    editorial: 'rounded-none',
    aurora: 'rounded-t-3xl',
  };

  const variantButtonStyles: Record<string, string> = {
    glass: 'btn-variant rounded-full',
    neumorphic: 'btn-variant rounded-xl',
    swiss: 'btn-variant rounded-none uppercase tracking-wider text-sm',
    luxe: 'btn-variant rounded-lg font-playfair',
    flutter: 'btn-variant rounded-full',
    brutal: 'btn-variant rounded-none uppercase font-bold',
    editorial: 'btn-variant rounded-none uppercase tracking-widest text-xs',
    aurora: 'btn-variant rounded-full',
  };

  const staggerDelay = getStaggerDelay(index, variant);

  return (
    <Card 
      className={cn(
        'group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10',
        variantCardStyles[variant]
      )}
      style={{ animationDelay: staggerDelay }}
    >
      {/* Profile Image */}
      <div className={cn('relative h-64 overflow-hidden', variantImageStyles[variant])}>
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-primary/20 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Compatibility Badge */}
        {compatibilityPercentage !== undefined && (
          <div className="absolute left-3 top-3">
            <CompatibilityBadge 
              percentage={compatibilityPercentage} 
              size="md"
            />
          </div>
        )}
        
        {/* Verification Badge */}
        <div className="absolute right-3 top-3">
          <Badge className={cn(
            'bg-background/80 backdrop-blur-sm text-foreground gap-1',
            variant === 'brutal' && 'rounded-none border-2 border-foreground',
            variant === 'swiss' && 'rounded-none uppercase text-[10px]'
          )}>
            <VerificationBadge level={profile.verificationLevel} />
            Revealed
          </Badge>
        </div>

        {/* Name and age overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'text-xl font-semibold text-foreground',
              variant === 'luxe' && 'font-playfair text-2xl',
              variant === 'brutal' && 'font-grotesk uppercase',
              variant === 'editorial' && 'font-sora font-light text-2xl'
            )}>
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h3>
            <VerificationBadge level={profile.verificationLevel} size="lg" />
          </div>
          <p className={cn(
            'text-sm text-muted-foreground',
            variant === 'swiss' && 'uppercase tracking-wider text-xs'
          )}>{profile.area}</p>
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        {/* Response Stats */}
        <ResponseStats 
          responseRate={profile.responseRate} 
          showUpRate={profile.showUpRate}
          className="justify-center"
        />

        {/* Compatibility Reasons */}
        {compatibilityReasons && compatibilityReasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {compatibilityReasons.map((reason, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={cn(
                  'text-xs badge-variant',
                  variant === 'brutal' && 'rounded-none',
                  variant === 'swiss' && 'rounded-none uppercase text-[10px]'
                )}
              >
                {reason}
              </Badge>
            ))}
          </div>
        )}

        {/* Bio */}
        <p className={cn(
          'text-sm text-muted-foreground line-clamp-2',
          variant === 'editorial' && 'font-light leading-relaxed'
        )}>{profile.bio || 'No bio yet'}</p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {(profile.interestTags || profile.interests || []).slice(0, 4).map((interest) => (
            <Badge 
              key={interest} 
              variant="outline" 
              className={cn(
                'text-xs badge-variant',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none uppercase text-[10px]'
              )}
            >
              {interest}
            </Badge>
          ))}
          {(profile.interests?.length || 0) > 4 && (
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs',
                variant === 'brutal' && 'rounded-none',
                variant === 'swiss' && 'rounded-none'
              )}
            >
              +{profile.interests.length - 4}
            </Badge>
          )}
        </div>

        {/* Looking For & Religion */}
        <div className={cn(
          'flex flex-wrap gap-2 text-xs text-muted-foreground',
          variant === 'swiss' && 'uppercase tracking-wider text-[10px]'
        )}>
          {profile.lookingFor && (
            <span>
              🎯 {profile.lookingFor === 'both' ? 'Friendship & Love' : 
                profile.lookingFor.charAt(0).toUpperCase() + profile.lookingFor.slice(1)}
            </span>
          )}
          {profile.religion && (
            <span>• 🙏 {profile.religion}</span>
          )}
        </div>

        {/* Wave Button */}
        <Button 
          className={cn('w-full gap-2', variantButtonStyles[variant])} 
          onClick={() => onWave?.(profile.id)}
        >
          <Send className="h-4 w-4" />
          Send Wave
        </Button>
      </CardContent>
    </Card>
  );
};
