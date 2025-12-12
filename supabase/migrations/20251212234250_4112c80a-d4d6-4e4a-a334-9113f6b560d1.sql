-- Create quiz_responses table to store individual quiz answers
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_key)
);

-- Enable RLS
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Users can view their own quiz responses
CREATE POLICY "Users can view their own quiz responses"
ON public.quiz_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own quiz responses
CREATE POLICY "Users can insert their own quiz responses"
ON public.quiz_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own quiz responses
CREATE POLICY "Users can update their own quiz responses"
ON public.quiz_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Add quiz_completed flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false;

-- Update the user's role to admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '9dea439a-c9e6-4762-b6fe-947569485e9f';