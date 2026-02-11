import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Client } from 'pg'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Extract project ref
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0]

async function createTables() {
  console.log('🚀 Attempting to create tables...\n')

  // Try multiple connection formats
  const connectionStrings = [
    `postgresql://postgres.${projectRef}:${SUPABASE_SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${projectRef}:${SUPABASE_SERVICE_KEY}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres:${SUPABASE_SERVICE_KEY}@db.${projectRef}.supabase.co:5432/postgres`,
  ]

  // Read migration file
  const migrationPath = resolve(process.cwd(), 'supabase/migrations/004_admin_tables.sql')
  const migrationSQL = readFileSync(migrationPath, 'utf-8')

  for (const connString of connectionStrings) {
    const client = new Client({ connectionString: connString, ssl: { rejectUnauthorized: false } })

    try {
      console.log(`🔌 Trying connection...`)
      await client.connect()
      console.log('✅ Connected!')

      console.log('📝 Executing migration SQL...')
      await client.query(migrationSQL)

      console.log('✅ Tables created successfully!\n')
      await client.end()
      return
    } catch (error: any) {
      await client.end().catch(() => {})
      if (error.message?.includes('password authentication failed')) {
        console.log('❌ Authentication failed with this connection string')
      } else {
        console.log(`❌ Connection failed: ${error.message}`)
      }
    }
  }

  console.log('\n⚠️  Could not connect automatically.')
  console.log('\n📋 Please add DATABASE_URL to .env.local')
  console.log('Get it from: Supabase Dashboard > Project Settings > Database > Connection string (Direct)')
  console.log('\nOr run this SQL manually in Supabase Dashboard SQL Editor:\n')
  console.log('='.repeat(80))
  console.log(migrationSQL)
  console.log('='.repeat(80))
}

createTables()
