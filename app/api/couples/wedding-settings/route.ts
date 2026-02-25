import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

// GET - Fetch wedding settings (admin only)
export async function GET(request: NextRequest) {
  try {

    const { data, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch wedding settings:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || null })
  } catch (error: any) {
    console.error('Wedding settings error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch wedding settings' }, { status: 500 })
  }
}
