UPDATE shared_vendors SET couple_status = 'approved' WHERE couple_status = 'interested';
UPDATE shared_vendors SET couple_status = 'declined' WHERE couple_status = 'pass';
UPDATE shared_vendors SET couple_status = NULL WHERE couple_status IN ('contacted', 'quoted');

COMMENT ON COLUMN shared_vendors.couple_status IS 'Couple status: approved, booked, declined, null (not reviewed)';
