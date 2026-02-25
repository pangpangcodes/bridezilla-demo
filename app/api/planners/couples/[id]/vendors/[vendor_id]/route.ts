import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// PATCH - Update vendor status from planner view and log activity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; vendor_id: string }> }
) {
  try {

    const { id: coupleId, vendor_id: vendorId } = await params
    const updates = await request.json()

    const { data, error } = await supabaseAdmin
      .from('shared_vendors')
      .update(updates)
      .eq('id', vendorId)
      .eq('planner_couple_id', coupleId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update vendor:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Log activity
    if (updates.couple_status !== undefined) {
      await supabaseAdmin.from('vendor_activity').insert({
        planner_couple_id: coupleId,
        shared_vendor_id: vendorId,
        action: 'status_changed',
        actor: 'planner',
        new_value: updates.couple_status,
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Update vendor error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to update vendor' }, { status: 500 })
  }
}
