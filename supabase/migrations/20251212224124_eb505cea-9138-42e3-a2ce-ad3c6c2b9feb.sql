-- Create role enum
CREATE TYPE public.app_role AS ENUM ('single', 'team', 'admin');

-- Create check-in status enum
CREATE TYPE public.check_in_status AS ENUM ('on_time', 'late', 'no_show');

-- Create RSVP status enum
CREATE TYPE public.rsvp_status AS ENUM ('going', 'maybe', 'not_going');

-- Create feedback type enum
CREATE TYPE public.feedback_type AS ENUM ('positive', 'neutral', 'negative');

-- Create wave status enum
CREATE TYPE public.wave_status AS ENUM ('pending', 'accepted', 'declined');

-- Create conversation status enum
CREATE TYPE public.conversation_status AS ENUM ('active', 'ended');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  bio TEXT,
  photo_url TEXT,
  area TEXT,
  religion TEXT,
  looking_for TEXT,
  interests TEXT[],
  verification_level TEXT DEFAULT 'pending',
  response_rate DECIMAL(5,2) DEFAULT 0,
  show_up_rate DECIMAL(5,2) DEFAULT 0,
  personality_vector JSONB,
  community_trusted BOOLEAN DEFAULT FALSE,
  events_attended INTEGER DEFAULT 0,
  positive_feedback_count INTEGER DEFAULT 0,
  total_feedback_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table (SEPARATE for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'single',
  UNIQUE(user_id, role)
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geo_fence_radius INTEGER DEFAULT 100,
  capacity INTEGER DEFAULT 50,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  age_range_min INTEGER DEFAULT 21,
  age_range_max INTEGER DEFAULT 65,
  geo_fence_enabled BOOLEAN DEFAULT TRUE,
  check_in_start TIMESTAMPTZ,
  check_in_end TIMESTAMPTZ,
  max_attendees INTEGER DEFAULT 50,
  status TEXT DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_attendance table
CREATE TABLE public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  rsvp_status rsvp_status DEFAULT 'going',
  door_code TEXT,
  checked_in_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  time_spent_minutes INTEGER,
  check_in_status check_in_status,
  check_in_latitude DECIMAL(10, 8),
  check_in_longitude DECIMAL(11, 8),
  geo_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  feedback_type feedback_type NOT NULL,
  feedback_tags TEXT[],
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id, event_id)
);

-- Create waves table (connection requests)
CREATE TABLE public.waves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  status wave_status DEFAULT 'pending',
  gentle_exit_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status conversation_status DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_1_id, user_2_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_performance table
CREATE TABLE public.team_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  setup_rating DECIMAL(3,2),
  attendee_feedback_score DECIMAL(3,2),
  issues_reported INTEGER DEFAULT 0,
  resolved_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_user_id, event_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_performance ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'single');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_waves_updated_at BEFORE UPDATE ON public.waves FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Team can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'team'));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for venues
CREATE POLICY "Anyone authenticated can view venues" ON public.venues FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Team can manage venues" ON public.venues FOR ALL USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Anyone authenticated can view events" ON public.events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Team can manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for event_attendance
CREATE POLICY "Users can view their own attendance" ON public.event_attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own attendance" ON public.event_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attendance" ON public.event_attendance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Team can view all attendance" ON public.event_attendance FOR SELECT USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Team can manage attendance" ON public.event_attendance FOR ALL USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for feedback
CREATE POLICY "Users can create feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can view feedback they gave or received" ON public.feedback FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Admins can view all feedback" ON public.feedback FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for waves
CREATE POLICY "Users can view their waves" ON public.waves FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can send waves" ON public.waves FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update waves sent to them" ON public.waves FOR UPDATE USING (auth.uid() = to_user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);
CREATE POLICY "Users can start conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_1_id OR auth.uid() = user_2_id);
CREATE POLICY "Users can update their conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversations c 
  WHERE c.id = conversation_id 
  AND (c.user_1_id = auth.uid() OR c.user_2_id = auth.uid())
));
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.user_1_id = auth.uid() OR c.user_2_id = auth.uid())
  )
);

-- RLS Policies for team_performance
CREATE POLICY "Team can view their own performance" ON public.team_performance FOR SELECT USING (auth.uid() = team_user_id);
CREATE POLICY "Admins can view all performance" ON public.team_performance FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage performance" ON public.team_performance FOR ALL USING (public.has_role(auth.uid(), 'admin'));