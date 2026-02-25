'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import { StatCard, StatCardSkeleton } from '@/components/ui/StatCard'
import type { PlannerCouple } from '@/types/planner'

interface PlannerDashboardPageProps {
  onNavigate: (view: 'dashboard' | 'couples' | 'vendors' | 'settings') => void
}

interface DashboardStats {
  totalCouples: number
  upcomingCount: number
  vendorLibraryCount: number
  needsAttentionCount: number
  upcomingCouples: UpcomingCouple[]
  attentionCouples: AttentionCouple[]
}

interface UpcomingCouple {
  id: string
  coupleNames: string
  weddingDate: string
  location: string | null
  daysUntil: number
  shareLinkId: string
}

interface AttentionCouple {
  id: string
  coupleNames: string
  weddingDate: string | null
  daysSinceActivity: number
  shareLinkId: string
}

function parseDateParts(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatWeddingDate(dateStr: string): string {
  const date = parseDateParts(dateStr)
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PlannerDashboardPage({ onNavigate }: PlannerDashboardPageProps) {
  const theme = useThemeStyles()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = sessionStorage.getItem('planner_auth') || 'planner'
      const headers = { 'Authorization': `Bearer ${token}` }

      const [couplesRes, vendorsRes] = await Promise.all([
        fetch('/api/planners/couples', { headers }).then(r => r.json()),
        fetch('/api/planners/vendor-library', { headers }).then(r => r.json()),
      ])

      const couples: PlannerCouple[] = couplesRes.success ? couplesRes.data : []
      const vendors = vendorsRes.success ? vendorsRes.data : []

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const in30Days = new Date(today)
      in30Days.setDate(today.getDate() + 30)

      // Upcoming weddings in next 30 days
      const upcomingCouples: UpcomingCouple[] = couples
        .filter(c => {
          if (!c.wedding_date) return false
          const wDate = parseDateParts(c.wedding_date)
          return wDate >= today && wDate <= in30Days
        })
        .map(c => {
          const wDate = parseDateParts(c.wedding_date!)
          const daysUntil = Math.round((wDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return {
            id: c.id,
            coupleNames: c.couple_names,
            weddingDate: c.wedding_date!,
            location: c.wedding_location || c.venue_name || null,
            daysUntil,
            shareLinkId: c.share_link_id,
          }
        })
        .sort((a, b) => a.daysUntil - b.daysUntil)

      // Needs attention: last_activity > 14 days ago
      const attentionCouples: AttentionCouple[] = couples
        .filter(c => {
          const lastActivity = new Date(c.last_activity)
          const daysSince = Math.round((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
          return daysSince > 14
        })
        .map(c => {
          const lastActivity = new Date(c.last_activity)
          const daysSince = Math.round((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
          return {
            id: c.id,
            coupleNames: c.couple_names,
            weddingDate: c.wedding_date || null,
            daysSinceActivity: daysSince,
            shareLinkId: c.share_link_id,
          }
        })
        .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity)

      setStats({
        totalCouples: couples.length,
        upcomingCount: upcomingCouples.length,
        vendorLibraryCount: vendors.length,
        needsAttentionCount: attentionCouples.length,
        upcomingCouples: upcomingCouples.slice(0, 5),
        attentionCouples: attentionCouples.slice(0, 5),
      })
    } catch (err) {
      setError('Unable to load dashboard. Please refresh.')
      console.error('Planner dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {[0, 1, 2, 3].map(i => (
            <StatCardSkeleton key={i} theme={theme} />
          ))}
        </div>
        <div className={`${theme.cardBackground} rounded-2xl border ${theme.border} p-8`}>
          <div className={`text-center ${theme.textMuted} text-sm`}>Loading dashboard...</div>
        </div>
      </>
    )
  }

  if (error || !stats) {
    return (
      <div className={`${theme.error.bg} border ${theme.border} rounded-2xl p-8`}>
        <div className="flex items-start gap-4">
          <AlertCircle className={`${theme.error.text} flex-shrink-0`} size={24} />
          <div>
            <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-1`}>Unable to Load</h3>
            <p className={`text-sm ${theme.error.text}`}>{error || 'Failed to load dashboard'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state - no couples at all
  if (stats.totalCouples === 0) {
    return (
      <div className={`${theme.cardBackground} rounded-2xl border ${theme.border} p-12 text-center`}>
        <Users className={`mx-auto mb-4 ${theme.textMuted}`} size={40} />
        <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>No Couples Yet</h3>
        <p className={`${theme.textMuted} text-sm mb-6`}>Add your first couple to get started.</p>
        <button
          onClick={() => onNavigate('couples')}
          className="inline-flex items-center text-sm font-semibold transition-colors"
          style={{ color: theme.primaryColor }}
        >
          Go to Couples -&gt;
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard
          icon={<Users className={`w-4 h-4 ${theme.textSecondary}`} />}
          label="Total Couples"
          value={stats.totalCouples}
          theme={theme}
        />
        <StatCard
          icon={<Calendar className={`w-4 h-4 ${theme.success.text}`} />}
          iconBg={theme.success.bg}
          label="Upcoming (30 days)"
          value={stats.upcomingCount}
          theme={theme}
        />
        <StatCard
          icon={<BookOpen className={`w-4 h-4 ${theme.textSecondary}`} />}
          label="Vendor Library"
          value={stats.vendorLibraryCount}
          theme={theme}
        />
        <StatCard
          icon={<AlertCircle className={`w-4 h-4 ${theme.warning.text}`} />}
          iconBg={theme.warning.bg}
          label="Needs Attention"
          value={stats.needsAttentionCount}
          theme={theme}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upcoming Weddings */}
        <div className={`${theme.cardBackground} rounded-2xl shadow-md p-4 md:p-6 border ${theme.border} transition-colors`}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
            <h3 className={`${theme.typeSectionHeading} ${theme.textPrimary}`}>
              Upcoming Weddings
            </h3>
          </div>

          {stats.upcomingCouples.length === 0 ? (
            <div className={`text-center py-6 ${theme.textMuted} text-sm`}>
              No upcoming weddings in the next 30 days.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingCouples.map(couple => {
                const badgeBg = couple.daysUntil > 30
                  ? theme.success.bg
                  : couple.daysUntil >= 8
                  ? theme.warning.bg
                  : theme.error.bg
                const badgeText = couple.daysUntil > 30
                  ? theme.success.text
                  : couple.daysUntil >= 8
                  ? theme.warning.text
                  : theme.error.text

                return (
                  <a
                    key={couple.id}
                    href={`/planners/couples/${couple.shareLinkId}`}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${theme.border} hover:shadow-sm transition-all group`}
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${theme.textPrimary} group-hover:underline truncate`}>
                        {couple.coupleNames}
                      </p>
                      <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                        {formatWeddingDate(couple.weddingDate)}
                        {couple.location && ` - ${couple.location}`}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${badgeBg} ${badgeText}`}>
                      {couple.daysUntil === 0 ? 'Today!' : `${couple.daysUntil}d`}
                    </span>
                  </a>
                )
              })}
            </div>
          )}

        </div>

        {/* Needs Attention */}
        <div className={`${theme.cardBackground} rounded-2xl shadow-md p-4 md:p-6 border ${theme.border} transition-colors`}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
            <h3 className={`${theme.typeSectionHeading} ${theme.textPrimary}`}>
              Needs Attention
            </h3>
          </div>

          {stats.attentionCouples.length === 0 ? (
            <div className={`flex items-center justify-center gap-2 py-6 text-sm ${theme.success.text}`}>
              <CheckCircle size={16} />
              All couples are up to date!
            </div>
          ) : (
            <div className="space-y-3">
              {stats.attentionCouples.map(couple => (
                <a
                  key={couple.id}
                  href={`/planners/couples/${couple.shareLinkId}`}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${theme.border} hover:shadow-sm transition-all group`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${theme.textPrimary} group-hover:underline truncate`}>
                      {couple.coupleNames}
                    </p>
                    <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                      Last active {couple.daysSinceActivity} days ago
                      {couple.weddingDate && ` - Wedding: ${formatWeddingDate(couple.weddingDate)}`}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${theme.warning.bg} ${theme.warning.text}`}>
                    {couple.daysSinceActivity}d ago
                  </span>
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
