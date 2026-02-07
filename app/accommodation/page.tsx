import Navigation from '@/components/Navigation'
import Accommodation from '@/components/Accommodation'
import Footer from '@/components/Footer'
import AnimatedHearts from '@/components/AnimatedHearts'

export default function AccommodationPage() {
  return (
    <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
      <AnimatedHearts />
      <Navigation />
      <div className="pt-20 pb-8 relative z-10 min-h-screen">
        <Accommodation />
      </div>
      <Footer />
    </main>
  )
}
