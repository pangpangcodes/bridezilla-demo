'use client'

import Image from 'next/image'

interface AdminHeaderProps {
  onLogout?: () => void
  currentView?: 'dashboard' | 'rsvp' | 'vendors'
}

export default function AdminHeader({ onLogout, currentView = 'dashboard' }: AdminHeaderProps) {
  const getTitle = () => {
    switch (currentView) {
      case 'rsvp':
        return 'RSVP Tracking'
      case 'vendors':
        return 'Vendor Management'
      case 'dashboard':
      default:
        return 'Dashboard'
    }
  }

  return (
    <div className="flex justify-between items-center mb-4 md:mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0">
          <Image
            src="/images/bridezilla-logo-circle.svg"
            alt="Bridezilla"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white uppercase tracking-wide">
          {getTitle()}
        </h2>
      </div>
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-bridezilla-pink text-white px-3 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-semibold hover:scale-105 transition-transform"
        >
          Logout
        </button>
      )}
    </div>
  )
}
