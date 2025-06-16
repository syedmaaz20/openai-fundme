/*
  # Setup Storage Buckets and Policies

  1. Storage Buckets
    - Create `avatars` bucket for profile images (5MB limit)
    - Create `banners` bucket for banner images (10MB limit)
    - Both buckets allow public read access

  2. Security Policies
    - Users can upload images to their own folder structure
    - Public read access for all images
    - Users can update/delete only their own images
    - Folder structure: bucket_name/user_id/filename.ext
*/

-- Create avatars bucket
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  );
EXCEPTION
  WHEN unique_violation THEN
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    WHERE id = 'avatars';
END $$;

-- Create banners bucket
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'banners',
    'banners',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  );
EXCEPTION
  WHEN unique_violation THEN
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    WHERE id = 'banners';
END $$;

-- Create storage policies using Supabase helper functions

-- Policy: Allow authenticated users to upload avatars to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to upload banners to their own folder  
CREATE POLICY IF NOT EXISTS "Users can upload own banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to avatars
CREATE POLICY IF NOT EXISTS "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Allow public read access to banners
CREATE POLICY IF NOT EXISTS "Public can view banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Policy: Allow users to update their own avatars
CREATE POLICY IF NOT EXISTS "Users can update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to update their own banners
CREATE POLICY IF NOT EXISTS "Users can update own banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'banners' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own avatars
CREATE POLICY IF NOT EXISTS "Users can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own banners
CREATE POLICY IF NOT EXISTS "Users can delete own banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);