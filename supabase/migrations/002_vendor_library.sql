-- Vendor Library Migration
-- Purpose: Add centralized vendor library for planners to build and share from
-- Date: 2026-02-08

-- =============================================================================
-- Table: planner_vendor_library
-- Purpose: Centralized vendor database that planners build once and share with multiple couples
-- =============================================================================
CREATE TABLE IF NOT EXISTS planner_vendor_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Future: planner_id UUID REFERENCES planners(id) ON DELETE CASCADE,
  -- For MVP: Single planner using password gate, no planner accounts yet

  -- Vendor basic info (matches admin vendors where overlapping)
  vendor_type VARCHAR(100) NOT NULL, -- From VENDOR_TYPES: DJ, Photographer, Videographer, etc.
  vendor_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),

  -- Contact information
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  instagram VARCHAR(255), -- e.g., "@mariasflores"

  -- Planner-specific fields
  location VARCHAR(255), -- City/region where vendor operates (e.g., "Marbella", "Seville")
  tags TEXT[], -- e.g., ["boho", "luxury", "destination", "beach", "affordable"]
  portfolio_images TEXT[], -- URLs to vendor portfolio images (future enhancement)

  -- Pricing (single currency, matches admin pattern)
  vendor_currency VARCHAR(10), -- EUR, USD, etc. (single currency per vendor)
  estimated_cost DECIMAL(10, 2), -- Estimated cost in vendor_currency

  -- Planner's default note about this vendor
  default_note TEXT, -- Default note shown to all couples (can be customized per couple)

  -- Soft delete
  is_active BOOLEAN DEFAULT true, -- Allow archiving vendors without deleting

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Indexes for planner_vendor_library
-- =============================================================================

-- For filtering by type
CREATE INDEX idx_vendor_library_type ON planner_vendor_library(vendor_type);

-- For filtering active vendors
CREATE INDEX idx_vendor_library_active ON planner_vendor_library(is_active);

-- For search by name
CREATE INDEX idx_vendor_library_name ON planner_vendor_library(vendor_name);

-- For filtering by location
CREATE INDEX idx_vendor_library_location ON planner_vendor_library(location);

-- For tag-based filtering (GIN index for array contains queries)
CREATE INDEX idx_vendor_library_tags ON planner_vendor_library USING GIN(tags);

-- =============================================================================
-- Update shared_vendors table to reference vendor library
-- =============================================================================

-- Add vendor_library_id to link shared vendors to library
ALTER TABLE shared_vendors
  ADD COLUMN IF NOT EXISTS vendor_library_id UUID REFERENCES planner_vendor_library(id) ON DELETE CASCADE;

-- Add custom_note field for per-couple vendor notes (overrides library default_note)
ALTER TABLE shared_vendors
  ADD COLUMN IF NOT EXISTS custom_note TEXT;

-- Create index for library lookups
CREATE INDEX IF NOT EXISTS idx_shared_vendors_library ON shared_vendors(vendor_library_id);

-- =============================================================================
-- Update planner_couples table for calendar view
-- =============================================================================

-- Add venue_name for filtering (was only wedding_location before)
ALTER TABLE planner_couples
  ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255);

-- Create index for venue filtering
CREATE INDEX IF NOT EXISTS idx_couples_venue ON planner_couples(venue_name);

-- Create index for wedding date (for calendar view)
CREATE INDEX IF NOT EXISTS idx_couples_wedding_date ON planner_couples(wedding_date);

-- Create index for couple_email (for search)
CREATE INDEX IF NOT EXISTS idx_couples_email ON planner_couples(couple_email);

-- =============================================================================
-- Trigger: Update updated_at on planner_vendor_library
-- =============================================================================
CREATE TRIGGER trigger_vendor_library_updated
BEFORE UPDATE ON planner_vendor_library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Comments for documentation
-- =============================================================================
COMMENT ON TABLE planner_vendor_library IS 'Centralized vendor library that planners build once and share with multiple couples';
COMMENT ON COLUMN planner_vendor_library.default_note IS 'Planner default note about vendor, can be overridden per couple via shared_vendors.custom_note';
COMMENT ON COLUMN planner_vendor_library.tags IS 'Searchable tags for filtering vendors (e.g., boho, luxury, destination)';
COMMENT ON COLUMN planner_vendor_library.location IS 'City or region where vendor operates';
COMMENT ON COLUMN planner_vendor_library.is_active IS 'Soft delete flag - allows archiving vendors without losing data';

COMMENT ON COLUMN shared_vendors.vendor_library_id IS 'References vendor from planner library (if shared from library)';
COMMENT ON COLUMN shared_vendors.custom_note IS 'Per-couple override of library default_note (if null, use library note)';

COMMENT ON COLUMN planner_couples.venue_name IS 'Specific venue name for filtering in calendar view';
