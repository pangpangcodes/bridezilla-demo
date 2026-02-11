import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingHero from '@/components/landing/LandingHero'
import LandingFooter from '@/components/landing/LandingFooter'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#8D99AE] selection:text-white" style={{ background: '#FAF9F6' }}>
      <LandingNavbar />
      <main className="flex-grow flex flex-col justify-center">
        <LandingHero />
      </main>
      <LandingFooter />
    </div>
  )
}
