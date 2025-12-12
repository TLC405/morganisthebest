import { Heart, MapPin, Sparkles, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/data/mockData';

interface MysteryCardProps {
  profile: User;
  upcomingEventCount?: number;
}

// Anonymous avatar patterns
const mysteryAvatars = [
  '💜', '💙', '💚', '🧡', '💛', '❤️', '🩷', '🩵'
];

export const MysteryCard = ({ profile, upcomingEventCount = 0 }: MysteryCardProps) => {
  // Generate consistent avatar based on profile id
  const avatarIndex = profile.id.charCodeAt(profile.id.length - 1) % mysteryAvatars.length;
  const avatar = mysteryAvatars[avatarIndex];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 border-dashed border-2">
      {/* Mystery Avatar Area */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
        <div className="text-6xl animate-pulse">{avatar}</div>
        
        {/* Mystery Badge */}
        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="bg-muted/90 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            Mystery Single
          </Badge>
        </div>

        {/* Age Range */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-foreground">
            {profile.ageRange} years
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        {/* Area */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{profile.area}</span>
        </div>

        {/* Interest Tags */}
        <div className="flex flex-wrap gap-2">
          {profile.interestTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Looking For */}
        {profile.lookingFor && (
          <p className="text-xs text-muted-foreground">
            Looking for: {profile.lookingFor === 'both' ? 'Friendship & Relationship' : 
              profile.lookingFor.charAt(0).toUpperCase() + profile.lookingFor.slice(1)}
          </p>
        )}

        {/* Religion if set */}
        {profile.religion && (
          <p className="text-xs text-muted-foreground">
            Faith: {profile.religion}
          </p>
        )}

        {/* CTA */}
        <div className="pt-2 space-y-2">
          {upcomingEventCount > 0 && (
            <p className="text-xs text-center text-primary font-medium">
              <Users className="inline h-3 w-3 mr-1" />
              Attending {upcomingEventCount} upcoming event{upcomingEventCount > 1 ? 's' : ''}
            </p>
          )}
          <Button variant="outline" className="w-full" asChild>
            <a href="/events">
              <Heart className="mr-2 h-4 w-4" />
              Find an Event to Meet
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
