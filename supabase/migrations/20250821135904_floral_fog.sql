/*
  # Create businesses table for BMC directory

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `business_name` (text, required)
      - `owner_name` (text, required)
      - `business_description` (text, required)
      - `website_url` (text, optional)
      - `business_category` (text, required)
      - `certifications` (text array, default empty)
      - `logo_url` (text, optional)
      - `contact_email` (text, required)
      - `contact_phone` (text, optional)
      - `business_address` (text, required)
      - `social_media` (jsonb, default empty object)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `businesses` table
    - Add policy for public read access
    - Add policy for authenticated insert access
*/

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  website_url TEXT,
  business_category TEXT NOT NULL,
  certifications TEXT[] DEFAULT '{}',
  logo_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  business_address TEXT NOT NULL,
  social_media JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to businesses
CREATE POLICY "Allow public read access to businesses"
  ON businesses
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access for business submissions
CREATE POLICY "Allow public insert access to businesses"
  ON businesses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create storage bucket for business logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to business logos bucket
CREATE POLICY "Allow public access to business logos"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'business-logos');