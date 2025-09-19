/*
  # Update businesses table for admin features

  1. Schema Updates
    - Add `status` column (pending, approved, rejected)
    - Add `is_featured` column for spotlight
    - Add `admin_notes` column for admin comments
    - Add `rejection_reason` column
    - Add `updated_at` column with auto-update trigger

  2. Security
    - Update RLS policies for admin access
    - Maintain public read access for approved businesses only

  3. Indexes
    - Add performance indexes for admin queries
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'status'
  ) THEN
    ALTER TABLE businesses ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;

  -- Add is_featured column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE businesses ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  -- Add admin_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE businesses ADD COLUMN admin_notes text;
  END IF;

  -- Add rejection_reason column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE businesses ADD COLUMN rejection_reason text;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE businesses ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update existing RLS policies
DROP POLICY IF EXISTS "Allow public read access" ON businesses;
DROP POLICY IF EXISTS "Allow public read access to businesses" ON businesses;

-- New policy: Public can only read approved businesses
CREATE POLICY "Allow public read approved businesses"
  ON businesses
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Admin policies (you'll need to implement admin role checking)
-- For now, we'll use authenticated users as admins
CREATE POLICY "Allow authenticated users full access"
  ON businesses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);
CREATE INDEX IF NOT EXISTS idx_businesses_updated_at ON businesses(updated_at);

-- Update existing records to have 'approved' status (for migration)
UPDATE businesses SET status = 'approved' WHERE status IS NULL;