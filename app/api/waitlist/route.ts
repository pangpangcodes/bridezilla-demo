import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('Supabase URL configured:', !!supabaseUrl)
console.log('Supabase Key configured:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, firstName, lastName, email, businessName, country } = body

    // Validate required fields
    if (!userType || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate user type
    if (userType !== 'bride' && userType !== 'planner') {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // If planner, business name is required
    if (userType === 'planner' && !businessName) {
      return NextResponse.json(
        { error: 'Business name is required for planners' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          user_type: userType,
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          business_name: businessName || null,
          country: country || null
        }
      ])
      .select()
      .single()

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }

      console.error('Supabase error:', error)
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      return NextResponse.json(
        { error: 'Failed to join waitlist', details: error.message || 'Unknown error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined waitlist',
        data
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
