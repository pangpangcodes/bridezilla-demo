import Navigation from '@/components/Navigation'
import AdminDashboard from '@/components/AdminDashboard'
import Footer from '@/components/Footer'
import AnimatedHearts from '@/components/AnimatedHearts'

export default function AdminPage() {
  return (
    <main className="bg-bridezilla-blue relative">
      <AnimatedHearts />
      <Navigation />
      <div className="pt-16 pb-8 relative z-10 min-h-screen">
        <AdminDashboard />
      </div>
      <Footer />
    </main>
  )
}
