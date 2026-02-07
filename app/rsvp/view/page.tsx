'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AnimatedHearts from '@/components/AnimatedHearts'
import RSVPView from '@/components/RSVPView'
import type { RSVPViewData, Question } from '@/types/rsvp'

function RSVPViewContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rsvpData, setRsvpData] = useState<{
    rsvp: RSVPViewData
    questions: Question[]
    token: string
  } | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('No access token provided')
      setLoading(false)
      return
    }

    async function verifyToken() {
      try {
        const response = await fetch(`/api/rsvp/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to verify token')
        }

        setRsvpData({
          rsvp: data.data.rsvp,
          questions: data.data.questions,
          token: data.data.token
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load RSVP')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [searchParams])

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
        <AnimatedHearts />
        <Navigation />
        <div className="pt-20 pb-8 relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading your RSVP...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
        <AnimatedHearts />
        <Navigation />
        <div className="pt-20 pb-8 relative z-10 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load RSVP</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <a
                  href="/rsvp"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Request New Link
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
      <AnimatedHearts />
      <Navigation />
      <div className="pt-20 pb-8 relative z-10 min-h-screen">
        {rsvpData && (
          <RSVPView
            rsvp={rsvpData.rsvp}
            questions={rsvpData.questions}
            token={rsvpData.token}
          />
        )}
      </div>
      <Footer />
    </main>
  )
}

export default function RSVPViewPage() {
  return (
    <Suspense fallback={
      <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
        <AnimatedHearts />
        <Navigation />
        <div className="pt-20 pb-8 relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading your RSVP...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <RSVPViewContent />
    </Suspense>
  )
}
