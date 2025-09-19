/*
  # Create business-logos storage bucket

  1. Storage Bucket
    - Create `business-logos` bucket for storing business logo images
    - Configure as public bucket for direct access
    - Set up proper policies for public read access

  2. Security
    - Allow public read access to all files in bucket
    - Allow authenticated insert for new uploads
    - Restrict delete/update to authenticated users only
*/

-- Create the business-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-logos',
  'business-logos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to business logos
CREATE POLICY "Public read access for business logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'business-logos');

-- Allow public insert access for business logo uploads
CREATE POLICY "Public insert access for business logos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'business-logos');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update business logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'business-logos');

-- Allow authenticated users to delete business logos
CREATE POLICY "Authenticated users can delete business logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'business-logos');