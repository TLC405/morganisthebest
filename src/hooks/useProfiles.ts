import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/database';

interface UseProfilesOptions {
  eventId?: string;
  limit?: number;
}

interface UseProfilesReturn {
  profiles: Profile[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Fetch profiles of people at events you've both attended
export const useProfiles = (options: UseProfilesOptions = {}): UseProfilesReturn => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = async () => {
    if (!user) {
      setProfiles([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      if (options.eventId) {
        // Fetch profiles for a specific event
        const { data: attendees, error: attendeesError } = await supabase
          .from('event_attendance')
          .select('user_id')
          .eq('event_id', options.eventId)
          .not('user_id', 'eq', user.id);

        if (attendeesError) throw attendeesError;

        if (attendees && attendees.length > 0) {
          const userIds = attendees.map(a => a.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds)
            .limit(options.limit || 50);

          if (profilesError) throw profilesError;
          setProfiles(profilesData || []);
        } else {
          setProfiles([]);
        }
      } else {
        // Fetch all profiles the user can see (co-attendees)
        // First get events the user attended
        const { data: myAttendance, error: myAttendanceError } = await supabase
          .from('event_attendance')
          .select('event_id')
          .eq('user_id', user.id)
          .not('checked_in_at', 'is', null);

        if (myAttendanceError) throw myAttendanceError;

        if (myAttendance && myAttendance.length > 0) {
          const eventIds = myAttendance.map(a => a.event_id);
          
          // Get other attendees from those events
          const { data: otherAttendees, error: otherError } = await supabase
            .from('event_attendance')
            .select('user_id')
            .in('event_id', eventIds)
            .not('user_id', 'eq', user.id)
            .not('checked_in_at', 'is', null);

          if (otherError) throw otherError;

          if (otherAttendees && otherAttendees.length > 0) {
            const uniqueUserIds = [...new Set(otherAttendees.map(a => a.user_id))];
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .in('id', uniqueUserIds)
              .limit(options.limit || 50);

            if (profilesError) throw profilesError;
            setProfiles(profilesData || []);
          } else {
            setProfiles([]);
          }
        } else {
          setProfiles([]);
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profiles'));
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user?.id, options.eventId]);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchProfiles,
  };
};

// Fetch profiles by event, grouped
export interface EventConnectionGroup {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  profiles: Profile[];
}

export const useConnectionsByEvent = (): {
  connections: EventConnectionGroup[];
  isLoading: boolean;
  error: Error | null;
} => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<EventConnectionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) {
        setConnections([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get events the user attended
        const { data: myAttendance, error: myError } = await supabase
          .from('event_attendance')
          .select('event_id, events(id, title, date)')
          .eq('user_id', user.id)
          .not('checked_in_at', 'is', null);

        if (myError) throw myError;

        if (!myAttendance || myAttendance.length === 0) {
          setConnections([]);
          setIsLoading(false);
          return;
        }

        const groups: EventConnectionGroup[] = [];

        for (const attendance of myAttendance) {
          const event = attendance.events as { id: string; title: string; date: string } | null;
          if (!event) continue;

          // Get other attendees from this event
          const { data: otherAttendees, error: otherError } = await supabase
            .from('event_attendance')
            .select('user_id')
            .eq('event_id', attendance.event_id)
            .not('user_id', 'eq', user.id)
            .not('checked_in_at', 'is', null);

          if (otherError) continue;

          if (otherAttendees && otherAttendees.length > 0) {
            const userIds = otherAttendees.map(a => a.user_id);
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .in('id', userIds);

            if (profilesError) continue;

            if (profiles && profiles.length > 0) {
              groups.push({
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                profiles,
              });
            }
          }
        }

        setConnections(groups);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch connections'));
        setConnections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [user?.id]);

  return { connections, isLoading, error };
};
