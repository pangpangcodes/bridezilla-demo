import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import postgres from 'postgres'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local')
  console.error('Please add DATABASE_URL from Supabase project settings > Database > Connection string (Direct connection)')
  process.exit(1)
}

async function createTables() {
  console.log('🚀 Creating admin tables...\n')

  const sql = postgres(DATABASE_URL)

  try {
    // Read migration file
    const migrationPath = resolve(process.cwd(), 'supabase/migrations/004_admin_tables.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('📝 Executing migration SQL...\n')

    // Execute the entire migration
    await sql.unsafe(migrationSQL)

    console.log('✅ Admin tables created successfully!\n')
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

createTables()
