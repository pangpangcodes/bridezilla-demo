'use client'

import { useState, useEffect, Fragment } from 'react'
import { Users, CheckCircle, XCircle, Download, Eye, EyeOff, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDate, maskEmail, maskPhone, exportToCSV } from '@/lib/format'
import { supabase } from '@/lib/supabase'

interface Guest {
  name: string
  order: number
}

interface RSVP {
  id: string
  name: string
  email: string
  phone: string
  attending: boolean
  created_at: string
  guests: Guest[]
}

interface Stats {
  total: number
  attending: number
  notAttending: number
  totalGuests: number
}

export default function RSVPTab() {
  const [loading, setLoading] = useState(true)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all')
  const [showContactInfo, setShowContactInfo] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [expandedRsvp, setExpandedRsvp] = useState<string | null>(null)

  useEffect(() => {
    fetchRSVPs('all')
  }, [])

  const fetchRSVPs = async (attendingFilter: 'all' | 'true' | 'false') => {
    setLoading(true)
    try {
      const { data: allRsvps } = await supabase.from('rsvps').select('*')

      // Filter based on attending status
      let filteredRsvps = allRsvps || []
      if (attendingFilter === 'true') {
        filteredRsvps = filteredRsvps.filter(r => r.attending)
      } else if (attendingFilter === 'false') {
        filteredRsvps = filteredRsvps.filter(r => !r.attending)
      }

      // Calculate stats
      const stats = {
        total: allRsvps?.length || 0,
        attending: allRsvps?.filter(r => r.attending).length || 0,
        notAttending: allRsvps?.filter(r => !r.attending).length || 0,
        totalGuests: allRsvps?.reduce((sum, r) => sum + (r.number_of_guests || 1), 0) || 0
      }

      // Format RSVPs to match expected structure
      const formattedRsvps = filteredRsvps.map(rsvp => ({
        ...rsvp,
        guests: rsvp.guests || [] // Use actual guest data from mock
      }))

      setRsvps(formattedRsvps)
      setStats(stats)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilter: 'all' | 'true' | 'false') => {
    setFilter(newFilter)
    fetchRSVPs(newFilter)
  }

  const handleExportCSV = async () => {
    try {
      // Use the exportToCSV function from lib/format
      const csvContent = exportToCSV(rsvps)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `rsvps-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-3 md:p-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-50" />
                  <div className="flex-1">
                    <div className="h-3 md:h-4 rounded w-16 md:w-20 mb-1 md:mb-2 bg-gray-50" />
                    <div className="h-5 md:h-7 rounded w-8 md:w-12 bg-gray-50" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : stats && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border-2 border-bridezilla-pink/20 hover:border-bridezilla-pink transition-colors">
              <div className="flex items-center gap-2 md:gap-3">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-bridezilla-pink flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total RSVPs</p>
                  <p className="font-heading text-2xl md:text-3xl text-bridezilla-pink">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border-2 border-bridezilla-orange/20 hover:border-bridezilla-orange transition-colors">
              <div className="flex items-center gap-2 md:gap-3">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-bridezilla-orange flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Attending</p>
                  <p className="font-heading text-2xl md:text-3xl text-bridezilla-orange">{stats.attending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border-2 border-gray-200 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-2 md:gap-3">
                <XCircle className="w-6 h-6 md:w-8 md:h-8 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Not Attending</p>
                  <p className="font-heading text-2xl md:text-3xl text-gray-500">{stats.notAttending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border-2 border-bridezilla-orange/20 hover:border-bridezilla-orange transition-colors">
              <div className="flex items-center gap-2 md:gap-3">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-bridezilla-orange flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Guests</p>
                  <p className="font-heading text-2xl md:text-3xl text-bridezilla-orange">{stats.totalGuests}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-bridezilla-pink text-white hover:scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('true')}
              className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                filter === 'true'
                  ? 'bg-bridezilla-pink text-white hover:scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => handleFilterChange('false')}
              className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                filter === 'false'
                  ? 'bg-bridezilla-pink text-white hover:scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Not Attending
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm md:text-base font-semibold hover:bg-gray-200 hover:scale-105 transition-all"
            >
              {showContactInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showContactInfo ? 'Hide' : 'Show'} Contact Info</span>
              <span className="sm:hidden">{showContactInfo ? 'Hide' : 'Show'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-bridezilla-pink text-white rounded-full text-sm md:text-base font-semibold hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* RSVPs Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bridezilla-pink border-b border-bridezilla-pink">
              <tr>
                {/* Expand icon - only on mobile */}
                <th className="md:hidden px-4 py-3 text-left text-xs font-semibold text-white uppercase w-12"></th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-white uppercase">Name</th>
                {/* Desktop columns */}
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-white uppercase">Email</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-white uppercase">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-white uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-white uppercase">Plus Ones</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-white uppercase">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : rsvps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No RSVPs found
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp) => (
                  <Fragment key={rsvp.id}>
                    <tr className="hover:bg-bridezilla-light-pink transition-colors md:cursor-default cursor-pointer">
                      {/* Expand icon - only on mobile */}
                      <td
                        className="md:hidden px-4 py-4 text-sm text-gray-500"
                        onClick={() => setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                      >
                        {expandedRsvp === rsvp.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </td>

                      <td
                        className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900 md:cursor-default cursor-pointer"
                        onClick={() => window.innerWidth < 768 && setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                      >
                        {rsvp.name}
                      </td>

                      {/* Desktop Email column */}
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                        {showContactInfo ? (
                          <div className="flex items-center gap-2 group">
                            <span>{rsvp.email}</span>
                            <button
                              onClick={() => handleCopyEmail(rsvp.email)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                              title="Copy email"
                            >
                              {copiedEmail === rsvp.email ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        ) : (
                          maskEmail(rsvp.email)
                        )}
                      </td>

                      {/* Desktop Phone column */}
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                        {showContactInfo ? rsvp.phone : maskPhone(rsvp.phone)}
                      </td>

                      <td
                        className="px-4 md:px-6 py-4 md:cursor-default cursor-pointer"
                        onClick={() => window.innerWidth < 768 && setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                      >
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvp.attending
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rsvp.attending ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Attending
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Not Attending
                            </>
                          )}
                        </span>
                      </td>

                      <td
                        className="px-4 md:px-6 py-4 text-sm text-gray-600 md:cursor-default cursor-pointer"
                        onClick={() => window.innerWidth < 768 && setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                      >
                        {rsvp.guests.length > 0 ? (
                          <>
                            {/* Mobile: just number */}
                            <span className="md:hidden font-medium text-bridezilla-pink">{rsvp.guests.length}</span>
                            {/* Desktop: full list */}
                            <ul className="hidden md:block space-y-1">
                              {rsvp.guests.map((guest, idx) => (
                                <li key={idx}>{guest.name}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>

                      {/* Desktop Submitted column */}
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                        {formatDate(rsvp.created_at)}
                      </td>
                    </tr>

                    {/* Expanded Details Row - only visible on mobile */}
                    {expandedRsvp === rsvp.id && (
                      <tr key={`${rsvp.id}-expanded`} className="md:hidden">
                        <td colSpan={4} className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                              {showContactInfo ? (
                                <div className="flex items-center gap-2 group">
                                  <span className="text-sm text-gray-900">{rsvp.email}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCopyEmail(rsvp.email)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                    title="Copy email"
                                  >
                                    {copiedEmail === rsvp.email ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-900">{maskEmail(rsvp.email)}</span>
                              )}
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                              <span className="text-sm text-gray-900">
                                {showContactInfo ? rsvp.phone : maskPhone(rsvp.phone)}
                              </span>
                            </div>

                            {rsvp.guests.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Guest Names</p>
                                <ul className="space-y-1">
                                  {rsvp.guests.map((guest, idx) => (
                                    <li key={idx} className="text-sm text-gray-900">• {guest.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Submitted</p>
                              <span className="text-sm text-gray-900">{formatDate(rsvp.created_at)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
