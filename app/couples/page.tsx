import AdminDashboard from '@/components/AdminDashboard'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function AdminPage() {
  return (
    <ThemeProvider storageKey="bridezilla_admin_theme">
      <AdminDashboard />
    </ThemeProvider>
  )
}
