'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LandingNavbar: React.FC = () => {
  return (
    <nav className="px-4 sm:px-6 py-4 sm:py-8 flex justify-between items-center max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0">
            <Image
              src="/bridezilla-logo-circle-green.svg"
              alt="Bridezilla"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-heading text-lg sm:text-2xl md:text-3xl tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#2B2D42]">
            BRIDEZILLA
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-3 md:gap-4">
          <span className="text-[#2B2D42] opacity-30">|</span>
          <Link
            href="/planners"
            className="font-heading text-sm md:text-lg tracking-[0.2em] uppercase text-[#2B2D42] hover:text-[#2F5249] transition-colors opacity-70 hover:opacity-100"
          >
            PLANNERS
          </Link>
          <span className="text-[#2B2D42] opacity-30">|</span>
          <Link
            href="/couples"
            className="font-heading text-sm md:text-lg tracking-[0.2em] uppercase text-[#2B2D42] hover:text-[#2F5249] transition-colors opacity-70 hover:opacity-100"
          >
            COUPLES
          </Link>
        </div>
      </div>

      <a
        href="mailto:hello@bridezilla.ai?subject=Join%20Waitlist"
        className="bg-[#2F5249] text-white px-4 sm:px-8 py-2 rounded-full font-heading text-sm sm:text-xl hover:bg-[#3d6960] transition-all transform hover:scale-105 shadow-md tracking-wide sm:tracking-widest uppercase whitespace-nowrap"
      >
        Join Waitlist
      </a>
    </nav>
  )
}

export default LandingNavbar
