import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

// Valid columns in the vendors table
const VALID_VENDOR_COLUMNS = new Set([
  'vendor_name', 'vendor_type', 'vendor_currency', 'contact_name', 'email', 'phone',
  'website', 'estimated_cost_eur', 'estimated_cost_cad',
  'contract_signed', 'contract_url', 'payments', 'notes'
])

function sanitizeBody(body: Record<string, any>) {
  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(body)) {
    if (VALID_VENDOR_COLUMNS.has(key)) {
      sanitized[key] = value
    }
  }
  // Replace temporary payment IDs (e.g. "new-1") with real UUIDs
  if (sanitized.payments && Array.isArray(sanitized.payments)) {
    sanitized.payments = sanitized.payments.map((payment: any) => ({
      ...payment,
      id: (!payment.id || String(payment.id).startsWith('new-')) ? crypto.randomUUID() : payment.id
    }))
  }
  return sanitized
}

// GET - List all vendors
export async function GET(request: NextRequest) {
  try {

    const { data, error } = await supabase
      .from('vendors')
      .select('*')

    if (error) {
      console.error('Failed to fetch vendors:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error: any) {
    console.error('List vendors error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch vendors' }, { status: 500 })
  }
}

// POST - Create a new vendor
export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const sanitized = sanitizeBody(body)

    const { data, error } = await supabase
      .from('vendors')
      .insert(sanitized)
      .select()
      .single()

    if (error) {
      console.error('Failed to create vendor:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Create vendor error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to create vendor' }, { status: 500 })
  }
}
