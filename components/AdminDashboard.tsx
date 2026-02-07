'use client'

import { useState, useEffect } from 'react'
import AdminHeader from './admin/AdminHeader'
import DashboardTab from './admin/DashboardTab'
import RSVPTab from './admin/RSVPTab'
import VendorsTab from './admin/VendorsTab'

type AdminView = 'dashboard' | 'rsvp' | 'vendors'

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')

  useEffect(() => {
    // Read view from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    setCurrentView(
      view === 'vendors' ? 'vendors' :
      view === 'rsvp' ? 'rsvp' :
      'dashboard'
    )

    // Listen for URL changes (browser back/forward)
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search)
      const view = params.get('view')
      setCurrentView(
        view === 'vendors' ? 'vendors' :
        view === 'rsvp' ? 'rsvp' :
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

  return (
    <section className="py-6 font-body">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <AdminHeader currentView={currentView} />

          {currentView === 'dashboard' && <DashboardTab />}
          {currentView === 'rsvp' && <RSVPTab />}
          {currentView === 'vendors' && <VendorsTab />}
        </div>
      </div>
    </section>
  )
}
