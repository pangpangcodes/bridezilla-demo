import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { CreatePlannerCoupleInput, PlannerCouple } from '@/types/planner'

// GET - List all couples
export async function GET(request: NextRequest) {
  try {
    // Auth check

    const { data, error } = await supabaseAdmin
      .from('planner_couples')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch couples:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch couples' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Get couples error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couples' },
      { status: 500 }
    )
  }
}

// POST - Create a new couple
export async function POST(request: NextRequest) {
  try {
    // Auth check

    const input: CreatePlannerCoupleInput = await request.json()

    // Validate required fields
    if (!input.couple_names || input.couple_names.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Couple names are required' },
        { status: 400 }
      )
    }

    // Generate a readable slug from couple names, e.g. "Alice & Bob" → "alice-bob-a1b2"
    const baseSlug = input.couple_names
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    const suffix = crypto.randomUUID().slice(0, 4)
    const shareLinkId = `${baseSlug}-${suffix}`

    // Prepare couple data
    const coupleData = {
      couple_names: input.couple_names.trim(),
      couple_email: input.couple_email?.trim() || null,
      wedding_date: input.wedding_date || null,
      wedding_location: input.wedding_location?.trim() || null,
      notes: input.notes?.trim() || null,
      share_link_id: shareLinkId,
      is_active: true,
    }

    // Insert into database using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('planner_couples')
      .insert(coupleData)
      .select()
      .single()

    if (error) {
      console.error('Failed to create couple:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create couple' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data as PlannerCouple
    }, { status: 201 })
  } catch (error) {
    console.error('Create couple error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create couple' },
      { status: 500 }
    )
  }
}
