'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, Compass } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeStyles } from '@/hooks/useThemeStyles'

interface PlannerNavigationProps {
  currentView: 'couples' | 'vendors' | 'settings'
  onViewChange: (view: 'couples' | 'vendors' | 'settings') => void
  onStartTour?: () => void
}

export default function PlannerNavigation({ currentView, onViewChange, onStartTour }: PlannerNavigationProps) {
  const { theme: currentTheme } = useTheme()
  const theme = useThemeStyles()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleViewChange = (view: 'couples' | 'vendors' | 'settings') => {
    onViewChange(view)
    setMobileMenuOpen(false)
  }

  // Use different logo for each theme
  const logoSrc = currentTheme === 'pop'
    ? '/images/bridezilla-logo-circle.svg'  // Pink logo for Pop
    : '/images/bridezilla-logo-simple.svg'   // Green logo for Heirloom

  return (
    <nav className={`${theme.cardBackground} sticky top-0 z-40 border-b ${theme.border}`}>
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
              Planners
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3 md:gap-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {onStartTour && (
              <button
                onClick={onStartTour}
                className={`flex items-center gap-1.5 transition-colors ${theme.textSecondary} hover:${theme.textPrimary}`}
              >
                <Compass size={15} />
                Tour
              </button>
            )}
            <a
              href="/planners?view=couples"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('couples')
              }}
              className={`transition-colors ${
                currentView === 'couples'
                  ? theme.navActive
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Couples
            </a>
            <a
              id="tour-nav-vendors"
              href="/planners?view=vendors"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('vendors')
              }}
              className={`transition-colors ${
                currentView === 'vendors'
                  ? theme.navActive
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Vendors
            </a>
            <a
              href="/planners?view=settings"
              onClick={(e) => {
                e.preventDefault()
                onViewChange('settings')
              }}
              className={`transition-colors ${
                currentView === 'settings'
                  ? theme.navActive
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              Settings
            </a>
          </div>

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
        <div className={`md:hidden border-t ${theme.border} ${theme.cardBackground}`}>
          <div className="px-4 py-2 space-y-1">
            {onStartTour && (
              <button
                onClick={() => {
                  onStartTour()
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${theme.textSecondary} hover:bg-stone-50 hover:${theme.textPrimary}`}
              >
                <Compass size={15} />
                Tour
              </button>
            )}
            <a
              href="/planners?view=couples"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('couples')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'couples'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50 hover:${theme.textPrimary}`
              }`}
            >
              Couples
            </a>
            <a
              href="/planners?view=vendors"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('vendors')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'vendors'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50 hover:${theme.textPrimary}`
              }`}
            >
              Vendors
            </a>
            <a
              href="/planners?view=settings"
              onClick={(e) => {
                e.preventDefault()
                handleViewChange('settings')
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'settings'
                  ? `bg-stone-100 ${theme.navActive}`
                  : `${theme.textSecondary} hover:bg-stone-50 hover:${theme.textPrimary}`
              }`}
            >
              Settings
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
