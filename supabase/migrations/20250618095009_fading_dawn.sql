/*
  # Create campaigns table

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to profiles)
      - `title` (text, required)
      - `aspirational_title` (text, nullable)
      - `short_description` (text, nullable)
      - `story` (text, nullable)
      - `photo_url` (text, nullable)
      - `banner_url` (text, nullable)
      - `video_url` (text, nullable)
      - `goal` (numeric, required)
      - `raised` (numeric, default 0)
      - `share_code` (text, unique, required)
      - `campaign_status` (text, default 'draft')
      - `education_program` (text, nullable)
      - `institution` (text, nullable)
      - `institution_url` (text, nullable)
      - `graduation_date` (date, nullable)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `campaigns` table
    - Add policies for campaign access based on status and ownership
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  aspirational_title text,
  short_description text,
  story text,
  photo_url text,
  banner_url text,
  video_url text,
  goal numeric NOT NULL CHECK (goal > 0),
  raised numeric DEFAULT 0 CHECK (raised >= 0),
  share_code text UNIQUE NOT NULL,
  campaign_status text DEFAULT 'draft' CHECK (campaign_status IN ('draft', 'pending_review', 'published', 'rejected')),
  education_program text,
  institution text,
  institution_url text,
  graduation_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published campaigns are viewable by everyone"
  ON campaigns
  FOR SELECT
  USING (campaign_status = 'published');

CREATE POLICY "Students can view their own campaigns"
  ON campaigns
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all campaigns"
  ON campaigns
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Students can create campaigns"
  ON campaigns
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'student'
    )
  );

CREATE POLICY "Students can update their own campaigns"
  ON campaigns
  FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Admins can update any campaign"
  ON campaigns
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_student_id ON campaigns(student_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_share_code ON campaigns(share_code);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(campaign_status);

-- Trigger for updated_at
CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();