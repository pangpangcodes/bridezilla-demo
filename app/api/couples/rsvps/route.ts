import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

// GET - List all RSVPs (admin only)
export async function GET(request: NextRequest) {
  try {

    const { data, error } = await supabase
      .from('rsvps')
      .select('*')

    if (error) {
      console.error('Failed to fetch RSVPs:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error: any) {
    console.error('List RSVPs error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch RSVPs' }, { status: 500 })
  }
}
