import React from 'react'
import Image from 'next/image'

const LandingFooter: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-stone-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[#2B2D42]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/bridezilla-logo-circle-green.svg"
              alt="Bridezilla"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-heading text-xl tracking-[0.3em] uppercase">
            BRIDEZILLA
          </span>
        </div>

        <div className="flex gap-8 font-heading text-sm tracking-widest text-[#8D99AE]">
          <a href="#" className="hover:text-[#2F5249] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#2F5249] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#2F5249] transition-colors">Contact</a>
        </div>

        <div className="font-heading text-sm tracking-widest text-[#8D99AE]">
          © 2026 BRIDEZILLA All Rights Reserved
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
