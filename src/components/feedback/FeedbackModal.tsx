import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProfiles, mockEvents } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string | null;
}

const feedbackOptions = [
  { id: 'great-conversation', label: 'Great conversation!', icon: MessageCircle },
  { id: 'friendly-genuine', label: 'Friendly & genuine', icon: Heart },
  { id: 'would-recommend', label: 'Would recommend', icon: ThumbsUp },
  { id: 'super-fun', label: 'Super fun to hang with', icon: Star },
];

export const FeedbackModal = ({ open, onOpenChange, eventId }: FeedbackModalProps) => {
  const { toast } = useToast();
  const [selectedFeedback, setSelectedFeedback] = useState<Record<string, string[]>>({});

  if (!eventId) return null;

  const event = mockEvents.find(e => e.id === eventId);
  const attendees = mockProfiles.filter(p => p.eventsAttended.includes(eventId));

  const toggleFeedback = (profileId: string, feedbackId: string) => {
    setSelectedFeedback(prev => {
      const current = prev[profileId] || [];
      if (current.includes(feedbackId)) {
        return { ...prev, [profileId]: current.filter(f => f !== feedbackId) };
      }
      return { ...prev, [profileId]: [...current, feedbackId] };
    });
  };

  const submitFeedback = () => {
    const feedbackCount = Object.values(selectedFeedback).flat().length;
    toast({
      title: "Feedback Submitted! ⭐",
      description: `Thanks for helping ${feedbackCount} people build their Community Trusted badges!`,
    });
    setSelectedFeedback({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Leave Feedback for {event?.title}
          </DialogTitle>
          <DialogDescription>
            Help new members earn their Community Trusted badge by vouching for their authenticity.
            Your feedback matters!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {attendees.map((profile) => (
            <div key={profile.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.ageRange} • {profile.area}</p>
                </div>
                {profile.verificationLevel === 'photo' && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    New Member
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {feedbackOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedFeedback[profile.id]?.includes(option.id);
                  return (
                    <Button
                      key={option.id}
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleFeedback(profile.id, option.id)}
                      className="gap-1 text-xs"
                    >
                      <Icon className="h-3 w-3" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Skip for Now
          </Button>
          <Button onClick={submitFeedback} disabled={Object.keys(selectedFeedback).length === 0}>
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
