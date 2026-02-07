import Navigation from '@/components/Navigation'
import Itinerary from '@/components/Itinerary'
import Footer from '@/components/Footer'
import AnimatedHearts from '@/components/AnimatedHearts'

export default function ItineraryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative">
      <AnimatedHearts />
      <Navigation />
      <div className="pt-16 md:pt-20 relative z-10">
        <Itinerary />
      </div>
      <Footer />
    </main>
  )
}
