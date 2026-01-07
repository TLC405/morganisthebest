-- Add RLS policy for users to view profiles of people at events they both attended
CREATE POLICY "Users can view profiles of event co-attendees"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM event_attendance ea1
    JOIN event_attendance ea2 ON ea1.event_id = ea2.event_id
    WHERE ea1.user_id = auth.uid()
    AND ea2.user_id = profiles.id
    AND ea1.checked_in_at IS NOT NULL
    AND ea2.checked_in_at IS NOT NULL
  )
);