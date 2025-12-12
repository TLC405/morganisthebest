import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, canRevealProfile } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: User;
  onSpark?: (profileId: string) => void;
}

export const ProfileCard = ({ profile, onSpark }: ProfileCardProps) => {
  const isRevealed = canRevealProfile(profile.id);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Profile Image with Blur */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={profile.photoUrl}
          alt={isRevealed ? profile.name : 'Mystery Single'}
          className={cn(
            'h-full w-full object-cover transition-all duration-500',
            !isRevealed && 'blur-xl scale-110'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Reveal Status Badge */}
        <div className="absolute right-3 top-3">
          {isRevealed ? (
            <Badge className="bg-primary text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" />
              Revealed
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-muted/80 backdrop-blur-sm">
              🔒 Attend Same Event
            </Badge>
          )}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-semibold text-foreground">
            {isRevealed ? `${profile.name}, ${profile.age}` : '???'}
          </h3>
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        {isRevealed ? (
          <>
            <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={() => onSpark?.(profile.id)}
            >
              <Heart className="h-4 w-4" />
              Send Spark
            </Button>
          </>
        ) : (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Attend the same event to reveal this profile!
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="/events">Browse Events</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
