'use client'

import { RotateCcw } from 'lucide-react'
import { demoSupabase } from '@/lib/demo-supabase'

export function DemoBanner() {
  const handleReset = () => {
    if (confirm('Reset demo to original data? This will clear any changes you made.')) {
      demoSupabase.resetDemo()
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pink-500 text-white py-2 px-4 text-center text-sm z-50 shadow-lg">
      <span className="font-semibold">Demo Mode:</span> All data is fictional and stored locally.
      <button
        onClick={handleReset}
        className="ml-4 underline hover:no-underline inline-flex items-center gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        Reset Demo
      </button>
    </div>
  )
}
