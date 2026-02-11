import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { MOCK_VENDORS } from '../lib/mock-data'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function populateAdminData() {
  console.log('🚀 Populating admin dashboard data...\n')

  // 1. Clear existing data
  console.log('1️⃣  Clearing existing data...')
  await supabase.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('rsvps').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 2. Insert vendors
  console.log('2️⃣  Inserting vendors...')
  const vendorsToInsert = MOCK_VENDORS.map(v => ({
    vendor_name: v.vendor_name,
    vendor_type: v.vendor_type,
    contact_name: v.contact_name,
    email: v.email,
    phone: v.phone,
    website: v.website,
    estimated_cost_eur: v.vendor_cost,
    estimated_cost_cad: v.cost_converted,
    contract_signed: v.contract_signed || false,
    payments: v.payments || [],
    notes: v.notes
  }))

  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .insert(vendorsToInsert)
    .select()

  if (vendorsError) {
    console.error('❌ Error inserting vendors:', vendorsError)
  } else {
    console.log(`✅ Inserted ${vendors?.length || 0} vendors`)
  }

  // 3. Insert RSVPs
  console.log('3️⃣  Inserting RSVPs...')
  const rsvpsToInsert = [
    {
      name: 'Alice & Bob Johnson',
      email: 'alice@example.com',
      phone: '+1 555-0101',
      attending: true,
      number_of_guests: 2,
      guests: [{ name: 'Alice Johnson', order: 1 }, { name: 'Bob Johnson', order: 2 }]
    },
    {
      name: 'Carol Smith',
      email: 'carol@example.com',
      phone: '+1 555-0102',
      attending: true,
      number_of_guests: 1,
      guests: [{ name: 'Carol Smith', order: 1 }],
      dietary_requirements: 'Vegetarian'
    },
    {
      name: 'David & Emma Wilson',
      email: 'david@example.com',
      phone: '+1 555-0103',
      attending: false,
      number_of_guests: 2,
      guests: []
    },
    {
      name: 'Frank & Grace Lee',
      email: 'frank@example.com',
      phone: '+1 555-0104',
      attending: true,
      number_of_guests: 2,
      guests: [{ name: 'Frank Lee', order: 1 }, { name: 'Grace Lee', order: 2 }],
      song_request: 'At Last - Etta James'
    }
  ]

  const { data: rsvps, error: rsvpsError } = await supabase
    .from('rsvps')
    .insert(rsvpsToInsert)
    .select()

  if (rsvpsError) {
    console.error('❌ Error inserting RSVPs:', rsvpsError)
  } else {
    console.log(`✅ Inserted ${rsvps?.length || 0} RSVPs`)
  }

  console.log('\n✨ Admin data populated successfully!')
}

populateAdminData().catch(console.error)
