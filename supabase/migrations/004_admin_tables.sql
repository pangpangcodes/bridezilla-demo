-- Admin Dashboard Tables (for demo wedding website)
-- Migration: Create tables for vendors and RSVPs
-- Date: 2026-02-11

-- =============================================================================
-- Table: vendors
-- Purpose: Vendors for the admin's own wedding (Bella & Edward's demo)
-- =============================================================================
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vendor details
  vendor_name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(100) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  
  -- Pricing
  estimated_cost_eur DECIMAL(10, 2),
  estimated_cost_cad DECIMAL(10, 2),
  
  -- Contract status
  contract_signed BOOLEAN DEFAULT false,
  contract_url VARCHAR(500),
  
  -- Payments (stored as JSONB array)
  payments JSONB DEFAULT '[]'::jsonb,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for vendor type filtering
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);

-- =============================================================================
-- Table: rsvps  
-- Purpose: Wedding guest RSVPs for the admin's wedding
-- =============================================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Guest details
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- RSVP response
  attending BOOLEAN NOT NULL,
  number_of_guests INTEGER DEFAULT 1,
  
  -- Guest list (stored as JSONB array)
  guests JSONB DEFAULT '[]'::jsonb,
  
  -- Dietary requirements
  dietary_requirements TEXT,
  
  -- Song request
  song_request TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);

-- Index for attending status
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
