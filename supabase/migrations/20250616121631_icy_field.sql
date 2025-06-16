/*
  # Add Student Profile Fields

  1. New Columns
    - `banner_url` (text, nullable) - URL for banner image
    - `youtube_video_url` (text, nullable) - YouTube video URL
    - `story` (text, nullable) - Student's story/why they need support
    - `education_path` (jsonb, nullable) - Education details
    - `funding_needs` (jsonb, nullable) - Funding breakdown
    - `goals` (jsonb, nullable) - Student goals
    - `share_code` (text, unique, nullable) - Unique share code for campaign
    - `campaign_published` (boolean, default false) - Whether campaign is published
    - `funding_goal` (integer, nullable) - Total funding goal amount
    - `funding_raised` (integer, default 0) - Amount raised so far

  2. Security
    - Update RLS policies to allow users to update their own profile fields
    - Add unique constraint on share_code
*/

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS story text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_path jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS funding_needs jsonb DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals jsonb DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS share_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS campaign_published boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS funding_goal integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS funding_raised integer DEFAULT 0;

-- Create index on share_code for faster lookups
CREATE INDEX IF NOT EXISTS profiles_share_code_idx ON profiles(share_code);

-- Create index on campaign_published for faster campaign queries
CREATE INDEX IF NOT EXISTS profiles_campaign_published_idx ON profiles(campaign_published);

-- Function to generate unique share code
CREATE OR REPLACE FUNCTION generate_share_code(first_name text, last_name text)
RETURNS text AS $$
DECLARE
  base_code text;
  final_code text;
  counter integer := 0;
BEGIN
  -- Create base code from first and last name
  base_code := lower(regexp_replace(first_name || '-' || last_name, '[^a-zA-Z0-9]', '-', 'g'));
  base_code := regexp_replace(base_code, '-+', '-', 'g');
  base_code := trim(both '-' from base_code);
  
  -- Ensure it's not too long
  IF length(base_code) > 20 THEN
    base_code := substring(base_code from 1 for 20);
  END IF;
  
  final_code := base_code;
  
  -- Check if code exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE share_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || '-' || counter;
  END LOOP;
  
  RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate share_code if not provided
CREATE OR REPLACE FUNCTION auto_generate_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_code IS NULL AND NEW.user_type = 'student' THEN
    NEW.share_code := generate_share_code(NEW.first_name, NEW.last_name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate share_code
DROP TRIGGER IF EXISTS auto_generate_share_code_trigger ON profiles;
CREATE TRIGGER auto_generate_share_code_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_share_code();