#!/usr/bin/env tsx
/**
 * Script to setup database (run migrations + seed data)
 * Usage: tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupDatabase() {
  console.log('🚀 Setting up ksmt database...\n')

  try {
    // Step 1: Check if tables exist
    console.log('1️⃣ Checking existing tables...')
    const { data: existing, error: checkError } = await supabase
      .from('planner_couples')
      .select('id')
      .limit(1)

    if (checkError) {
      if (checkError.message.includes('does not exist')) {
        console.log('⚠️  Tables not found. Need to run migrations via Supabase Dashboard.')
        console.log('\n📋 Follow these steps:')
        console.log('   1. Go to: https://supabase.com/dashboard/project/bdcbescoxhmgztwfozlr/editor/sql/new')
        console.log('   2. Copy and paste the SQL from: supabase/migrations/001_planner_tables.sql')
        console.log('   3. Click "Run"')
        console.log('   4. Repeat for: 002_vendor_library.sql and 003_vendor_pricing_structure.sql')
        console.log('   5. Run this script again')
        process.exit(1)
      } else {
        throw checkError
      }
    }

    console.log('✅ Tables exist!\n')

    // Step 2: Clean up existing demo data
    console.log('2️⃣ Cleaning up existing demo data...')

    const { data: oldCouple } = await supabase
      .from('planner_couples')
      .select('id')
      .eq('couple_email', 'bella@example.com')
      .single()

    if (oldCouple) {
      await supabase.from('vendor_activity').delete().eq('planner_couple_id', oldCouple.id)
      await supabase.from('shared_vendors').delete().eq('planner_couple_id', oldCouple.id)
      await supabase.from('planner_couples').delete().eq('id', oldCouple.id)
      console.log('✅ Cleaned up old demo couple')
    }

    const vendorNames = [
      'Aurora Photography',
      'Flor de Sevilla',
      'Hacienda de los Naranjos',
      'Sabores Andaluces Catering',
      'Los Gitanos Flamenco Band'
    ]

    for (const name of vendorNames) {
      await supabase.from('planner_vendor_library').delete().eq('vendor_name', name)
    }
    console.log('✅ Cleaned up old vendors\n')

    // Step 3: Insert demo couple
    console.log('3️⃣ Creating Edward & Bella...')
    const { error: coupleError } = await supabase.from('planner_couples').insert({
      id: '11111111-1111-1111-1111-111111111111',
      couple_names: 'Edward & Bella',
      couple_email: 'bella@example.com',
      wedding_date: '2026-09-20',
      wedding_location: 'Seville, Spain',
      venue_name: 'Hacienda de los Naranjos',
      share_link_id: 'edward-bella-demo',
      is_active: true,
      notes: 'Destination wedding in Seville. Couple wants romantic, traditional Spanish vibes with modern touches. Budget: €50k. Guest count: ~80.',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    })

    if (coupleError) throw coupleError
    console.log('✅ Edward & Bella created\n')

    // Step 4: Insert vendors
    console.log('4️⃣ Creating vendor library (5 vendors)...')

    const vendors = [
      {
        id: '22222222-2222-2222-2222-222222222222',
        vendor_type: 'Photographer',
        vendor_name: 'Aurora Photography',
        contact_name: 'Maria Aurora',
        email: 'maria@auroraphoto.es',
        phone: '+34 612 345 678',
        website: 'https://auroraphotography.es',
        instagram: '@auroraphoto.seville',
        location: 'Seville',
        tags: ['romantic', 'editorial', 'destination', 'luxury'],
        pricing: JSON.stringify({ currency: 'EUR', amount: 3500.00, notes: 'Full-day coverage including engagement shoot' }),
        description: 'Maria specializes in romantic destination weddings. Her editorial style captures emotion beautifully. Includes engagement shoot and full-day coverage.'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        vendor_type: 'Florist',
        vendor_name: 'Flor de Sevilla',
        contact_name: 'Carmen Flores',
        email: 'carmen@flordesevilla.es',
        phone: '+34 623 456 789',
        website: 'https://flordesevilla.es',
        instagram: '@flordesevilla',
        location: 'Seville',
        tags: ['bohemian', 'spanish', 'romantic', 'garden'],
        pricing: JSON.stringify({ currency: 'EUR', amount: 4200.00, notes: 'Full ceremony and reception florals' }),
        description: 'Carmen creates stunning floral designs using local Spanish blooms. Perfect for hacienda weddings with romantic, garden-inspired arrangements.'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        vendor_type: 'Venue',
        vendor_name: 'Hacienda de los Naranjos',
        contact_name: 'Rafael Mendoza',
        email: 'events@haciendanaranjos.es',
        phone: '+34 634 567 890',
        website: 'https://haciendanaranjos.es',
        instagram: '@haciendanaranjos',
        location: 'Seville',
        tags: ['hacienda', 'historic', 'luxury', 'destination', 'garden'],
        pricing: JSON.stringify({ currency: 'EUR', amount: 8000.00, notes: 'Venue rental including ceremony and reception spaces' }),
        description: 'Stunning 18th century hacienda with orange groves and Andalusian architecture. Accommodates up to 120 guests. Includes ceremony and reception spaces.'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        vendor_type: 'Caterer',
        vendor_name: 'Sabores Andaluces Catering',
        contact_name: 'Antonio García',
        email: 'antonio@saboresandaluces.es',
        phone: '+34 645 678 901',
        website: 'https://saboresandaluces.es',
        instagram: '@saboresandaluces',
        location: 'Seville',
        tags: ['spanish', 'tapas', 'mediterranean', 'luxury'],
        pricing: JSON.stringify({ currency: 'EUR', amount: 6500.00, notes: 'Per person for full service including wine pairing' }),
        description: 'Authentic Andalusian cuisine with modern presentation. Specializes in tapas-style receptions and traditional Spanish feasts. Wine pairing included.'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        vendor_type: 'Band',
        vendor_name: 'Los Gitanos Flamenco Band',
        contact_name: 'Pablo Romero',
        email: 'pablo@losgitanos.es',
        phone: '+34 656 789 012',
        website: 'https://losgitanos.es',
        instagram: '@losgitanos_flamenco',
        location: 'Seville',
        tags: ['flamenco', 'spanish', 'traditional', 'live-music'],
        pricing: JSON.stringify({ currency: 'EUR', amount: 2800.00, notes: '3-hour performance' }),
        description: 'Authentic flamenco band with 5-piece ensemble. Perfect for cocktail hour and late-night entertainment. Creates unforgettable Spanish atmosphere.'
      }
    ]

    const { error: vendorsError } = await supabase.from('planner_vendor_library').insert(vendors)
    if (vendorsError) throw vendorsError
    console.log('✅ 5 vendors added to library\n')

    // Step 5: Share vendors with couple
    console.log('5️⃣ Sharing vendors with Edward & Bella...')

    const sharedVendors = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        vendor_library_id: '22222222-2222-2222-2222-222222222222',
        vendor_name: 'Aurora Photography',
        vendor_type: 'Photographer',
        contact_name: 'Maria Aurora',
        email: 'maria@auroraphoto.es',
        phone: '+34 612 345 678',
        instagram: '@auroraphoto.seville',
        website: 'https://auroraphotography.es',
        estimated_cost_eur: 3500.00,
        planner_note: 'Maria specializes in romantic destination weddings. Her editorial style captures emotion beautifully. Includes engagement shoot and full-day coverage.',
        couple_status: 'interested',
        couple_note: 'Love the romantic style! Would like to see more sunset photos.',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        vendor_library_id: '33333333-3333-3333-3333-333333333333',
        vendor_name: 'Flor de Sevilla',
        vendor_type: 'Florist',
        contact_name: 'Carmen Flores',
        email: 'carmen@flordesevilla.es',
        phone: '+34 623 456 789',
        instagram: '@flordesevilla',
        website: 'https://flordesevilla.es',
        estimated_cost_eur: 4200.00,
        planner_note: 'Carmen creates stunning floral designs using local Spanish blooms. Perfect for hacienda weddings with romantic, garden-inspired arrangements.',
        couple_status: 'contacted',
        couple_note: 'Contacted Carmen - waiting for detailed quote. Love her use of local flowers!',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        vendor_library_id: '44444444-4444-4444-4444-444444444444',
        vendor_name: 'Hacienda de los Naranjos',
        vendor_type: 'Venue',
        contact_name: 'Rafael Mendoza',
        email: 'events@haciendanaranjos.es',
        phone: '+34 634 567 890',
        instagram: '@haciendanaranjos',
        website: 'https://haciendanaranjos.es',
        estimated_cost_eur: 8000.00,
        planner_note: 'Stunning 18th century hacienda with orange groves and Andalusian architecture. Accommodates up to 120 guests. Includes ceremony and reception spaces.',
        couple_status: null,
        couple_note: null,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: sharedError } = await supabase.from('shared_vendors').insert(sharedVendors)
    if (sharedError) throw sharedError
    console.log('✅ 3 vendors shared with couple\n')

    // Step 6: Add activity log
    console.log('6️⃣ Creating activity history...')

    const activities = [
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'vendor_shared',
        actor: 'planner',
        new_value: 'Aurora Photography',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'status_changed',
        actor: 'couple',
        new_value: 'interested',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'note_added',
        actor: 'couple',
        new_value: 'Love the romantic style! Would like to see more sunset photos.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        action: 'vendor_shared',
        actor: 'planner',
        new_value: 'Flor de Sevilla',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        action: 'status_changed',
        actor: 'couple',
        old_value: 'interested',
        new_value: 'contacted',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        action: 'vendor_shared',
        actor: 'planner',
        new_value: 'Hacienda de los Naranjos',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: activityError } = await supabase.from('vendor_activity').insert(activities)
    if (activityError) throw activityError
    console.log('✅ 6 activity entries created\n')

    // Success summary
    console.log('✨ Database setup complete!\n')
    console.log('📊 Summary:')
    console.log('   - 1 demo couple: Edward & Bella')
    console.log('   - 5 vendors in library')
    console.log('   - 3 vendors shared with couple')
    console.log('   - 6 activity log entries')
    console.log('\n🔗 Test the shared workspace:')
    console.log('   http://localhost:3000/shared/edward-bella-demo')
    console.log('\n🎉 Ready for demo!')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
