import { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/database';

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
  const { user } = useAuth();
  const [selectedFeedback, setSelectedFeedback] = useState<Record<string, string[]>>({});
  const [attendees, setAttendees] = useState<Profile[]>([]);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      if (!eventId || !user) {
        setAttendees([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get event title
        const { data: eventData } = await supabase
          .from('events')
          .select('title')
          .eq('id', eventId)
          .single();

        if (eventData) {
          setEventTitle(eventData.title);
        }

        // Get other attendees from this event
        const { data: attendanceData } = await supabase
          .from('event_attendance')
          .select('user_id')
          .eq('event_id', eventId)
          .not('user_id', 'eq', user.id)
          .not('checked_in_at', 'is', null);

        if (attendanceData && attendanceData.length > 0) {
          const userIds = attendanceData.map(a => a.user_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);

          setAttendees(profiles || []);
        } else {
          setAttendees([]);
        }
      } catch (error) {
        console.error('Error fetching attendees:', error);
        setAttendees([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchAttendees();
    }
  }, [eventId, user, open]);

  if (!eventId) return null;

  const toggleFeedback = (profileId: string, feedbackId: string) => {
    setSelectedFeedback(prev => {
      const current = prev[profileId] || [];
      if (current.includes(feedbackId)) {
        return { ...prev, [profileId]: current.filter(f => f !== feedbackId) };
      }
      return { ...prev, [profileId]: [...current, feedbackId] };
    });
  };

  const submitFeedback = async () => {
    if (!user || !eventId) return;

    try {
      // Insert feedback for each person
      const feedbackEntries = Object.entries(selectedFeedback);
      
      for (const [toUserId, tags] of feedbackEntries) {
        if (tags.length > 0) {
          await supabase.from('feedback').insert({
            from_user_id: user.id,
            to_user_id: toUserId,
            event_id: eventId,
            feedback_type: 'positive',
            feedback_tags: tags,
          });
        }
      }

      const feedbackCount = Object.values(selectedFeedback).flat().length;
      toast({
        title: "Feedback Submitted! ⭐",
        description: `Thanks for helping ${feedbackEntries.length} people build their Community Trusted badges!`,
      });
      setSelectedFeedback({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Leave Feedback for {eventTitle || 'Event'}
          </DialogTitle>
          <DialogDescription>
            Help new members earn their Community Trusted badge by vouching for their authenticity.
            Your feedback matters!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </>
          ) : attendees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No other attendees to give feedback to.</p>
            </div>
          ) : (
            attendees.map((profile) => (
              <div key={profile.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  {profile.photo_url ? (
                    <img 
                      src={profile.photo_url} 
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.age ? `${profile.age} years old` : ''} 
                      {profile.area ? ` • ${profile.area}` : ''}
                    </p>
                  </div>
                  {profile.verification_level === 'photo' && (
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
            ))
          )}
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
