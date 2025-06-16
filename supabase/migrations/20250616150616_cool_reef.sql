/*
  # Setup Storage Buckets and Policies

  1. Storage Buckets
    - Create `avatars` bucket for profile pictures
    - Create `banners` bucket for banner images
    - Both buckets allow public access for reading
    - File size limits and allowed file types configured

  2. Security Policies
    - Allow authenticated users to upload images to their own folders
    - Allow public read access to all uploaded images
    - Folder structure: bucket/user_id/filename.ext
    - File type restrictions: only image files allowed

  3. File Management
    - Users can update/delete their own files
    - Automatic cleanup policies can be added later
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'avatars', 
    'avatars', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'banners', 
    'banners', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload to their own folder in avatars bucket
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow authenticated users to upload to their own folder in banners bucket
CREATE POLICY "Allow authenticated users to upload banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow public read access to avatars
CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Allow public read access to banners
CREATE POLICY "Allow public read access to banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Policy: Allow users to update their own avatars
CREATE POLICY "Allow users to update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to update their own banners
CREATE POLICY "Allow users to update own banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own avatars
CREATE POLICY "Allow users to delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own banners
CREATE POLICY "Allow users to delete own banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);