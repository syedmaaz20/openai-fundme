/*
  # Fix profile insert policy for signup

  1. Security Changes
    - Add policy to allow profile creation during signup process
    - Ensure users can only create profiles with their own auth.uid()
    - Maintain security by preventing users from creating profiles for other users

  The current INSERT policy is too restrictive and prevents profile creation during signup.
  This migration adds a more permissive policy that allows authenticated users to insert
  their own profile data during the signup process.
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows profile creation during signup
CREATE POLICY "Enable insert for authenticated users own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure we have a policy for public INSERT during signup process
-- This is needed because during signup, the user might not be fully authenticated yet
CREATE POLICY "Enable insert during signup"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);