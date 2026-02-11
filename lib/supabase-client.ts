// Unified Supabase client for real database only
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials in environment variables')
}

// Real Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper to check if we're in demo mode (always false now)
export const isDemoMode = () => false

// Helper to get client type (always real now)
export const getClientType = () => 'real'
