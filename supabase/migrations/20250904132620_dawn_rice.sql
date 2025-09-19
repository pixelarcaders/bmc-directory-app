/*
  # Update logo_url column to store files instead of text URLs

  1. Changes
    - Change logo_url column from text to bytea (binary data) to store actual file content
    - Add logo_filename column to store the original filename
    - Add logo_content_type column to store the MIME type
    - Update existing data handling

  2. Security
    - Maintain existing RLS policies
    - Add size constraints for file uploads
*/

-- Add new columns for file storage
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS logo_file bytea,
ADD COLUMN IF NOT EXISTS logo_filename text,
ADD COLUMN IF NOT EXISTS logo_content_type text;

-- Add constraint to limit file size (5MB)
ALTER TABLE businesses 
ADD CONSTRAINT logo_file_size_check 
CHECK (octet_length(logo_file) <= 5242880);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_logo_filename 
ON businesses (logo_filename) 
WHERE logo_filename IS NOT NULL;

-- Update the businesses table comment
COMMENT ON COLUMN businesses.logo_file IS 'Binary data of the business logo file (max 5MB)';
COMMENT ON COLUMN businesses.logo_filename IS 'Original filename of the uploaded logo';
COMMENT ON COLUMN businesses.logo_content_type IS 'MIME type of the logo file (e.g., image/jpeg, image/png)';

-- Keep logo_url for backward compatibility but mark as deprecated
COMMENT ON COLUMN businesses.logo_url IS 'DEPRECATED: Use logo_file, logo_filename, and logo_content_type instead';