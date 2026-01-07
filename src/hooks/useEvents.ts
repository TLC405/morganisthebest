import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Event, EventWithVenue, AttendanceWithEvent } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface UseEventsReturn {
  events: EventWithVenue[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useEvents = (limit?: number): UseEventsReturn => {
  const [events, setEvents] = useState<EventWithVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('events')
        .select('*, venues(*)')
        .order('date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setEvents(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};

// Upcoming events only
export const useUpcomingEvents = (limit?: number): UseEventsReturn => {
  const [events, setEvents] = useState<EventWithVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from('events')
        .select('*, venues(*)')
        .gte('date', today)
        .order('date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setEvents(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [limit]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};

// User's RSVPs with event details
export const useUserRSVPs = (): {
  rsvps: AttendanceWithEvent[];
  upcoming: AttendanceWithEvent[];
  past: AttendanceWithEvent[];
  isLoading: boolean;
  error: Error | null;
} => {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState<AttendanceWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRsvps = async () => {
      if (!user) {
        setRsvps([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('event_attendance')
          .select('*, events(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setRsvps(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch RSVPs'));
        setRsvps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRsvps();
  }, [user?.id]);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = rsvps.filter(r => r.events && r.events.date >= today && !r.checked_in_at);
  const past = rsvps.filter(r => r.checked_in_at !== null);

  return {
    rsvps,
    upcoming,
    past,
    isLoading,
    error,
  };
};
