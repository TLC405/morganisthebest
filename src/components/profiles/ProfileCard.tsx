import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerificationBadge } from './VerificationBadge';
import { ResponseStats } from './ResponseStats';
import { MysteryCard } from './MysteryCard';
import { CompatibilityBadge } from '@/components/quiz/CompatibilityBadge';
import { cn } from '@/lib/utils';
import { getStaggerDelay } from '@/lib/animations';
import type { VerificationLevel } from '@/types/database';

// Simple profile type for display
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
  // Always reveal if forceReveal is true
  const isRevealed = forceReveal;

  if (!isRevealed) {
    return <MysteryCard profile={profile as any} upcomingEventCount={1} />;
  }

  const staggerDelay = getStaggerDelay(index);

  return (
    <Card 
      className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-hard-primary"
      style={{ animationDelay: staggerDelay }}
    >
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
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
          <Badge variant="muted" className="gap-1">
            <VerificationBadge level={profile.verificationLevel as VerificationLevel} />
            Revealed
          </Badge>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h3>
            <VerificationBadge level={profile.verificationLevel as VerificationLevel} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{profile.area}</p>
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
              <Badge key={i} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio || 'No bio yet'}</p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {(profile.interestTags || profile.interests || []).slice(0, 4).map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
          {(profile.interests?.length || 0) > 4 && (
            <Badge variant="muted" className="text-xs">
              +{profile.interests.length - 4}
            </Badge>
          )}
        </div>

        {/* Looking For */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground uppercase tracking-wide">
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
        <Button className="w-full gap-2" onClick={() => onWave?.(profile.id)}>
          <Send className="h-4 w-4" />
          Send Wave
        </Button>
      </CardContent>
    </Card>
  );
};
