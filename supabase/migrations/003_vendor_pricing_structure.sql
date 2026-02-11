-- Vendor Pricing Structure Migration
-- Purpose: Replace single estimated_cost with free-form pricing text
--          Replace default_note with description
-- Date: 2026-02-08

-- =============================================================================
-- Update planner_vendor_library table
-- =============================================================================

-- Remove old single-value pricing fields
ALTER TABLE planner_vendor_library
  DROP COLUMN IF EXISTS vendor_currency,
  DROP COLUMN IF EXISTS estimated_cost,
  DROP COLUMN IF EXISTS default_note;

-- Add free-form pricing text field
ALTER TABLE planner_vendor_library
  ADD COLUMN IF NOT EXISTS pricing TEXT;

-- Add description field (replaces default_note)
ALTER TABLE planner_vendor_library
  ADD COLUMN IF NOT EXISTS description TEXT;

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON COLUMN planner_vendor_library.pricing IS 'Free-form pricing text, well-formatted to preserve structure from source materials. Examples: "BRIDE - €297\nBRIDAL PARTY - €147 per person" or "PACKAGE ONE - €3950\n8 hours coverage, feature film, drone footage\n\nPACKAGE TWO - €4950\n2 videographers, instagram trailer\n\nEXTRAS:\nExtra hours - €295 per hour"';

COMMENT ON COLUMN planner_vendor_library.description IS 'Description of what the vendor offers, their style, and specialties';

-- =============================================================================
-- Example pricing formats
-- =============================================================================

/*
Example 1 - Hair & Makeup:
BRIDE - €297
BRIDAL PARTY - €147 per person
BRIDE TRIAL - €175
BRIDAL PARTY TRIAL - €125 per person

Example 2 - Officiant:
WEDDING CEREMONY IN ENGLISH - €750
WEDDING CEREMONY BILINGUAL (ENGLISH & SPANISH) - €900
INTERNATIONAL CEREMONY - €1500 plus flights/accommodation
Travel charges apply for locations more than 40 minutes outside Marbella

Example 3 - Videographer with packages:
PACKAGE ONE - €3950
1 videographer - full day coverage (8 hours)
Feature film - 40-90 minutes
Cinematic highlight video - 5-7 minutes
Aerial drone footage
Online file delivery

PACKAGE TWO - €4950
2 videographers - full day coverage (8 hours)
Feature film - 40-90 minutes
Instagram trailer - 1 minute
Cinematic highlight video - 5-7 minutes
Aerial drone footage
Online file delivery

EXTRAS:
Documentary film (15-20 minutes) - €495
1 minute instagram trailer - €295
Extra hours - €295 per hour
Raw footage - €595
*/
