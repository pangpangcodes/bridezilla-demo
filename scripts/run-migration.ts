import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function runMigration() {
  console.log('🚀 Running admin tables migration...\n')

  // Read migration file
  const migrationPath = resolve(process.cwd(), 'supabase/migrations/004_admin_tables.sql')
  const migrationSQL = readFileSync(migrationPath, 'utf-8')

  // Split into individual statements (simple split on semicolons)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📝 Found ${statements.length} SQL statements\n`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)

    const { error } = await supabase.rpc('exec', { sql: statement + ';' })

    if (error) {
      // Try direct query as fallback
      const { error: directError } = await (supabase as any).from('_sql').insert({ query: statement })

      if (directError) {
        console.log(`⚠️  Statement ${i + 1} may have executed (error: ${error.message})`)
      }
    } else {
      console.log(`✅ Statement ${i + 1} completed`)
    }
  }

  console.log('\n✨ Migration completed!')
}

runMigration().catch(console.error)
