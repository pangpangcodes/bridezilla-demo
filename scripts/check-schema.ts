#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as path from 'path'

config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSchema() {
  console.log('🔍 Checking database schema...\n')

  // Try to query each table
  const tables = ['planner_couples', 'planner_vendor_library', 'shared_vendors', 'vendor_activity']

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)

    if (error) {
      console.log(`❌ ${table}: ${error.message}`)
    } else {
      console.log(`✅ ${table}: EXISTS`)
      if (data && data.length > 0) {
        console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`)
      }
    }
  }

  // Check if default_note column exists specifically
  console.log('\n📋 Testing default_note column...')
  const { error: testError } = await supabase
    .from('planner_vendor_library')
    .insert({
      vendor_type: 'Test',
      vendor_name: 'Test Vendor',
      default_note: 'Test note',
      is_active: true
    })

  if (testError) {
    console.log('❌ default_note column test failed:', testError.message)
    console.log('\n💡 Solution: Run migrations 002 and 003 in Supabase SQL Editor')
    console.log('   URL: https://supabase.com/dashboard/project/bdcbescoxhmgztwfozlr/sql/new')
  } else {
    console.log('✅ default_note column exists!')
    // Clean up test data
    await supabase.from('planner_vendor_library').delete().eq('vendor_name', 'Test Vendor')
  }
}

checkSchema()
