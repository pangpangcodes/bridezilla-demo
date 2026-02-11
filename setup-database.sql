-- Admin Dashboard Tables
-- Run this SQL in Supabase Dashboard > SQL Editor
-- Then run: npm run populate-admin

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(100) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  estimated_cost_eur DECIMAL(10, 2),
  estimated_cost_cad DECIMAL(10, 2),
  contract_signed BOOLEAN DEFAULT false,
  contract_url VARCHAR(500),
  payments JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  attending BOOLEAN NOT NULL,
  number_of_guests INTEGER DEFAULT 1,
  guests JSONB DEFAULT '[]'::jsonb,
  dietary_requirements TEXT,
  song_request TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
