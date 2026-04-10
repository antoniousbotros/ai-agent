-- Add branding and customization columns to public.bots
ALTER TABLE public.bots ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.bots ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.bots ADD COLUMN IF NOT EXISTS position TEXT DEFAULT 'bottom-right';
ALTER TABLE public.bots ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light';
ALTER TABLE public.bots ADD COLUMN IF NOT EXISTS meta_page_access_token TEXT;

-- Ensure chat_transcripts table exists for the history feature
CREATE TABLE IF NOT EXISTS public.chat_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'web',
  user_identifier TEXT, -- Email, Phone, or Session ID
  messages JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add full_name and company_name to public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;
