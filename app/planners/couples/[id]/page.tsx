'use client'

import { use, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CoupleDetail from '@/components/planner/CoupleDetail'
import PlannerNavigation from '@/components/planner/PlannerNavigation'
import AnimatedHearts from '@/components/AnimatedHearts'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import { useDemoTour } from '@/hooks/useDemoTour'
import { PLANNER_TOUR_STEPS } from '@/lib/demo-tour-steps'

function CoupleDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const theme = useThemeStyles()

  const { startTour } = useDemoTour('ksmt_demo_tour_planner', PLANNER_TOUR_STEPS.length)

  const handleStartTour = useCallback(() => {
    // Go back to planner dashboard and start tour from step 0
    startTour()
    router.push('/planners?view=couples')
  }, [startTour, router])

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Also scroll after render to override any browser restoration
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 10)

    return () => clearTimeout(timer)
  }, [id])

  const handleViewChange = (view: 'dashboard' | 'couples' | 'vendors' | 'settings') => {
    router.push(`/planners?view=${view}`)
  }

  return (
    <>
      <PlannerNavigation
        currentView="couples"
        onViewChange={handleViewChange}
        onStartTour={handleStartTour}
      />
      <main className={`${theme.pageBackground} relative min-h-screen overflow-x-hidden`}>
        <AnimatedHearts />
        <div className="relative z-10">
          <CoupleDetail coupleId={id} />
        </div>
      </main>
    </>
  )
}

export default function CoupleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return <CoupleDetailContent id={id} />
}
