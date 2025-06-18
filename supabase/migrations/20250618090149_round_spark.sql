/*
  # Initial Schema Setup for EduFund Platform

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `campaigns` - Student fundraising campaigns
    - `donations` - Donation records
    - `campaign_updates` - Campaign progress updates
    - `supporting_documents` - Student verification documents

  2. Security
    - Enable RLS on all tables
    - Add policies for different user types (student, donor, admin)
    - Secure access to sensitive data

  3. Storage
    - Profile pictures bucket
    - Banner images bucket  
    - Supporting documents bucket
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'donor', 'admin');
CREATE TYPE campaign_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'completed');
CREATE TYPE document_type AS ENUM ('academic_transcript', 'admission_letter', 'financial_aid', 'identity_proof', 'other');

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE, -- Only for students
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  profile_picture_url text,
  banner_picture_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  story text NOT NULL,
  goal_amount decimal(10,2) NOT NULL CHECK (goal_amount > 0),
  raised_amount decimal(10,2) DEFAULT 0 CHECK (raised_amount >= 0),
  status campaign_status DEFAULT 'draft',
  youtube_video_url text,
  share_code text UNIQUE NOT NULL,
  
  -- Education details
  program text NOT NULL,
  institution text NOT NULL,
  institution_url text,
  graduation_date date,
  
  -- Funding breakdown (stored as JSONB)
  funding_breakdown jsonb,
  
  -- Goals (stored as JSONB array)
  goals jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES user_profiles(id)
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  is_anonymous boolean DEFAULT false,
  message text,
  payment_intent_id text, -- For Stripe integration
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Supporting Documents Table
CREATE TABLE IF NOT EXISTS supporting_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Campaign Updates Table
CREATE TABLE IF NOT EXISTS campaign_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view all public profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Campaigns Policies
CREATE POLICY "Anyone can view approved campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated, anon
  USING (status = 'approved');

CREATE POLICY "Students can view own campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can create campaigns"
  ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can update own campaigns"
  ON campaigns
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can update any campaign"
  ON campaigns
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Donations Policies
CREATE POLICY "Donors can view own donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (donor_id = auth.uid());

CREATE POLICY "Students can view donations to their campaigns"
  ON donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view non-anonymous donations for approved campaigns"
  ON donations
  FOR SELECT
  TO authenticated, anon
  USING (
    NOT is_anonymous AND
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND status = 'approved'
    )
  );

CREATE POLICY "Authenticated users can create donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND status = 'approved'
    )
  );

-- Supporting Documents Policies
CREATE POLICY "Students can view own documents"
  ON supporting_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents"
  ON supporting_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can upload documents to own campaigns"
  ON supporting_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND student_id = auth.uid()
    )
  );

-- Campaign Updates Policies
CREATE POLICY "Anyone can view updates for approved campaigns"
  ON campaign_updates
  FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND status = 'approved'
    )
  );

CREATE POLICY "Students can create updates for own campaigns"
  ON campaign_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = campaign_id AND student_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_student_id ON campaigns(student_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_share_code ON campaigns(share_code);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique share codes
CREATE OR REPLACE FUNCTION generate_share_code(student_name text)
RETURNS text AS $$
DECLARE
  base_code text;
  final_code text;
  counter integer := 1;
BEGIN
  -- Create base code from student name
  base_code := lower(regexp_replace(student_name, '[^a-zA-Z0-9]', '-', 'g'));
  base_code := regexp_replace(base_code, '-+', '-', 'g');
  base_code := trim(both '-' from base_code);
  
  final_code := base_code;
  
  -- Check if code exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM campaigns WHERE share_code = final_code) LOOP
    final_code := base_code || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_code;
END;
$$ LANGUAGE plpgsql;