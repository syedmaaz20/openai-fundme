
-- 1. Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'donor', 'admin');

-- 2. Create profiles table linked to Supabase auth.users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  aspirational_title TEXT,
  university TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Allow authenticated users to view their own profile
CREATE POLICY "Users can view their profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 5. Allow users to update their own profile
CREATE POLICY "Users can update their profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 6. Allow users to insert their own profile (trigger use-case)
CREATE POLICY "Users can insert their profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

