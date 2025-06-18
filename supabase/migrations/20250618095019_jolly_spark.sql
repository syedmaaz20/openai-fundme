/*
  # Create remaining tables

  1. New Tables
    - `funding_breakdown` - Campaign funding breakdown details
    - `goals` - Campaign goals/milestones
    - `documents` - Supporting documents for students
    - `donations` - Donation records

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create funding_breakdown table
CREATE TABLE IF NOT EXISTS funding_breakdown (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  percent numeric,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  document_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  is_anonymous boolean DEFAULT false,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE funding_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Funding breakdown policies
CREATE POLICY "Anyone can view funding breakdown for published campaigns"
  ON funding_breakdown
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = funding_breakdown.campaign_id AND campaign_status = 'published'
    )
  );

CREATE POLICY "Students can manage their own funding breakdown"
  ON funding_breakdown
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = funding_breakdown.campaign_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all funding breakdowns"
  ON funding_breakdown
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Goals policies
CREATE POLICY "Anyone can view goals for published campaigns"
  ON goals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = goals.campaign_id AND campaign_status = 'published'
    )
  );

CREATE POLICY "Students can manage their own goals"
  ON goals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = goals.campaign_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all goals"
  ON goals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Students can manage their own documents"
  ON documents
  FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all documents"
  ON documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Donations policies
CREATE POLICY "Anyone can create donations"
  ON donations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Donors can view their own donations"
  ON donations
  FOR SELECT
  USING (donor_id = auth.uid());

CREATE POLICY "Students can view donations to their campaigns"
  ON donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = donations.campaign_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view non-anonymous donations"
  ON donations
  FOR SELECT
  USING (
    NOT is_anonymous OR 
    donor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = donations.campaign_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all donations"
  ON donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_funding_breakdown_campaign_id ON funding_breakdown(campaign_id);
CREATE INDEX IF NOT EXISTS idx_goals_campaign_id ON goals(campaign_id);
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);

-- Triggers for updated_at
CREATE TRIGGER update_funding_breakdown_updated_at 
  BEFORE UPDATE ON funding_breakdown 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();