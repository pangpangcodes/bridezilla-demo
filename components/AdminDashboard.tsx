'use client'

import { useState, useEffect } from 'react'
import AnimatedHearts from './AnimatedHearts'
import AdminNavigation from './admin/AdminNavigation'
import DashboardTab from './admin/DashboardTab'
import RSVPTab from './admin/RSVPTab'
import VendorsTab from './admin/VendorsTab'
import SettingsTab from './admin/SettingsTab'
import { useThemeStyles } from '@/hooks/useThemeStyles'

type AdminView = 'dashboard' | 'rsvp' | 'vendors' | 'settings'

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const theme = useThemeStyles()

  useEffect(() => {
    // Read view from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    setCurrentView(
      view === 'vendors' ? 'vendors' :
      view === 'rsvp' ? 'rsvp' :
      view === 'settings' ? 'settings' :
      'dashboard'
    )

    // Listen for URL changes (browser back/forward)
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search)
      const view = params.get('view')
      setCurrentView(
        view === 'vendors' ? 'vendors' :
        view === 'rsvp' ? 'rsvp' :
        view === 'settings' ? 'settings' :
        'dashboard'
      )
    }

    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [])

  const handleLogout = () => {
    // No-op for demo - just redirect to home
    window.location.href = '/'
  }

  const handleViewChange = (view: 'dashboard' | 'rsvp' | 'vendors' | 'settings') => {
    setCurrentView(view)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('view', view)
      window.history.pushState({}, '', url)
    }
  }

  return (
    <div className={`min-h-screen ${theme.pageBackground} relative`}>
      <AnimatedHearts />
      <AdminNavigation
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      <div className="relative z-10 pb-12">
        <section className="py-12 font-body">
          <div className="mx-auto px-6">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className={`text-3xl md:text-4xl font-display mb-2 ${theme.textPrimary}`}>
                    {currentView === 'dashboard' && 'Dashboard'}
                    {currentView === 'rsvp' && 'RSVP Tracking'}
                    {currentView === 'vendors' && 'Vendor Management'}
                    {currentView === 'settings' && 'Settings'}
                  </h2>
                  <p className={`${theme.textSecondary} font-body`}>
                    {currentView === 'dashboard' && 'Overview of your wedding planning progress.'}
                    {currentView === 'rsvp' && 'Manage guest responses and attendance.'}
                    {currentView === 'vendors' && 'Track vendors, contracts, and payments.'}
                    {currentView === 'settings' && 'Configure your admin workspace preferences.'}
                  </p>
                </div>
              </div>

              {/* Content Views */}
              {currentView === 'dashboard' && <DashboardTab />}
              {currentView === 'rsvp' && <RSVPTab />}
              {currentView === 'vendors' && <VendorsTab />}
              {currentView === 'settings' && <SettingsTab />}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
