#!/usr/bin/env tsx
/**
 * Script to run database seeds
 * Usage: tsx scripts/run-seed.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') })

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment variables')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function runSeed() {
  console.log('🌱 Running database seed...')

  try {
    // Read seed file
    const seedPath = path.join(__dirname, '../supabase/seeds/demo-data.sql')
    const seedSQL = fs.readFileSync(seedPath, 'utf8')

    // Split by semicolons to get individual statements
    const statements = seedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments
      if (statement.startsWith('--')) continue

      console.log(`\n[${i + 1}/${statements.length}] Executing...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      })

      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error)
        console.error('Statement:', statement.substring(0, 200))
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }

    console.log('\n✅ Seed completed successfully!')

    // Verify data
    console.log('\n🔍 Verifying seeded data...')

    const { data: couples, error: couplesError } = await supabase
      .from('planner_couples')
      .select('*')
      .eq('couple_email', 'bella@example.com')

    if (couplesError) {
      console.error('❌ Error verifying couples:', couplesError)
    } else {
      console.log(`✅ Found ${couples?.length || 0} demo couple(s)`)
      if (couples && couples.length > 0) {
        console.log('   - Couple:', couples[0].couple_names)
        console.log('   - Share link:', couples[0].share_link_id)
      }
    }

    const { data: vendors, error: vendorsError } = await supabase
      .from('planner_vendor_library')
      .select('*')

    if (vendorsError) {
      console.error('❌ Error verifying vendors:', vendorsError)
    } else {
      console.log(`✅ Found ${vendors?.length || 0} vendor(s) in library`)
    }

    const { data: shared, error: sharedError } = await supabase
      .from('shared_vendors')
      .select('*')
      .eq('planner_couple_id', '11111111-1111-1111-1111-111111111111')

    if (sharedError) {
      console.error('❌ Error verifying shared vendors:', sharedError)
    } else {
      console.log(`✅ Found ${shared?.length || 0} shared vendor(s) with Edward & Bella`)
    }

    const { data: activity, error: activityError } = await supabase
      .from('vendor_activity')
      .select('*')
      .eq('planner_couple_id', '11111111-1111-1111-1111-111111111111')
      .order('created_at', { ascending: false })

    if (activityError) {
      console.error('❌ Error verifying activity:', activityError)
    } else {
      console.log(`✅ Found ${activity?.length || 0} activity log entries`)
    }

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Alternative approach: Direct SQL execution
async function runSeedDirect() {
  console.log('🌱 Running database seed (direct SQL)...')

  try {
    // Read seed file
    const seedPath = path.join(__dirname, '../supabase/seeds/demo-data.sql')
    const seedSQL = fs.readFileSync(seedPath, 'utf8')

    // Use raw SQL execution via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: seedSQL })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('✅ Seed executed successfully')

  } catch (error) {
    console.error('❌ Direct seed failed:', error)
    console.log('\n💡 Trying manual insertion approach...')
    await runSeedManual()
  }
}

// Manual approach: Use Supabase client to insert data directly
async function runSeedManual() {
  console.log('🌱 Running database seed (manual insertion)...')

  try {
    // 1. Clean up existing demo data (by fixed UUID to handle any prior email)
    console.log('🧹 Cleaning up existing demo data...')
    const DEMO_COUPLE_UUID = '11111111-1111-1111-1111-111111111111'
    await supabase.from('vendor_activity').delete().eq('planner_couple_id', DEMO_COUPLE_UUID)
    await supabase.from('shared_vendors').delete().eq('planner_couple_id', DEMO_COUPLE_UUID)
    console.log('✅ Cleaned up existing vendors')

    // 2. Upsert demo couple
    console.log('\n👰 Upserting demo couple...')
    const { error: coupleError } = await supabase.from('planner_couples').upsert({
      id: DEMO_COUPLE_UUID,
      couple_names: 'Edward & Bella',
      couple_email: 'bella@example.com',
      wedding_date: '2026-09-20',
      wedding_location: 'Seville, Spain',
      venue_name: 'Hacienda de los Naranjos',
      share_link_id: 'edward-bella-demo',
      is_active: true,
      notes: 'Destination wedding in Seville. Couple wants romantic, traditional Spanish vibes with modern touches. Budget: 50k EUR. Guest count: ~80.',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }, { onConflict: 'id' })

    if (coupleError) throw coupleError
    console.log('✅ Upserted Edward & Bella')

    // 3. Insert vendors to library
    console.log('\n🏪 Inserting vendors to library...')

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
        pricing: 'Full day coverage - EUR 3500\nIncludes engagement shoot',
        description: 'Maria specializes in romantic destination weddings. Her editorial style captures emotion beautifully.',
        is_active: true,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
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
        pricing: 'Full florals package - EUR 4200',
        description: 'Carmen creates stunning floral designs using local Spanish blooms. Perfect for hacienda weddings with romantic, garden-inspired arrangements.',
        is_active: true,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
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
        pricing: 'Venue hire - EUR 8000\nIncludes ceremony and reception spaces',
        description: 'Stunning 18th century hacienda with orange groves and Andalusian architecture. Accommodates up to 120 guests.',
        is_active: true,
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        vendor_type: 'Caterer',
        vendor_name: 'Sabores Andaluces Catering',
        contact_name: 'Antonio Garcia',
        email: 'antonio@saboresandaluces.es',
        phone: '+34 645 678 901',
        website: 'https://saboresandaluces.es',
        instagram: '@saboresandaluces',
        location: 'Seville',
        tags: ['spanish', 'tapas', 'mediterranean', 'luxury'],
        pricing: 'Per person (tapas-style) - EUR 6500 total for 80 guests\nWine pairing included',
        description: 'Authentic Andalusian cuisine with modern presentation. Specializes in tapas-style receptions and traditional Spanish feasts.',
        is_active: true,
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
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
        pricing: '5-piece ensemble - EUR 2800\nUp to 4 hours performance',
        description: 'Authentic flamenco band with 5-piece ensemble. Perfect for cocktail hour and late-night entertainment.',
        is_active: true,
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: vendorsError } = await supabase.from('planner_vendor_library').upsert(vendors, { onConflict: 'id', ignoreDuplicates: true })
    if (vendorsError) throw vendorsError
    console.log('✅ Upserted 5 vendors to library')

    // 4. Share vendors with couple
    console.log('\n🔗 Sharing vendors with Edward & Bella...')

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
    console.log('✅ Shared 3 vendors with couple')

    // 5. Insert activity log
    console.log('\n📊 Inserting activity log...')

    const activities = [
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'vendor_shared',
        actor: 'planner',
        old_value: null,
        new_value: 'Aurora Photography',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'status_changed',
        actor: 'couple',
        old_value: null,
        new_value: 'interested',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        action: 'note_added',
        actor: 'couple',
        old_value: null,
        new_value: 'Love the romantic style! Would like to see more sunset photos.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        planner_couple_id: '11111111-1111-1111-1111-111111111111',
        shared_vendor_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        action: 'vendor_shared',
        actor: 'planner',
        old_value: null,
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
        old_value: null,
        new_value: 'Hacienda de los Naranjos',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: activityError } = await supabase.from('vendor_activity').insert(activities)
    if (activityError) throw activityError
    console.log('✅ Inserted 6 activity log entries')

    console.log('\n✅ Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - 1 demo couple (Edward & Bella)')
    console.log('   - 5 vendors in library')
    console.log('   - 3 vendors shared with couple')
    console.log('   - 6 activity log entries')
    console.log('\n🔗 Shared workspace link: http://localhost:3000/shared/edward-bella-demo')

  } catch (error) {
    console.error('❌ Manual seed failed:', error)
    process.exit(1)
  }
}

// Run the manual approach (most reliable)
runSeedManual()
