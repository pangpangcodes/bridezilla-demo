'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { DEMO_COUPLE } from '@/lib/mock-data'

type NavItem = {
  href: string
  label: string
  isBackLink?: boolean
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/itinerary', label: 'Itinerary' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/travel', label: 'Travel' },
  { href: '/faq', label: 'FAQ' },
]

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin?view=rsvp', label: 'RSVPs' },
  { href: '/admin?view=vendors', label: 'Vendors' },
  { href: '/', label: 'Back to Website', isBackLink: true },
]

const menuItems = [
  { href: '/rsvp', label: 'RSVP' },
  { href: '/rsvp/lookup', label: 'View Your RSVP' },
]

const adminMenuItem = {
  href: '/admin',
  label: `Admin (for ${DEMO_COUPLE.bride.charAt(0)}&${DEMO_COUPLE.groom.charAt(0)})`,
  isMuted: true
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isAdminPage, setIsAdminPage] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Detect if current page is admin
    setIsAdminPage(window.location.pathname === '/admin')

    // Listen for route changes
    const handleRouteChange = () => {
      setIsAdminPage(window.location.pathname === '/admin')
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Determine which nav items to show based on route
  const navItems = isAdminPage ? adminNavItems : mainNavItems

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled || isMenuOpen || isAdminPage
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-14 md:h-16">
            <a
              href="/"
              className="text-4xl font-display font-bold text-gray-900 hover:text-bridezilla-pink transition-colors"
            >
              B & E
            </a>

            {/* Desktop Navigation - Always Visible */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-all flex items-center gap-2 ${
                    isAdminPage
                      ? item.isBackLink
                        ? 'font-heading text-gray-700 hover:text-bridezilla-pink hover:translate-x-1'
                        : 'font-heading uppercase tracking-wide text-gray-700 hover:text-bridezilla-pink'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                  {item.isBackLink && <ArrowRight className="w-4 h-4" />}
                </a>
              ))}

              {/* Menu Button for Additional Items - Only show on main site */}
              {!isAdminPage && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-700 hover:text-primary-600"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Menu Dropdown - Only show on main site */}
          {isMenuOpen && !isAdminPage && (
            <div className="hidden md:block absolute right-4 top-full mt-1 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-gray-200 py-2">
              <div className="flex flex-col">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors py-2 px-4 text-sm"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setShowContactModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors py-2 px-4 text-sm text-left"
                >
                  Contact Us
                </button>
                <a
                  href={adminMenuItem.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 font-medium transition-colors py-2 px-4 text-sm border-t border-gray-200 mt-1 pt-3 flex items-center gap-2"
                >
                  <Image
                    src="/images/bridezilla-logo-circle.svg"
                    alt="Admin"
                    width={16}
                    height={16}
                    className="object-contain opacity-60"
                  />
                  {adminMenuItem.label}
                </a>
              </div>
            </div>
          )}

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition-all py-2 flex items-center gap-2 ${
                      isAdminPage
                        ? item.isBackLink
                          ? 'font-heading text-gray-700 hover:text-bridezilla-pink hover:translate-x-1'
                          : 'font-heading uppercase tracking-wide text-gray-700 hover:text-bridezilla-pink'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                    {item.isBackLink && <ArrowRight className="w-4 h-4" />}
                  </a>
                ))}
                {!isAdminPage && (
                  <>
                    {menuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
                      >
                        {item.label}
                      </a>
                    ))}
                    <a
                      href={adminMenuItem.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600 font-medium transition-colors py-2 border-y border-gray-200 my-2 py-3 flex items-center gap-2"
                    >
                      <Image
                        src="/images/bridezilla-logo-circle.svg"
                        alt="Admin"
                        width={16}
                        height={16}
                        className="object-contain opacity-60"
                      />
                      {adminMenuItem.label}
                    </a>
                    <button
                      onClick={() => {
                        setShowContactModal(true)
                        setIsMenuOpen(false)
                      }}
                      className="px-6 py-2 bg-green-200 text-gray-900 rounded-full font-semibold hover:bg-green-300 transition-colors text-center"
                    >
                      Contact Us
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contact Modal - Outside nav element */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Contact Us</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                <Phone className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Monica</h4>
                  <a
                    href="tel:6479735655"
                    className="text-primary-600 hover:text-primary-700 transition-colors block"
                  >
                    (647) 973-5655
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                <Phone className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Kevin</h4>
                  <a
                    href="tel:6476324688"
                    className="text-primary-600 hover:text-primary-700 transition-colors block"
                  >
                    (647) 632-4688
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

