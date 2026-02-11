import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

async function setupTables() {
  console.log('🚀 Setting up admin tables...\n')

  // Read migration file
  const migrationPath = resolve(process.cwd(), 'supabase/migrations/004_admin_tables.sql')
  const migrationSQL = readFileSync(migrationPath, 'utf-8')

  // Extract just the CREATE TABLE statements
  const createVendors = `
    CREATE TABLE IF NOT EXISTS vendors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vendor_name VARCHAR(255) NOT NULL,
      vendor_type VARCHAR(100) NOT NULL,
      contact_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      website VARCHAR(500),
      estimated_cost_eur DECIMAL(10, 2),
      estimated_cost_cad DECIMAL(10, 2),
      contract_signed BOOLEAN DEFAULT false,
      contract_url VARCHAR(500),
      payments JSONB DEFAULT '[]'::jsonb,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  const createRsvps = `
    CREATE TABLE IF NOT EXISTS rsvps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      attending BOOLEAN NOT NULL,
      number_of_guests INTEGER DEFAULT 1,
      guests JSONB DEFAULT '[]'::jsonb,
      dietary_requirements TEXT,
      song_request TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `

  try {
    console.log('📝 Executing SQL via REST API...\n')

    // Try executing via direct SQL (this may not work with standard Supabase, but let's try)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: createVendors + createRsvps })
    })

    if (!response.ok) {
      const error = await response.text()
      console.log('⚠️  Direct SQL execution not available via REST API')
      console.log('\n📋 Please run this SQL manually in Supabase Dashboard (SQL Editor):\n')
      console.log('='.repeat(80))
      console.log(migrationSQL)
      console.log('='.repeat(80))
      console.log('\nOr add DATABASE_URL to .env.local to enable automated setup')
      process.exit(1)
    }

    console.log('✅ Tables created successfully!\n')
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n📋 Please run this SQL manually in Supabase Dashboard (SQL Editor):\n')
    console.log('='.repeat(80))
    console.log(migrationSQL)
    console.log('='.repeat(80))
    process.exit(1)
  }
}

setupTables()
