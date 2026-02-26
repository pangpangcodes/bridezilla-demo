import React from 'react'

const LandingFooter: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-ksmt-slate/8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between">

        <div className="flex gap-6 font-montserrat text-[9px] tracking-widest uppercase text-ksmt-slate/70">
          <a href="#" className="hover:text-ksmt-slate transition-colors">Privacy</a>
          <a href="#" className="hover:text-ksmt-slate transition-colors">Terms</a>
          <a href="#" className="hover:text-ksmt-slate transition-colors">Contact</a>
        </div>

        <div className="font-montserrat text-[9px] tracking-widest uppercase text-ksmt-slate/60">
          © 2026 ksmt All Rights Reserved
        </div>

      </div>
    </footer>
  )
}

export default LandingFooter
