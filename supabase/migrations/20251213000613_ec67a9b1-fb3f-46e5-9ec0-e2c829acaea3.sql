-- Create user_behavior_metrics table for Trust Index tracking
CREATE TABLE public.user_behavior_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Engagement metrics
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  avg_response_time_mins NUMERIC DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  conversations_ended_gracefully INTEGER DEFAULT 0,
  -- Reliability metrics
  events_rsvpd INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  on_time_percentage NUMERIC DEFAULT 100,
  -- Quality metrics
  positive_feedback_received INTEGER DEFAULT 0,
  reports_received INTEGER DEFAULT 0,
  waves_received INTEGER DEFAULT 0,
  waves_sent INTEGER DEFAULT 0,
  -- Calculated Trust Index (0-100)
  trust_index NUMERIC DEFAULT 50,
  trust_level TEXT DEFAULT 'rising_star',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_behavior_metrics ENABLE ROW LEVEL SECURITY;

-- Users can view their own metrics
CREATE POLICY "Users can view their own metrics"
ON public.user_behavior_metrics
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all metrics
CREATE POLICY "Admins can view all metrics"
ON public.user_behavior_metrics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can update metrics (via triggers/functions)
CREATE POLICY "System can manage metrics"
ON public.user_behavior_metrics
FOR ALL
USING (auth.uid() = user_id);

-- Add trust_index column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_index NUMERIC DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_level TEXT DEFAULT 'rising_star';

-- Function to calculate trust index
CREATE OR REPLACE FUNCTION public.calculate_trust_index(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trust NUMERIC := 50;
  v_metrics RECORD;
BEGIN
  SELECT * INTO v_metrics FROM user_behavior_metrics WHERE user_id = p_user_id;
  
  IF v_metrics IS NULL THEN
    RETURN 50;
  END IF;
  
  -- Base score from attendance reliability (40% weight)
  IF v_metrics.events_rsvpd > 0 THEN
    v_trust := v_trust + ((v_metrics.events_attended::NUMERIC / v_metrics.events_rsvpd) * 40) - 20;
  END IF;
  
  -- Response rate bonus (20% weight)
  IF v_metrics.messages_received > 0 THEN
    v_trust := v_trust + LEAST((v_metrics.messages_sent::NUMERIC / v_metrics.messages_received) * 10, 20);
  END IF;
  
  -- Positive feedback bonus (20% weight)
  v_trust := v_trust + LEAST(v_metrics.positive_feedback_received * 2, 20);
  
  -- Report penalty
  v_trust := v_trust - (v_metrics.reports_received * 10);
  
  -- Clamp between 0-100
  RETURN GREATEST(0, LEAST(100, v_trust));
END;
$$;

-- Trigger to auto-create metrics for new profiles
CREATE OR REPLACE FUNCTION public.create_user_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_behavior_metrics (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_create_metrics
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_metrics();

-- Add realtime for metrics
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_behavior_metrics;