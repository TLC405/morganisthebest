
-- Create event attendee roles table for tracking roles at events
CREATE TABLE public.event_attendee_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES event_attendance(id) ON DELETE CASCADE NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('host', 'icebreaker', 'mentor', 'newcomer', 'regular', 'success_story')),
  role_description TEXT,
  assigned_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_attendee_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Team and admin can manage event roles"
ON public.event_attendee_roles
FOR ALL
USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view roles at events they attended"
ON public.event_attendee_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM event_attendance ea
    WHERE ea.id = attendance_id AND ea.user_id = auth.uid()
  )
);

-- Add new columns to profiles for dating features
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS height_inches INTEGER,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS prompts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS match_preferences JSONB DEFAULT '{}'::jsonb;

-- Add compatibility_score to waves for match quality tracking
ALTER TABLE public.waves
ADD COLUMN IF NOT EXISTS compatibility_score INTEGER;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_attendee_roles_attendance ON event_attendee_roles(attendance_id);
CREATE INDEX IF NOT EXISTS idx_waves_compatibility ON waves(compatibility_score);
