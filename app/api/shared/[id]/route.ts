import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// GET - Fetch couple and vendors for shared workspace
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const shareLinkId = id

    // Fetch couple by share link ID
    const { data: couple, error: coupleError } = await supabase
      .from('planner_couples')
      .select('*')
      .eq('share_link_id', shareLinkId)
      .eq('is_active', true)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Invalid or expired link' },
        { status: 404 }
      )
    }

    // Fetch vendors for this couple with library details (if linked)
    const { data: vendors, error: vendorsError } = await supabase
      .from('shared_vendors')
      .select(`
        *,
        library_vendor:planner_vendor_library(
          id,
          vendor_name,
          vendor_type,
          contact_name,
          email,
          phone,
          website,
          instagram,
          location,
          tags,
          vendor_currency,
          estimated_cost,
          default_note
        )
      `)
      .eq('planner_couple_id', couple.id)
      .order('vendor_type', { ascending: true })
      .order('vendor_name', { ascending: true })

    if (vendorsError) {
      console.error('Failed to fetch vendors:', vendorsError)
      return NextResponse.json(
        { error: 'Failed to fetch vendors' },
        { status: 500 }
      )
    }

    // Merge library vendor data with shared vendor data
    const enrichedVendors = vendors?.map(vendor => {
      if (vendor.library_vendor) {
        // Vendor shared from library - use library data with shared vendor overrides
        return {
          ...vendor,
          // Use library vendor details
          vendor_name: vendor.library_vendor.vendor_name,
          vendor_type: vendor.library_vendor.vendor_type,
          contact_name: vendor.library_vendor.contact_name,
          email: vendor.library_vendor.email,
          phone: vendor.library_vendor.phone,
          website: vendor.library_vendor.website,
          instagram: vendor.library_vendor.instagram,
          location: vendor.library_vendor.location,
          tags: vendor.library_vendor.tags,
          // Use custom_note if provided, otherwise library default_note
          planner_note: vendor.custom_note || vendor.library_vendor.default_note,
          // Convert library estimated_cost to legacy cost fields
          estimated_cost_eur: vendor.library_vendor.vendor_currency === 'EUR' ? vendor.library_vendor.estimated_cost : null,
          estimated_cost_usd: vendor.library_vendor.vendor_currency === 'USD' ? vendor.library_vendor.estimated_cost : null,
        }
      }
      // Manually added vendor (legacy) - use shared_vendors data as-is
      return vendor
    }) || []

    return NextResponse.json({
      couple,
      vendors: enrichedVendors,
    })
  } catch (error) {
    console.error('Get shared workspace error:', error)
    return NextResponse.json(
      { error: 'Failed to load workspace' },
      { status: 500 }
    )
  }
}
