import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH - Update vendor fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update vendor:', error)
      return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Update vendor error:', error)
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}
