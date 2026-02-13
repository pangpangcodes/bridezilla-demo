'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, ExternalLink } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeStyles } from '@/hooks/useThemeStyles'

interface AdminNavigationProps {
  currentView: 'dashboard' | 'rsvp' | 'vendors' | 'settings'
  onViewChange: (view: 'dashboard' | 'rsvp' | 'vendors' | 'settings') => void
  onLogout: () => void
}

export default function AdminNavigation({ currentView, onViewChange, onLogout }: AdminNavigationProps) {
  const { theme: currentTheme } = useTheme()
  const theme = useThemeStyles()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleViewChange = (view: 'dashboard' | 'rsvp' | 'vendors' | 'settings') => {
    onViewChange(view)
    setMobileMenuOpen(false)
  }

  // Admin always uses simple transparent logo
  const logoSrc = '/images/bridezilla-logo-simple.svg'

  return (
    <nav className="bg-white sticky top-0 z-40 border-b border-stone-200">
      <div className="px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="https://bridezilla-demo.vercel.app/" className="flex items-center gap-2 md:gap-3">
          <Image
            src={logoSrc}
            alt="Bridezilla"
            width={32}
            height={32}
            className="object-contain md:w-[40px] md:h-[40px]"
          />
          <div className="flex items-baseline gap-2">
            <span className={`font-heading text-base sm:text-xl md:text-2xl lg:text-3xl tracking-[0.2em] sm:tracking-[0.3em] uppercase ${theme.textPrimary}`}>
              BRIDEZILLA
            </span>
            <span className={`${theme.textMuted} text-xs md:text-sm`}>|</span>
            <span className={`font-heading text-xs md:text-sm uppercase tracking-wider ${theme.textSecondary}`}>
              Couples
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3 md:gap-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a
              href="/couples?view=dashboard"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('dashboard')
              }}
              className={`transition-colors ${
                currentView === 'dashboard'
                  ? theme.navActive
                  : `${theme.navInactive} ${theme.navHover}`
              }`}
            >
              Dashboard
            </a>
            <a
              href="/couples?view=rsvp"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('rsvp')
              }}
              className={`transition-colors ${
                currentView === 'rsvp'
                  ? theme.navActive
                  : `${theme.navInactive} ${theme.navHover}`
              }`}
            >
              RSVP Tracking
            </a>
            <a
              href="/couples?view=vendors"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('vendors')
              }}
              className={`transition-colors ${
                currentView === 'vendors'
                  ? theme.navActive
                  : `${theme.navInactive} ${theme.navHover}`
              }`}
            >
              Vendor Management
            </a>
            <a
              href="/couples?view=settings"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('settings')
              }}
              className={`transition-colors ${
                currentView === 'settings'
                  ? theme.navActive
                  : `${theme.navInactive} ${theme.navHover}`
              }`}
            >
              Settings
            </a>
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-sm font-medium ${theme.textSecondary} hover:${theme.textPrimary} transition-colors`}
            >
              View Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`hidden md:block px-5 py-2.5 rounded-xl ${theme.primaryButton} ${theme.primaryButtonHover} ${theme.textOnPrimary} text-sm font-medium transition-colors`}
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${theme.textSecondary} hover:${theme.textPrimary} transition-colors`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <a
              href="/couples?view=dashboard"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('dashboard')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50`
              }`}
            >
              Dashboard
            </a>
            <a
              href="/couples?view=rsvp"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('rsvp')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'rsvp'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50`
              }`}
            >
              RSVP Tracking
            </a>
            <a
              href="/couples?view=vendors"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('vendors')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'vendors'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50`
              }`}
            >
              Vendor Management
            </a>
            <a
              href="/couples?view=settings"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('settings')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'settings'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50`
              }`}
            >
              Settings
            </a>
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${theme.textSecondary} hover:bg-stone-50 transition-colors`}
            >
              View Website
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                onLogout()
                setMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg ${theme.primaryButton} ${theme.primaryButtonHover} ${theme.textOnPrimary} text-sm font-medium transition-colors`}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
