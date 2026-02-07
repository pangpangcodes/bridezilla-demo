import { demoSupabase } from './demo-supabase'

// Demo mode: use mock Supabase client backed by localStorage
export const supabase = demoSupabase

// Initialize demo data on client side
if (typeof window !== 'undefined') {
  demoSupabase.initializeDemo()
}
