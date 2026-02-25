-- Planner-Couple Collaboration Feature
-- Migration: Create tables for planner workspace and shared vendor lists
-- Date: 2026-02-07

-- =============================================================================
-- Table: planner_couples
-- Purpose: Store planner-couple relationships and shared workspace links
-- =============================================================================
CREATE TABLE IF NOT EXISTS planner_couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Planner relationship (defer to post-MVP - using password gate for now)
  -- planner_id UUID REFERENCES planners(id) ON DELETE CASCADE, -- Future: when we add planner accounts

  -- Couple information
  couple_names VARCHAR(255) NOT NULL, -- e.g., "Sarah & Mike"
  couple_email VARCHAR(255), -- Optional, for sending invitations
  wedding_date DATE,
  wedding_location VARCHAR(255),

  -- Shared workspace access
  share_link_id VARCHAR(255) UNIQUE NOT NULL, -- UUID for /shared/[link-id]
  is_active BOOLEAN DEFAULT true, -- Allow planner to revoke access

  -- Planner's private notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast link lookups
CREATE INDEX idx_planner_couples_link ON planner_couples(share_link_id);

-- Index for filtering active couples
CREATE INDEX idx_planner_couples_active ON planner_couples(is_active);

-- =============================================================================
-- Table: shared_vendors
-- Purpose: Vendors shared by planners with couples (separate from admin vendors)
-- =============================================================================
CREATE TABLE IF NOT EXISTS shared_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to couple
  planner_couple_id UUID REFERENCES planner_couples(id) ON DELETE CASCADE,

  -- Vendor basic info
  vendor_name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(100) NOT NULL, -- Photographer, Florist, Venue, etc.

  -- Contact information
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  instagram VARCHAR(255),
  website VARCHAR(500),

  -- Pricing (multiple currencies for international planners)
  estimated_cost_eur DECIMAL(10, 2),
  estimated_cost_usd DECIMAL(10, 2),

  -- Notes and collaboration
  planner_note TEXT, -- Visible to couple: "Perfect for your boho style"
  couple_status VARCHAR(50), -- null (not reviewed), approved, booked, declined
  couple_note TEXT, -- Couple's notes, visible to planner

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast couple vendor lookups
CREATE INDEX idx_shared_vendors_couple ON shared_vendors(planner_couple_id);

-- Index for filtering by vendor type
CREATE INDEX idx_shared_vendors_type ON shared_vendors(vendor_type);

-- Index for filtering by couple status
CREATE INDEX idx_shared_vendors_status ON shared_vendors(couple_status);

-- =============================================================================
-- Table: vendor_activity
-- Purpose: Activity log for tracking couple engagement and planner-couple interaction
-- =============================================================================
CREATE TABLE IF NOT EXISTS vendor_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links to couple and vendor
  planner_couple_id UUID REFERENCES planner_couples(id) ON DELETE CASCADE,
  shared_vendor_id UUID REFERENCES shared_vendors(id) ON DELETE CASCADE,

  -- Activity details
  action VARCHAR(100) NOT NULL, -- vendor_shared, status_changed, note_added, etc.
  actor VARCHAR(50) NOT NULL, -- 'planner' or 'couple'

  -- Change tracking
  old_value TEXT,
  new_value TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for activity feed queries
CREATE INDEX idx_vendor_activity_couple ON vendor_activity(planner_couple_id);

-- Index for sorting by time
CREATE INDEX idx_vendor_activity_created ON vendor_activity(created_at DESC);

-- =============================================================================
-- Trigger: Update last_activity on planner_couples
-- Purpose: Automatically update last_activity when couple interacts with vendors
-- =============================================================================
CREATE OR REPLACE FUNCTION update_couple_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE planner_couples
  SET last_activity = NOW()
  WHERE id = NEW.planner_couple_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_couple_activity
AFTER INSERT ON vendor_activity
FOR EACH ROW
EXECUTE FUNCTION update_couple_last_activity();

-- =============================================================================
-- Trigger: Update updated_at timestamps
-- Purpose: Automatically update updated_at on record changes
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_planner_couples_updated
BEFORE UPDATE ON planner_couples
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_shared_vendors_updated
BEFORE UPDATE ON shared_vendors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Comments for documentation
-- =============================================================================
COMMENT ON TABLE planner_couples IS 'Stores planner-couple relationships and shared workspace access links';
COMMENT ON TABLE shared_vendors IS 'Vendors shared by planners with couples (separate from personal admin vendors)';
COMMENT ON TABLE vendor_activity IS 'Activity log tracking planner-couple interactions and vendor updates';

COMMENT ON COLUMN planner_couples.share_link_id IS 'Unique UUID for /shared/[link-id] access (no login required)';
COMMENT ON COLUMN shared_vendors.planner_note IS 'Planner note to couple, visible in shared workspace';
COMMENT ON COLUMN shared_vendors.couple_note IS 'Couple notes about vendor, visible to planner';
COMMENT ON COLUMN shared_vendors.couple_status IS 'Couple interest level: interested, contacted, quoted, booked, pass';

-- =============================================================================
-- Future tables (deferred to post-MVP)
-- =============================================================================

-- CREATE TABLE IF NOT EXISTS planners (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   planner_name VARCHAR(255) NOT NULL,
--   business_name VARCHAR(255),
--   website VARCHAR(500),
--   instagram VARCHAR(255),
--   phone VARCHAR(50),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS vendor_templates (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   planner_id UUID REFERENCES planners(id) ON DELETE CASCADE,
--   vendor_name VARCHAR(255) NOT NULL,
--   vendor_type VARCHAR(100) NOT NULL,
--   contact_name VARCHAR(255),
--   email VARCHAR(255),
--   phone VARCHAR(50),
--   instagram VARCHAR(255),
--   website VARCHAR(500),
--   default_note TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
