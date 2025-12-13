import { useState } from 'react';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SwipeCardProps {
  profile: {
    id: string;
    name: string;
    age: number | null;
    photo_url: string | null;
    area: string | null;
    bio: string | null;
    occupation?: string | null;
    education?: string | null;
    interests: string[] | null;
    prompts?: { question: string; answer: string }[] | null;
    community_trusted?: boolean | null;
    compatibility_score?: number | null;
  };
  onLike?: () => void;
  onNope?: () => void;
  onSuperLike?: () => void;
  showActions?: boolean;
}

export const SwipeCard = ({ 
  profile, 
  onLike, 
  onNope, 
  onSuperLike,
  showActions = true 
}: SwipeCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const initials = profile.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleLike = () => {
    setSwipeDirection('right');
    setTimeout(() => onLike?.(), 400);
  };

  const handleNope = () => {
    setSwipeDirection('left');
    setTimeout(() => onNope?.(), 400);
  };

  // Mock multiple photos - in production, use profile.photos array
  const photos = profile.photo_url ? [profile.photo_url] : [];

  return (
    <div 
      className={cn(
        "relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-depth bg-card",
        swipeDirection === 'left' && 'animate-swipe-left',
        swipeDirection === 'right' && 'animate-swipe-right'
      )}
    >
      {/* Photo Section - 70% of card */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        {photos.length > 0 ? (
          <img
            src={photos[currentPhotoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-bold text-foreground/20">{initials}</span>
          </div>
        )}

        {/* Photo Navigation Dots */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1">
            {photos.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1 rounded-full transition-all",
                  i === currentPhotoIndex 
                    ? "bg-white" 
                    : "bg-white/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 photo-card-gradient" />

        {/* Swipe Hints */}
        <div className="swipe-hint swipe-hint-like">LIKE</div>
        <div className="swipe-hint swipe-hint-nope">NOPE</div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {profile.community_trusted && (
            <Badge variant="warning" className="gap-1 shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Trusted
            </Badge>
          )}
        </div>

        {/* Compatibility Score */}
        {profile.compatibility_score && (
          <div className="absolute top-4 right-4">
            <div className="compat-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  strokeWidth="4"
                  className="compat-ring-bg"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  strokeWidth="4"
                  stroke={profile.compatibility_score >= 80 ? 'hsl(var(--primary))' : profile.compatibility_score >= 60 ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))'}
                  className="compat-ring-fill"
                  strokeDasharray={`${(profile.compatibility_score / 100) * 151} 151`}
                />
              </svg>
              <span className="compat-ring-text text-white">{profile.compatibility_score}%</span>
            </div>
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-3xl font-bold text-white mb-1">
            {profile.name}{profile.age && <span className="font-normal">, {profile.age}</span>}
          </h2>
          
          <div className="flex flex-wrap items-center gap-3 text-white/90">
            {profile.area && (
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                {profile.area}
              </span>
            )}
            {profile.occupation && (
              <span className="flex items-center gap-1 text-sm">
                <Briefcase className="h-4 w-4" />
                {profile.occupation}
              </span>
            )}
            {profile.education && (
              <span className="flex items-center gap-1 text-sm">
                <GraduationCap className="h-4 w-4" />
                {profile.education}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section - 30% of card */}
      <div className="p-5 space-y-4">
        {/* Bio */}
        {profile.bio && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Hinge-Style Prompt */}
        {profile.prompts && profile.prompts.length > 0 && (
          <div className="prompt-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {profile.prompts[0].question}
            </p>
            <p className="text-foreground font-medium">
              {profile.prompts[0].answer}
            </p>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 4).map((interest, i) => (
              <span key={i} className="interest-pill text-xs">
                {interest}
              </span>
            ))}
            {profile.interests.length > 4 && (
              <span className="interest-pill text-xs">
                +{profile.interests.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-center gap-6 pb-6 px-5">
          <button className="action-btn action-btn-nope" onClick={handleNope}>
            <X className="h-7 w-7" />
          </button>
          <button className="action-btn action-btn-superlike" onClick={onSuperLike}>
            <Star className="h-6 w-6" />
          </button>
          <button className="action-btn action-btn-like" onClick={handleLike}>
            <Heart className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
};
