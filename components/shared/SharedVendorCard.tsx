'use client'

import { useState } from 'react'
import { Instagram, Globe, Mail, Phone, MessageSquare, Sparkles, MapPin } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import type { SharedVendor, VendorStatus } from '@/types/planner'

interface SharedVendorCardProps {
  vendor: SharedVendor
  coupleId: string
  onStatusChange: (vendorId: string, status: VendorStatus) => void
  onNoteChange: (vendorId: string, note: string) => void
}

const STATUS_OPTIONS: { value: VendorStatus; label: string }[] = [
  { value: null, label: 'Review Needed' },
  { value: 'interested', label: 'Approved' },
  { value: 'pass', label: 'Declined' },
]

export default function SharedVendorCard({ vendor, coupleId, onStatusChange, onNoteChange }: SharedVendorCardProps) {
  const theme = useThemeStyles()
  const [note, setNote] = useState(vendor.couple_note || '')
  const [isNoteOpen, setIsNoteOpen] = useState(false)

  const handleStatusChange = (newStatus: VendorStatus) => {
    onStatusChange(vendor.id, newStatus)
  }

  const handleNoteBlur = () => {
    if (note !== (vendor.couple_note || '')) {
      onNoteChange(vendor.id, note)
    }
  }

  const formatCurrency = (amount: number | null | undefined, currency: 'EUR' | 'USD') => {
    if (!amount) return null
    const symbol = currency === 'EUR' ? '€' : '$'
    return `${symbol}${amount.toLocaleString()}`
  }

  const getStatusDisplay = (status: VendorStatus | undefined) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status)
    return option?.label || 'Review Needed'
  }

  const getStatusColor = (status: VendorStatus | undefined) => {
    switch (status) {
      case null:
      case undefined:
        return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'interested':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pass':
        return 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-70'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const plannerNote = vendor.custom_note || vendor.planner_note

  return (
    <div
      className={`group ${theme.cardBackground} rounded-xl shadow-sm ${theme.border} ${theme.borderWidth} overflow-hidden transition-all duration-300 hover:shadow-lg ${
        vendor.couple_status === 'interested' ? 'ring-2 ring-emerald-500/20' : ''
      } ${vendor.couple_status === 'pass' ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      {/* Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className={`text-xs ${theme.textSecondary} font-bold tracking-widest uppercase mb-1`}>
              {vendor.vendor_type}
            </div>
            <h3 className={`font-serif text-2xl ${theme.textPrimary} leading-tight`}>
              {vendor.vendor_name}
            </h3>
            {vendor.contact_name && (
              <p className={`text-sm ${theme.textSecondary} mt-1`}>{vendor.contact_name}</p>
            )}
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${getStatusColor(
              vendor.couple_status
            )}`}
          >
            {getStatusDisplay(vendor.couple_status)}
          </span>
        </div>

        {/* Price Display */}
        {(vendor.estimated_cost_eur || vendor.estimated_cost_usd) && (
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              {vendor.estimated_cost_eur && (
                <span className={`font-serif text-xl ${theme.textPrimary}`}>
                  {formatCurrency(vendor.estimated_cost_eur, 'EUR')}
                </span>
              )}
              {vendor.estimated_cost_eur && vendor.estimated_cost_usd && (
                <span className={theme.textMuted}>/</span>
              )}
              {vendor.estimated_cost_usd && (
                <span className={`font-serif text-xl ${theme.textPrimary}`}>
                  {formatCurrency(vendor.estimated_cost_usd, 'USD')}
                </span>
              )}
            </div>
            <p className={`text-xs ${theme.textMuted}`}>Estimated</p>
          </div>
        )}

        {/* Planner's Insight - The Highlight */}
        {plannerNote && (
          <div
            className="border-l-4 p-4 mb-6 rounded-r-lg"
            style={{
              backgroundColor: `${theme.primaryColor}08`,
              borderColor: theme.primaryColor,
            }}
          >
            <div className="flex items-center gap-2 mb-2" style={{ color: theme.primaryColor }}>
              <Sparkles size={16} />
              <span className="text-sm font-semibold font-serif">Planner's Insight</span>
            </div>
            <p className={`text-sm ${theme.textSecondary} italic leading-relaxed`}>"{plannerNote}"</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`border-t ${theme.border} pt-4 space-y-4`}>
          <div className="flex gap-2">
            {vendor.website && (
              <a
                href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 ${theme.secondaryButton} ${theme.secondaryButtonHover} rounded-lg text-sm ${theme.textSecondary} transition-colors`}
              >
                <Globe size={16} /> Website
              </a>
            )}
            {vendor.instagram && (
              <a
                href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 ${theme.secondaryButton} ${theme.secondaryButtonHover} rounded-lg text-sm ${theme.textSecondary} transition-colors`}
              >
                <Instagram size={16} /> Insta
              </a>
            )}
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 ${theme.secondaryButton} ${theme.secondaryButtonHover} rounded-lg text-sm ${theme.textSecondary} transition-colors`}
              >
                <Mail size={16} /> Email
              </a>
            )}
          </div>

          {/* Status Selection */}
          <div className="relative">
            <label className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1 block`}>
              Your Decision
            </label>
            <div className="flex gap-1 bg-stone-50 p-1 rounded-lg">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value || 'null'}
                  onClick={() => handleStatusChange(opt.value)}
                  title={opt.label}
                  className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                    vendor.couple_status === opt.value
                      ? `${theme.cardBackground} shadow-sm ring-1 ring-black/5 ${theme.textPrimary}`
                      : `${theme.textMuted} hover:${theme.textSecondary} hover:bg-gray-100`
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <button
              onClick={() => setIsNoteOpen(!isNoteOpen)}
              className={`flex items-center gap-2 text-sm ${theme.textSecondary} transition-colors`}
              style={{ color: theme.primaryColor }}
            >
              <MessageSquare size={16} />
              {vendor.couple_note ? 'Edit your notes' : 'Add private note'}
            </button>

            {(isNoteOpen || vendor.couple_note) && (
              <div className={`mt-2 transition-all duration-300 ${isNoteOpen ? 'block' : vendor.couple_note ? 'block' : 'hidden'}`}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={handleNoteBlur}
                  placeholder="e.g., Contacted on Tuesday, waiting for pricing PDF..."
                  className={`w-full text-sm p-3 ${theme.border} rounded-lg bg-yellow-50/30 focus:${theme.cardBackground} focus:ring-2 outline-none resize-none transition-all`}
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
