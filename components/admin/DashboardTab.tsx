'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, AlertCircle, Calendar, BarChart3 } from 'lucide-react'
import { formatCurrency, calculateVendorStats } from '@/lib/vendorUtils'
import { supabase } from '@/lib/supabase'

interface DashboardData {
  rsvpStats: {
    total: number
    attending: number
    notAttending: number
    totalGuests: number
  }
  vendorStats: {
    totalVendors: number
    totalCost: number
    totalPaid: number
    totalOutstanding: number
  }
  paymentReminders: Array<{
    vendor_name: string
    vendor_type: string
    payment_description: string
    amount: number
    currency: string
    due_date: string
    reminder_type: 'overdue' | 'due_today' | '7_days'
    days_until_due: number
  }>
}

export default function DashboardTab() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [showActionBanner, setShowActionBanner] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch data directly from demo supabase
      const { data: rsvps } = await supabase.from('rsvps').select('*')
      const { data: vendors } = await supabase.from('vendors').select('*')

      // Calculate RSVP stats
      const rsvpStats = {
        total: rsvps?.length || 0,
        attending: rsvps?.filter(r => r.attending).length || 0,
        notAttending: rsvps?.filter(r => !r.attending).length || 0,
        totalGuests: rsvps?.reduce((sum, r) => sum + (r.number_of_guests || 1), 0) || 0
      }

      // Calculate vendor stats
      const vendorStats = calculateVendorStats(vendors || [])

      // Calculate payment reminders (upcoming payments)
      const paymentReminders: any[] = []
      vendors?.forEach(vendor => {
        vendor.payments?.forEach((payment: any) => {
          if (!payment.paid && payment.due_date) {
            // Parse date components explicitly to avoid timezone conversion
            const [year, month, day] = payment.due_date.split('-')
            const dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            dueDate.setHours(0, 0, 0, 0) // Normalize to midnight
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Normalize to midnight
            const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            let reminderType: 'overdue' | 'due_today' | '7_days' = '7_days'
            if (daysUntilDue < 0) reminderType = 'overdue'
            else if (daysUntilDue === 0) reminderType = 'due_today'

            // Only show payments due in the next 7 days (exclude overdue)
            if (daysUntilDue >= 0 && daysUntilDue <= 7) {
              paymentReminders.push({
                vendor_name: vendor.vendor_name,
                vendor_type: vendor.vendor_type,
                payment_description: payment.description,
                amount: payment.amount,
                currency: payment.amount_currency,
                due_date: payment.due_date,
                reminder_type: reminderType,
                days_until_due: daysUntilDue
              })
            }
          }
        })
      })

      setData({
        rsvpStats,
        vendorStats,
        paymentReminders: paymentReminders.sort((a, b) => a.days_until_due - b.days_until_due)
      })
    } catch (err) {
      setError('Unable to load dashboard. Please refresh.')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-900">{error || 'Failed to load dashboard'}</p>
      </div>
    )
  }

  // Calculate metrics
  const budgetSpentPercent = data.vendorStats.totalCost > 0
    ? Math.round((data.vendorStats.totalPaid / data.vendorStats.totalCost) * 100)
    : 0

  // Payment alerts
  const overduePayments = data.paymentReminders.filter(r => r.reminder_type === 'overdue')
  const dueTodayPayments = data.paymentReminders.filter(r => r.reminder_type === 'due_today')
  const upcomingPayments = data.paymentReminders.filter(r =>
    r.reminder_type === '7_days' || (r.days_until_due > 0 && r.days_until_due <= 7)
  )

  // Action items
  const actionItems = []
  if (overduePayments.length > 0) {
    actionItems.push({
      severity: 'error',
      message: `${overduePayments.length} overdue payment${overduePayments.length > 1 ? 's' : ''}`
    })
  }
  if (dueTodayPayments.length > 0) {
    actionItems.push({
      severity: 'warning',
      message: `${dueTodayPayments.length} payment${dueTodayPayments.length > 1 ? 's' : ''} due today`
    })
  }

  return (
    <>
      {/* Upcoming Payments Timeline */}
      {data.paymentReminders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border-2 border-bridezilla-pink/20 hover:border-bridezilla-pink transition-colors">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-bridezilla-pink flex-shrink-0" />
            <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide text-gray-900">
              Upcoming Payments
            </h3>
          </div>

          <div className="space-y-2 md:space-y-3">
            {data.paymentReminders.slice(0, 5).map((reminder, i) => {
              const bgColor =
                reminder.reminder_type === 'overdue' ? 'bg-red-50 border-red-200' :
                reminder.reminder_type === 'due_today' ? 'bg-orange-50 border-orange-200' :
                'bg-yellow-50 border-yellow-200'

              const textColor =
                reminder.reminder_type === 'overdue' ? 'text-red-900' :
                reminder.reminder_type === 'due_today' ? 'text-orange-900' :
                'text-yellow-900'

              const badgeColor =
                reminder.reminder_type === 'overdue' ? 'bg-red-100 text-red-700' :
                reminder.reminder_type === 'due_today' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'

              const statusText =
                reminder.reminder_type === 'overdue' ? `OVERDUE ${Math.abs(reminder.days_until_due)}d` :
                reminder.reminder_type === 'due_today' ? 'DUE TODAY' :
                `Due in ${reminder.days_until_due}d`

              return (
                <div key={i} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 rounded-lg border ${bgColor}`}>
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor}`}>
                        {(() => {
                          const [year, month, day] = reminder.due_date.split('-')
                          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        })()}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${textColor} truncate`}>
                        {reminder.vendor_name || reminder.vendor_type}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {reminder.payment_description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0 pl-10 sm:pl-0">
                    <span className={`text-sm font-semibold ${textColor}`}>
                      {formatCurrency(reminder.amount, reminder.currency)} {reminder.currency}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor}`}>
                      {statusText}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {data.paymentReminders.length > 5 && (
            <a
              href="/admin?view=vendors"
              className="mt-4 inline-flex items-center text-sm font-semibold text-bridezilla-pink hover:text-bridezilla-pink/80 transition-colors"
            >
              View All Payments →
            </a>
          )}
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* RSVP Summary Card */}
        <a
          href="/admin?view=rsvp"
          className="bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col border-2 border-bridezilla-pink/20 hover:border-bridezilla-pink"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide text-gray-900">RSVP Summary</h3>
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-bridezilla-pink flex-shrink-0" />
          </div>

          <div className="space-y-3 md:space-y-4 flex-1">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-4xl md:text-5xl text-bridezilla-pink">
                  {data.rsvpStats.total}
                </span>
                <span className="text-sm text-gray-600">Responses</span>
              </div>
              <p className="text-xs text-gray-500">
                {data.rsvpStats.attending} attending • {data.rsvpStats.notAttending} not attending
              </p>
            </div>

            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <span className="font-heading text-2xl md:text-3xl text-bridezilla-pink">
                {data.rsvpStats.totalGuests}
              </span>
              <span className="text-sm text-gray-600 ml-2">Guests</span>
              <p className="text-xs text-gray-500 mt-1">Total attending</p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 inline-flex items-center text-sm font-semibold text-bridezilla-pink group-hover:text-bridezilla-pink/80 transition-colors">
            View Full RSVP Tracking →
          </div>
        </a>

        {/* Vendor Summary Card */}
        <a
          href="/admin?view=vendors"
          className="bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col border-2 border-bridezilla-pink/20 hover:border-bridezilla-pink"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide text-gray-900">Vendor Summary</h3>
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-bridezilla-pink flex-shrink-0" />
          </div>

          <div className="space-y-3 md:space-y-4 flex-1">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-4xl md:text-5xl text-bridezilla-pink">
                  {budgetSpentPercent}%
                </span>
                <span className="text-sm text-gray-600">Budget Spent</span>
              </div>
              <p className="text-xs text-gray-500">
                {formatCurrency(data.vendorStats.totalPaid)} / {formatCurrency(data.vendorStats.totalCost)} USD
              </p>
            </div>

            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <span className="font-heading text-2xl md:text-3xl text-bridezilla-pink">
                {formatCurrency(data.vendorStats.totalOutstanding)}
              </span>
              <span className="text-sm text-gray-600 ml-2">USD</span>
              <p className="text-xs text-gray-500 mt-1">Outstanding</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm">
                <span className="text-gray-600">Payments: </span>
                <span className="font-medium text-gray-900">
                  {overduePayments.length} overdue, {upcomingPayments.length} upcoming
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center text-sm font-semibold text-bridezilla-pink group-hover:text-bridezilla-pink/80 transition-colors">
            View Vendor Management →
          </div>
        </a>
      </div>
    </>
  )
}
