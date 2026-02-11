-- Demo Data Seed for Bridezilla Planner-Couple Demo
-- Date: 2026-02-09
-- Demo Couple: Edward & Bella (Sept 20-22, 2026, Seville, Spain)
-- Demo Planner: Jane from "La Bella Novia Wedding Planning"

-- =============================================================================
-- Clean up existing demo data (if any)
-- =============================================================================
DELETE FROM vendor_activity WHERE planner_couple_id IN (
  SELECT id FROM planner_couples WHERE couple_email = 'bella@example.com'
);
DELETE FROM shared_vendors WHERE planner_couple_id IN (
  SELECT id FROM planner_couples WHERE couple_email = 'bella@example.com'
);
DELETE FROM planner_couples WHERE couple_email = 'bella@example.com';
DELETE FROM planner_vendor_library WHERE vendor_name IN (
  'Aurora Photography', 'Flor de Sevilla', 'Hacienda de los Naranjos',
  'Sabores Andaluces Catering', 'Los Gitanos Flamenco Band'
);

-- =============================================================================
-- Insert Demo Couple: Edward & Bella
-- =============================================================================
INSERT INTO planner_couples (
  id,
  couple_names,
  couple_email,
  wedding_date,
  wedding_location,
  venue_name,
  share_link_id,
  is_active,
  notes,
  created_at,
  last_activity
) VALUES (
  '11111111-1111-1111-1111-111111111111', -- Fixed UUID for demo
  'Edward & Bella',
  'bella@example.com',
  '2026-09-20',
  'Seville, Spain',
  'Hacienda de los Naranjos',
  'edward-bella-demo', -- Easy-to-remember share link
  true,
  'Destination wedding in Seville. Couple wants romantic, traditional Spanish vibes with modern touches. Budget: €50k. Guest count: ~80.',
  NOW() - INTERVAL '7 days', -- Created 7 days ago
  NOW() - INTERVAL '2 hours' -- Last activity 2 hours ago
);

-- =============================================================================
-- Insert Demo Vendors to Vendor Library
-- =============================================================================

-- Vendor 1: Photographer
INSERT INTO planner_vendor_library (
  id,
  vendor_type,
  vendor_name,
  contact_name,
  email,
  phone,
  website,
  instagram,
  location,
  tags,
  vendor_currency,
  estimated_cost,
  default_note,
  is_active,
  created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Photographer',
  'Aurora Photography',
  'Maria Aurora',
  'maria@auroraphoto.es',
  '+34 612 345 678',
  'https://auroraphotography.es',
  '@auroraphoto.seville',
  'Seville',
  ARRAY['romantic', 'editorial', 'destination', 'luxury'],
  'EUR',
  3500.00,
  'Maria specializes in romantic destination weddings. Her editorial style captures emotion beautifully. Includes engagement shoot and full-day coverage.',
  true,
  NOW() - INTERVAL '14 days'
);

-- Vendor 2: Florist
INSERT INTO planner_vendor_library (
  id,
  vendor_type,
  vendor_name,
  contact_name,
  email,
  phone,
  website,
  instagram,
  location,
  tags,
  vendor_currency,
  estimated_cost,
  default_note,
  is_active,
  created_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Florist',
  'Flor de Sevilla',
  'Carmen Flores',
  'carmen@flordesevilla.es',
  '+34 623 456 789',
  'https://flordesevilla.es',
  '@flordesevilla',
  'Seville',
  ARRAY['bohemian', 'spanish', 'romantic', 'garden'],
  'EUR',
  4200.00,
  'Carmen creates stunning floral designs using local Spanish blooms. Perfect for hacienda weddings with romantic, garden-inspired arrangements.',
  true,
  NOW() - INTERVAL '10 days'
);

-- Vendor 3: Venue
INSERT INTO planner_vendor_library (
  id,
  vendor_type,
  vendor_name,
  contact_name,
  email,
  phone,
  website,
  instagram,
  location,
  tags,
  vendor_currency,
  estimated_cost,
  default_note,
  is_active,
  created_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Venue',
  'Hacienda de los Naranjos',
  'Rafael Mendoza',
  'events@haciendanaranjos.es',
  '+34 634 567 890',
  'https://haciendanaranjos.es',
  '@haciendanaranjos',
  'Seville',
  ARRAY['hacienda', 'historic', 'luxury', 'destination', 'garden'],
  'EUR',
  8000.00,
  'Stunning 18th century hacienda with orange groves and Andalusian architecture. Accommodates up to 120 guests. Includes ceremony and reception spaces.',
  true,
  NOW() - INTERVAL '20 days'
);

-- Vendor 4: Caterer
INSERT INTO planner_vendor_library (
  id,
  vendor_type,
  vendor_name,
  contact_name,
  email,
  phone,
  website,
  instagram,
  location,
  tags,
  vendor_currency,
  estimated_cost,
  default_note,
  is_active,
  created_at
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Caterer',
  'Sabores Andaluces Catering',
  'Antonio García',
  'antonio@saboresandaluces.es',
  '+34 645 678 901',
  'https://saboresandaluces.es',
  '@saboresandaluces',
  'Seville',
  ARRAY['spanish', 'tapas', 'mediterranean', 'luxury'],
  'EUR',
  6500.00,
  'Authentic Andalusian cuisine with modern presentation. Specializes in tapas-style receptions and traditional Spanish feasts. Wine pairing included.',
  true,
  NOW() - INTERVAL '12 days'
);

-- Vendor 5: Band
INSERT INTO planner_vendor_library (
  id,
  vendor_type,
  vendor_name,
  contact_name,
  email,
  phone,
  website,
  instagram,
  location,
  tags,
  vendor_currency,
  estimated_cost,
  default_note,
  is_active,
  created_at
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'Band',
  'Los Gitanos Flamenco Band',
  'Pablo Romero',
  'pablo@losgitanos.es',
  '+34 656 789 012',
  'https://losgitanos.es',
  '@losgitanos_flamenco',
  'Seville',
  ARRAY['flamenco', 'spanish', 'traditional', 'live-music'],
  'EUR',
  2800.00,
  'Authentic flamenco band with 5-piece ensemble. Perfect for cocktail hour and late-night entertainment. Creates unforgettable Spanish atmosphere.',
  true,
  NOW() - INTERVAL '8 days'
);

-- =============================================================================
-- Share 3 Vendors with Edward & Bella
-- =============================================================================

-- Share Photographer
INSERT INTO shared_vendors (
  id,
  planner_couple_id,
  vendor_library_id,
  vendor_name,
  vendor_type,
  contact_name,
  email,
  phone,
  instagram,
  website,
  estimated_cost_eur,
  planner_note,
  couple_status,
  couple_note,
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111', -- Edward & Bella
  '22222222-2222-2222-2222-222222222222', -- Aurora Photography
  'Aurora Photography',
  'Photographer',
  'Maria Aurora',
  'maria@auroraphoto.es',
  '+34 612 345 678',
  '@auroraphoto.seville',
  'https://auroraphotography.es',
  3500.00,
  'Maria specializes in romantic destination weddings. Her editorial style captures emotion beautifully. Includes engagement shoot and full-day coverage.',
  'interested', -- Couple marked as interested
  'Love the romantic style! Would like to see more sunset photos.',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 hours' -- Recently updated by couple
);

-- Share Florist
INSERT INTO shared_vendors (
  id,
  planner_couple_id,
  vendor_library_id,
  vendor_name,
  vendor_type,
  contact_name,
  email,
  phone,
  instagram,
  website,
  estimated_cost_eur,
  planner_note,
  couple_status,
  couple_note,
  created_at,
  updated_at
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111', -- Edward & Bella
  '33333333-3333-3333-3333-333333333333', -- Flor de Sevilla
  'Flor de Sevilla',
  'Florist',
  'Carmen Flores',
  'carmen@flordesevilla.es',
  '+34 623 456 789',
  '@flordesevilla',
  'https://flordesevilla.es',
  4200.00,
  'Carmen creates stunning floral designs using local Spanish blooms. Perfect for hacienda weddings with romantic, garden-inspired arrangements.',
  'contacted', -- Couple has contacted this vendor
  'Contacted Carmen - waiting for detailed quote. Love her use of local flowers!',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '1 day'
);

-- Share Venue
INSERT INTO shared_vendors (
  id,
  planner_couple_id,
  vendor_library_id,
  vendor_name,
  vendor_type,
  contact_name,
  email,
  phone,
  instagram,
  website,
  estimated_cost_eur,
  planner_note,
  couple_status,
  couple_note,
  created_at,
  updated_at
) VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111', -- Edward & Bella
  '44444444-4444-4444-4444-444444444444', -- Hacienda de los Naranjos
  'Hacienda de los Naranjos',
  'Venue',
  'Rafael Mendoza',
  'events@haciendanaranjos.es',
  '+34 634 567 890',
  '@haciendanaranjos',
  'https://haciendanaranjos.es',
  8000.00,
  'Stunning 18th century hacienda with orange groves and Andalusian architecture. Accommodates up to 120 guests. Includes ceremony and reception spaces.',
  NULL, -- No status yet - couple hasn't reviewed
  NULL,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);

-- =============================================================================
-- Insert Sample Activity Log Entries
-- =============================================================================

-- Activity 1: Photographer shared by planner
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'vendor_shared',
  'planner',
  NULL,
  'Aurora Photography',
  NOW() - INTERVAL '5 days'
);

-- Activity 2: Couple marked photographer as interested
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'status_changed',
  'couple',
  NULL,
  'interested',
  NOW() - INTERVAL '3 days'
);

-- Activity 3: Couple added note to photographer
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'note_added',
  'couple',
  NULL,
  'Love the romantic style! Would like to see more sunset photos.',
  NOW() - INTERVAL '2 hours'
);

-- Activity 4: Florist shared by planner
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'vendor_shared',
  'planner',
  NULL,
  'Flor de Sevilla',
  NOW() - INTERVAL '4 days'
);

-- Activity 5: Couple marked florist as contacted
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'status_changed',
  'couple',
  'interested',
  'contacted',
  NOW() - INTERVAL '1 day'
);

-- Activity 6: Venue shared by planner
INSERT INTO vendor_activity (
  planner_couple_id,
  shared_vendor_id,
  action,
  actor,
  old_value,
  new_value,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'vendor_shared',
  'planner',
  NULL,
  'Hacienda de los Naranjos',
  NOW() - INTERVAL '3 days'
);

-- =============================================================================
-- Verification Queries (commented out - for manual testing)
-- =============================================================================

-- SELECT * FROM planner_couples WHERE couple_names = 'Edward & Bella';
-- SELECT * FROM planner_vendor_library ORDER BY created_at DESC LIMIT 5;
-- SELECT * FROM shared_vendors WHERE planner_couple_id = '11111111-1111-1111-1111-111111111111';
-- SELECT * FROM vendor_activity WHERE planner_couple_id = '11111111-1111-1111-1111-111111111111' ORDER BY created_at DESC;
