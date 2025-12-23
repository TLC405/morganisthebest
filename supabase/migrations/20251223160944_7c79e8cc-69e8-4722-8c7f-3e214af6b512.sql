-- Create group_chats table for event groups, match groups, and friend groups
CREATE TABLE public.group_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('event', 'match_group', 'friend_group')),
  event_id UUID REFERENCES public.events(id),
  photo_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_chat_members table
CREATE TABLE public.group_chat_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id)
);

-- Create group_messages table
CREATE TABLE public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_chats
CREATE POLICY "Users can view groups they are members of" 
ON public.group_chats FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_chat_members 
    WHERE group_chat_members.group_id = group_chats.id 
    AND group_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create groups" 
ON public.group_chats FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group owners can update groups" 
ON public.group_chats FOR UPDATE 
USING (auth.uid() = created_by);

-- RLS Policies for group_chat_members
CREATE POLICY "Users can view members of their groups" 
ON public.group_chat_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_chat_members AS gcm 
    WHERE gcm.group_id = group_chat_members.group_id 
    AND gcm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups" 
ON public.group_chat_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership" 
ON public.group_chat_members FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
ON public.group_chat_members FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for group_messages
CREATE POLICY "Users can view messages in their groups" 
ON public.group_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_chat_members 
    WHERE group_chat_members.group_id = group_messages.group_id 
    AND group_chat_members.user_id = auth.uid()
  )
);

CREATE POLICY "Group members can send messages" 
ON public.group_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.group_chat_members 
    WHERE group_chat_members.group_id = group_messages.group_id 
    AND group_chat_members.user_id = auth.uid()
  )
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- Create indexes for performance
CREATE INDEX idx_group_chat_members_user_id ON public.group_chat_members(user_id);
CREATE INDEX idx_group_chat_members_group_id ON public.group_chat_members(group_id);
CREATE INDEX idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX idx_group_messages_created_at ON public.group_messages(created_at);
CREATE INDEX idx_group_chats_event_id ON public.group_chats(event_id);
CREATE INDEX idx_group_chats_type ON public.group_chats(type);