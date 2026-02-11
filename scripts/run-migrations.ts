#!/usr/bin/env tsx
/**
 * Script to run database migrations
 * Usage: tsx scripts/run-migrations.ts
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
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false
  }
})

async function runMigrations() {
  console.log('🔄 Running database migrations...')

  try {
    // Read migration files
    const migrationsDir = path.join(__dirname, '../supabase/migrations')
    const migrationFiles = fs.readdirSync(migrationsDir).sort()

    console.log(`📝 Found ${migrationFiles.length} migration files`)

    for (const file of migrationFiles) {
      if (!file.endsWith('.sql')) continue

      console.log(`\n📄 Running migration: ${file}`)
      const migrationPath = path.join(migrationsDir, file)
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

      // Execute via REST API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: migrationSQL })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Error running ${file}:`, response.status, errorText)
      } else {
        console.log(`✅ ${file} executed successfully`)
      }
    }

    console.log('\n✅ All migrations completed!')

    // Verify tables exist
    console.log('\n🔍 Verifying tables...')

    const { data: couples } = await supabase
      .from('planner_couples')
      .select('*')
      .limit(1)

    console.log(couples ? '✅ planner_couples table exists' : '❌ planner_couples table missing')

    const { data: library } = await supabase
      .from('planner_vendor_library')
      .select('*')
      .limit(1)

    console.log(library ? '✅ planner_vendor_library table exists' : '❌ planner_vendor_library table missing')

    const { data: shared } = await supabase
      .from('shared_vendors')
      .select('*')
      .limit(1)

    console.log(shared ? '✅ shared_vendors table exists' : '❌ shared_vendors table missing')

    const { data: activity } = await supabase
      .from('vendor_activity')
      .select('*')
      .limit(1)

    console.log(activity ? '✅ vendor_activity table exists' : '❌ vendor_activity table missing')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
