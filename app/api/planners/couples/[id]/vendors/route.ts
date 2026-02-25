import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Get vendors shared with a couple
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params

    // Resolve id OR share_link_id -> couple UUID (Claude Haiku may pass either)
    // UUID-safe: only use .or() with id column when value is a valid UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let coupleUUID = id
    if (isUUID) {
      // Safe to query against UUID column - could be couple UUID or UUID share_link_id
      const { data: coupleRow } = await supabaseAdmin
        .from('planner_couples')
        .select('id')
        .or(`id.eq.${id},share_link_id.eq.${id}`)
        .single()
      if (coupleRow) coupleUUID = coupleRow.id
    } else {
      // Slug like 'edward-bella-demo' - only match share_link_id, never id column
      const { data: coupleRow } = await supabaseAdmin
        .from('planner_couples')
        .select('id')
        .eq('share_link_id', id)
        .single()
      if (coupleRow) coupleUUID = coupleRow.id
    }

    const { data, error } = await supabaseAdmin
      .from('shared_vendors')
      .select('*, vendor_library:planner_vendor_library!vendor_library_id(*)')
      .eq('planner_couple_id', coupleUUID)
      .order('vendor_type', { ascending: true })
      .order('vendor_name', { ascending: true })

    if (error) {
      console.error('Failed to fetch vendors:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vendors' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Get vendors error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST - Add vendor to couple
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vendorData = await request.json()

    const { data, error } = await supabaseAdmin
      .from('shared_vendors')
      .insert({
        ...vendorData,
        planner_couple_id: id,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to add vendor:', error)
      return NextResponse.json(
        { error: 'Failed to add vendor' },
        { status: 500 }
      )
    }

    // Log activity
    await supabaseAdmin.from('vendor_activity').insert({
      planner_couple_id: id,
      shared_vendor_id: data.id,
      action: 'vendor_shared',
      actor: 'planner',
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Add vendor error:', error)
    return NextResponse.json(
      { error: 'Failed to add vendor' },
      { status: 500 }
    )
  }
}
