import AdminDashboard from '@/components/AdminDashboard'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata = {
  title: 'ksmt for Couples | The AI Powered Workspace for Modern Wedding Planning',
  description: 'Your wedding planning hub - manage vendors, track RSVPs, and plan your perfect day.',
}

export default function AdminPage() {
  return (
    <ThemeProvider storageKey="ksmt_admin_theme">
      <AdminDashboard />
    </ThemeProvider>
  )
}
