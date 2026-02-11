import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createTablesViaREST() {
  console.log('🚀 Creating tables via REST API workaround...\n')

  // We'll create the tables by trying to insert into them with returning
  // If they don't exist, Supabase will give us an error, but we can use
  // the error to determine what to do next

  const vendorsSchema = {
    id: 'uuid',
    vendor_name: 'text',
    vendor_type: 'text',
    contact_name: 'text',
    email: 'text',
    phone: 'text',
    website: 'text',
    estimated_cost_eur: 'numeric',
    estimated_cost_cad: 'numeric',
    contract_signed: 'boolean',
    contract_url: 'text',
    payments: 'jsonb',
    notes: 'text',
    created_at: 'timestamptz',
    updated_at: 'timestamptz'
  }

  console.log('📋 Tables need to be created in Supabase Dashboard.\n')
  console.log('Please visit: https://supabase.com/dashboard/project/YOUR_PROJECT/editor')
  console.log('\nRun this SQL in the SQL Editor:\n')
  console.log('='.repeat(80))
  console.log(`
-- Admin Dashboard Tables
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

CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);

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

CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
  `)
  console.log('='.repeat(80))
  console.log('\n✅ After running the SQL, execute: npm run populate-admin')
}

createTablesViaREST()
