/*
  # Storage Buckets Setup

  1. Create Storage Buckets
    - `profile-pictures` - User profile images (public)
    - `banner-images` - Campaign banner images (public)
    - `supporting-documents` - Student verification documents (private)

  2. Storage Policies
    - Profile pictures: Public read, authenticated users can upload their own
    - Banner images: Public read, students can upload for their campaigns
    - Supporting documents: Private, only students and admins can access
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'profile-pictures',
    'profile-pictures',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'banner-images', 
    'banner-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'supporting-documents',
    'supporting-documents', 
    false,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
  )
ON CONFLICT (id) DO NOTHING;

-- Profile Pictures Policies
CREATE POLICY "Public can view profile pictures"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can upload profile pictures"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own profile pictures"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Banner Images Policies
CREATE POLICY "Public can view banner images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'banner-images');

CREATE POLICY "Students can upload banner images for their campaigns"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'banner-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can update banner images for their campaigns"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'banner-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can delete banner images for their campaigns"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'banner-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

-- Supporting Documents Policies
CREATE POLICY "Students can view own supporting documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'supporting-documents' AND
    (
      -- Student can view their own documents
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- Admin can view all documents
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Students can upload supporting documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'supporting-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can update own supporting documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'supporting-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can delete own supporting documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'supporting-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );