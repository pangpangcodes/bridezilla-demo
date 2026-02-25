import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Get couple details by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check

    const { id } = await params
    console.log('Fetching couple with ID:', id)

    // Try looking up by share_link_id first, then fall back to id
    let data = null
    let error = null

    // First try share_link_id
    const shareLinkResult = await supabaseAdmin
      .from('planner_couples')
      .select('*')
      .eq('share_link_id', id)
      .single()

    if (shareLinkResult.data) {
      data = shareLinkResult.data
    } else {
      // Fall back to database id
      const idResult = await supabaseAdmin
        .from('planner_couples')
        .select('*')
        .eq('id', id)
        .single()

      data = idResult.data
      error = idResult.error
    }

    console.log('Supabase result:', { data: !!data, error: error?.message })

    if (error || !data) {
      console.error('Couple not found error:', error)
      return NextResponse.json(
        { success: false, error: 'Couple not found', details: error?.message },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get couple error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couple' },
      { status: 500 }
    )
  }
}

// PATCH - Update couple details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check

    const { id } = await params
    const updates = await request.json()

    // Try looking up by share_link_id first, then fall back to id
    let data = null
    let error = null

    // First try share_link_id
    const shareLinkResult = await supabaseAdmin
      .from('planner_couples')
      .update(updates)
      .eq('share_link_id', id)
      .select()
      .single()

    if (shareLinkResult.data) {
      data = shareLinkResult.data
    } else {
      // Fall back to database id
      const idResult = await supabaseAdmin
        .from('planner_couples')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      data = idResult.data
      error = idResult.error
    }

    if (error) {
      console.error('Update couple error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update couple' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Update couple error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update couple' },
      { status: 500 }
    )
  }
}

// DELETE - Archive couple
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check

    const { id } = await params

    // Try looking up by share_link_id first, then fall back to id
    let error = null

    // First try share_link_id
    const shareLinkResult = await supabaseAdmin
      .from('planner_couples')
      .update({ is_active: false })
      .eq('share_link_id', id)

    if (shareLinkResult.error) {
      // Fall back to database id
      const idResult = await supabaseAdmin
        .from('planner_couples')
        .update({ is_active: false })
        .eq('id', id)

      error = idResult.error
    } else {
      error = shareLinkResult.error
    }

    if (error) {
      console.error('Archive couple error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to archive couple' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Archive couple error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to archive couple' },
      { status: 500 }
    )
  }
}
