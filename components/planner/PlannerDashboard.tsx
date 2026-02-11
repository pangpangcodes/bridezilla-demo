'use client'

import { useState, useEffect } from 'react'
import AnimatedHearts from '@/components/AnimatedHearts'
import PlannerNavigation from './PlannerNavigation'
import CouplesCalendarView from './CouplesCalendarView'
import VendorLibraryTab from './VendorLibraryTab'
import SettingsTab from './SettingsTab'
import { useThemeStyles } from '@/hooks/useThemeStyles'

export default function PlannerDashboard() {
  const theme = useThemeStyles()
  const [currentView, setCurrentView] = useState<'couples' | 'vendors' | 'settings'>('couples')

  // Listen for view changes from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const view = params.get('view')
      if (view === 'vendors') {
        setCurrentView('vendors')
      } else if (view === 'settings') {
        setCurrentView('settings')
      } else {
        setCurrentView('couples')
      }

      const handleUrlChange = () => {
        const params = new URLSearchParams(window.location.search)
        const view = params.get('view')
        if (view === 'vendors') {
          setCurrentView('vendors')
        } else if (view === 'settings') {
          setCurrentView('settings')
        } else {
          setCurrentView('couples')
        }
      }

      window.addEventListener('popstate', handleUrlChange)
      return () => window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])


  const handleViewChange = (view: 'couples' | 'vendors' | 'settings') => {
    setCurrentView(view)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('view', view)
      window.history.pushState({}, '', url)
    }
  }

  // Show dashboard
  return (
    <div className={`min-h-screen ${theme.pageBackground} relative`}>
      <AnimatedHearts />
      <PlannerNavigation
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <div className="relative z-10 pb-12">
        <section className="py-12 font-body">
          <div className="mx-auto px-6">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className={`text-3xl md:text-4xl font-display mb-2 ${theme.textOnPagePrimary}`}>
                    {currentView === 'couples' && 'Couples'}
                    {currentView === 'vendors' && 'Vendors'}
                    {currentView === 'settings' && 'Settings'}
                  </h2>
                  <p className={`${theme.textOnPageSecondary} font-body`}>
                    {currentView === 'couples' && 'Manage your wedding couples and their celebration details.'}
                    {currentView === 'vendors' && 'Your curated collection of trusted wedding vendors.'}
                    {currentView === 'settings' && 'Configure your planner workspace preferences.'}
                  </p>
                </div>
              </div>

              {/* Content Views */}
              {currentView === 'couples' && <CouplesCalendarView />}
              {currentView === 'vendors' && <VendorLibraryTab />}
              {currentView === 'settings' && <SettingsTab />}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
