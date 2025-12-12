-- Add personality quote to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personality_quote TEXT;

-- Add nametag_pin to event_attendance (4-digit unique per event)
ALTER TABLE public.event_attendance ADD COLUMN IF NOT EXISTS nametag_pin TEXT;

-- Create unique constraint for pin per event
CREATE UNIQUE INDEX IF NOT EXISTS unique_pin_per_event ON public.event_attendance(event_id, nametag_pin);

-- Function to generate unique 4-digit pin for an event
CREATE OR REPLACE FUNCTION public.generate_event_pin(p_event_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_pin TEXT;
  pin_exists BOOLEAN;
BEGIN
  LOOP
    new_pin := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT EXISTS(
      SELECT 1 FROM event_attendance 
      WHERE event_id = p_event_id AND nametag_pin = new_pin
    ) INTO pin_exists;
    EXIT WHEN NOT pin_exists;
  END LOOP;
  RETURN new_pin;
END;
$$;

-- Trigger to auto-generate pin on RSVP
CREATE OR REPLACE FUNCTION public.set_nametag_pin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.nametag_pin IS NULL THEN
    NEW.nametag_pin := generate_event_pin(NEW.event_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_nametag_pin ON public.event_attendance;
CREATE TRIGGER trigger_set_nametag_pin
  BEFORE INSERT ON public.event_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.set_nametag_pin();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;