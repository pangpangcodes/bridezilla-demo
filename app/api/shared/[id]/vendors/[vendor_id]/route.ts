import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import type { CoupleUpdateVendorInput } from '@/types/planner'

// PUT - Update vendor status and notes from couple
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; vendor_id: string }> }
) {
  try {
    const { id, vendor_id } = await params
    const shareLinkId = id
    const vendorId = vendor_id
    const updates: CoupleUpdateVendorInput = await request.json()

    // Verify the share link is valid
    const { data: couple, error: coupleError } = await supabase
      .from('planner_couples')
      .select('id')
      .eq('share_link_id', shareLinkId)
      .eq('is_active', true)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Invalid or expired link' },
        { status: 404 }
      )
    }

    // Update vendor
    const { data: vendor, error: updateError } = await supabase
      .from('shared_vendors')
      .update({
        couple_status: updates.couple_status,
        couple_note: updates.couple_note,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendorId)
      .eq('planner_couple_id', couple.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update vendor:', updateError)
      return NextResponse.json(
        { error: 'Failed to update vendor' },
        { status: 500 }
      )
    }

    // Log activity
    const activityAction = updates.couple_status !== undefined ? 'status_changed' : 'note_added'
    await supabase.from('vendor_activity').insert({
      planner_couple_id: couple.id,
      shared_vendor_id: vendorId,
      action: activityAction,
      actor: 'couple',
      new_value: updates.couple_status || updates.couple_note || '',
    })

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Update vendor error:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}
