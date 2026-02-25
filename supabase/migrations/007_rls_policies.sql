-- ============================================================
-- Migration 007: Row Level Security (RLS) for all tables
--
-- Strategy:
--   Service-role key (used in all API routes) bypasses RLS.
--   Anon key (public, browser-visible) is blocked by default
--   unless an explicit policy grants access.
--
-- Tables with NO anon access (service-role only):
--   planner_couples, planner_vendor_library, shared_vendors,
--   vendor_activity, vendors, wedding_settings
--
-- Tables with selective anon access:
--   rsvps   - anon INSERT only (public RSVP form)
--   waitlist - anon INSERT only (public landing form)
-- ============================================================

-- Step 1: Lock down service-role-only tables
-- (No policies added - anon key gets zero access; service role bypasses RLS)

ALTER TABLE planner_couples        ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_vendors         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_activity        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_settings       ENABLE ROW LEVEL SECURITY;

-- Step 2: RSVPs - allow public INSERT, block anon reads
-- Admin reads go through service-role API routes.

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public rsvp submission"
  ON rsvps
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 3: Waitlist - idempotent policies
-- The landing package migration may have already applied these.

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'waitlist'
      AND policyname = 'Allow public waitlist signup'
  ) THEN
    CREATE POLICY "Allow public waitlist signup"
      ON waitlist
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'waitlist'
      AND policyname = 'Allow authenticated reads on waitlist'
  ) THEN
    CREATE POLICY "Allow authenticated reads on waitlist"
      ON waitlist
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
