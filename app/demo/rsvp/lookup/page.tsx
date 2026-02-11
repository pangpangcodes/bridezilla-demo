import Navigation from '@/components/Navigation'
import RSVPLookup from '@/components/RSVPLookup'
import Footer from '@/components/Footer'
import AnimatedHearts from '@/components/AnimatedHearts'

export default function RSVPLookupPage() {
  return (
    <main className="bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative min-h-screen flex flex-col">
      <AnimatedHearts />
      <Navigation />
      <div className="pt-20 pb-8 relative z-10 flex-grow">
        <RSVPLookup />
      </div>
      <Footer />
    </main>
  )
}
