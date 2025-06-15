
-- Create campaigns table
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  story TEXT,
  photo_url TEXT,
  goal INTEGER NOT NULL,
  raised INTEGER NOT NULL DEFAULT 0,
  share_code TEXT UNIQUE NOT NULL,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on campaigns table
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view campaigns (public data)
CREATE POLICY "Anyone can view campaigns" ON public.campaigns
  FOR SELECT
  USING (true);

-- Allow campaign owners to update their campaigns
CREATE POLICY "Profile owners can update their campaigns" ON public.campaigns
  FOR UPDATE
  USING (profile_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Allow profile owners to insert campaigns
CREATE POLICY "Profile owners can insert campaigns" ON public.campaigns
  FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Insert profiles for Sophia and Juan with real UUIDs
INSERT INTO public.profiles (id, role, full_name, avatar_url, aspirational_title, university, bio)
VALUES
  ('188df968-7596-4d66-b6ca-e4c22dc74d4b', 'student', 'Sophia Williams', 'https://randomuser.me/api/portraits/women/75.jpg', 'Future Social Worker, Transforming Lives', 'UCLA', 'I am a first-generation college student studying Social Work at UCLA. I aspire to help families and children in underserved communities.'),
  ('5f0fea25-ac90-459c-8731-1eabaea2ee34', 'student', 'Juan Rodriguez', 'https://randomuser.me/api/portraits/men/85.jpg', 'First-Generation Engineer', 'Mechanical Engineering', 'Coming from a low-income family, I''ve always dreamed of becoming an engineer. Your contribution will help me pay for critical expenses and stay in school.');

-- Insert campaigns linked to those profiles
INSERT INTO public.campaigns (profile_id, title, short_description, story, photo_url, goal, raised, share_code, video_url)
VALUES
  ('188df968-7596-4d66-b6ca-e4c22dc74d4b', 'Help Sophia Graduate from UCLA!', 'I''m fundraising for my final year at UCLA. Your support will help pay my tuition and living expenses.', 'I am a first-generation college student studying Social Work at UCLA. I aspire to help families and children in underserved communities. But due to rising tuition fees and living costs, I need help to continue pursuing my dream.', 'https://randomuser.me/api/portraits/women/75.jpg', 15000, 7220, 'sophie1', 'https://www.youtube.com/watch?v=bA_4thDLkoA'),
  ('5f0fea25-ac90-459c-8731-1eabaea2ee34', 'Support Juan''s Engineering Journey', 'Raising funds for books, supplies, and lab fees as I complete my Mechanical Engineering degree.', 'Coming from a low-income family, I''ve always dreamed of becoming an engineer. Your contribution will help me pay for critical expenses and stay in school.', 'https://randomuser.me/api/portraits/men/85.jpg', 18000, 4880, 'juan2', 'https://www.youtube.com/watch?v=bA_4thDLkoA');
