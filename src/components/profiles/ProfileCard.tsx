import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, canRevealProfile } from '@/data/mockData';
import { VerificationBadge } from './VerificationBadge';
import { ResponseStats } from './ResponseStats';
import { MysteryCard } from './MysteryCard';
import { CompatibilityBadge } from '@/components/quiz/CompatibilityBadge';

interface ProfileCardProps {
  profile: User;
  onWave?: (profileId: string) => void;
  forceReveal?: boolean;
  compatibilityPercentage?: number;
  compatibilityReasons?: string[];
}

export const ProfileCard = ({ profile, onWave, forceReveal = false, compatibilityPercentage, compatibilityReasons }: ProfileCardProps) => {
  const isRevealed = forceReveal || canRevealProfile(profile.id);

  // Show mystery card for unrevealed profiles
  if (!isRevealed) {
    return <MysteryCard profile={profile} upcomingEventCount={1} />;
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
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
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground gap-1">
            <VerificationBadge level={profile.verificationLevel} />
            Revealed
          </Badge>
        </div>

        {/* Name and age overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {profile.name}, {profile.age}
            </h3>
            <VerificationBadge level={profile.verificationLevel} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">{profile.area}</p>
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        {/* Response Stats - Anti-Ghosting */}
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
        <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 4).map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
          {profile.interests.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{profile.interests.length - 4}
            </Badge>
          )}
        </div>

        {/* Looking For & Religion */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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

        {/* Wave Button (renamed from Spark) */}
        <Button 
          className="w-full gap-2" 
          onClick={() => onWave?.(profile.id)}
        >
          <Send className="h-4 w-4" />
          Send Wave
        </Button>
      </CardContent>
    </Card>
  );
};
