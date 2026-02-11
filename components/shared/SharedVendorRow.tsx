'use client'

import { useState, Fragment } from 'react'
import { ChevronDown, ChevronRight, Mail, Phone, Globe, Instagram } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import type { SharedVendor, VendorStatus } from '@/types/planner'

interface SharedVendorRowProps {
  vendor: SharedVendor
  coupleId: string
  onStatusChange: (vendorId: string, status: VendorStatus | null) => void
  onNoteChange: (vendorId: string, note: string) => void
}

const STATUS_OPTIONS: { value: VendorStatus | null; label: string; color: string }[] = [
  { value: null, label: 'Not Reviewed', color: 'bg-stone-100 text-stone-600' },
  { value: 'interested', label: 'Approved', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'pass', label: 'Declined', color: 'bg-gray-100 text-gray-600' },
]

export default function SharedVendorRow({
  vendor,
  coupleId,
  onStatusChange,
  onNoteChange
}: SharedVendorRowProps) {
  const theme = useThemeStyles()
  const [expanded, setExpanded] = useState(false)
  const [localNote, setLocalNote] = useState(vendor.couple_note || '')

  const currentStatus = STATUS_OPTIONS.find(s => s.value === vendor.couple_status) || STATUS_OPTIONS[0]

  const handleNoteBlur = () => {
    if (localNote !== (vendor.couple_note || '')) {
      onNoteChange(vendor.id, localNote)
    }
  }

  return (
    <Fragment>
      {/* Main Row */}
      <tr
        className="hover:bg-stone-50 cursor-pointer transition-all duration-150 group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Expand Icon */}
        <td className={`px-2 py-4 ${theme.textMuted}`}>
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </td>

        {/* Vendor Name */}
        <td className="px-4 py-4">
          <div className={`text-sm font-medium ${theme.textPrimary}`}>
            {vendor.vendor_name}
          </div>
        </td>

        {/* Contact */}
        <td className={`px-4 py-4 text-sm ${theme.textSecondary}`}>
          {vendor.contact_name || <span className={`${theme.textMuted} italic`}>-</span>}
        </td>

        {/* Status Badge */}
        <td className="px-4 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr>
          <td colSpan={4} className="px-4 py-4 bg-stone-50 border-t border-stone-200">
            <div className="max-w-5xl space-y-6" onClick={(e) => e.stopPropagation()}>

              {/* Planner's Recommendation */}
              {vendor.planner_note && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    💝 Why your planner recommends this vendor:
                  </h4>
                  <p className="text-sm text-blue-800">{vendor.planner_note}</p>
                </div>
              )}

              {/* Contact & Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Contact Information */}
                <div>
                  <h4 className={`text-sm font-semibold ${theme.textPrimary} mb-3`}>
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {vendor.email}
                      </a>
                    )}
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {vendor.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Portfolio Links */}
                <div>
                  <h4 className={`text-sm font-semibold ${theme.textPrimary} mb-3`}>
                    Portfolio
                  </h4>
                  <div className="flex gap-2">
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 ${theme.primaryButton} ${theme.textOnPrimary} rounded-lg text-sm font-medium ${theme.primaryButtonHover}`}
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {vendor.instagram && (
                      <a
                        href={`https://www.instagram.com/${vendor.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 ${theme.primaryButton} ${theme.textOnPrimary} rounded-lg text-sm font-medium ${theme.primaryButtonHover}`}
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {(vendor.estimated_cost_eur || vendor.estimated_cost_usd) && (
                <div>
                  <h4 className={`text-sm font-semibold ${theme.textPrimary} mb-3`}>
                    Estimated Pricing
                  </h4>
                  <div className="flex gap-4">
                    {vendor.estimated_cost_eur && (
                      <div className={`text-sm ${theme.textSecondary}`}>
                        €{vendor.estimated_cost_eur.toLocaleString()}
                      </div>
                    )}
                    {vendor.estimated_cost_usd && (
                      <div className={`text-sm ${theme.textSecondary}`}>
                        ${vendor.estimated_cost_usd.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Couple's Status & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">

                {/* Status Selection */}
                <div>
                  <label className={`block text-sm font-semibold ${theme.textPrimary} mb-2`}>
                    Your Status
                  </label>
                  <select
                    value={vendor.couple_status || ''}
                    onChange={(e) => onStatusChange(vendor.id, (e.target.value || null) as VendorStatus | null)}
                    className={`w-full px-3 py-2 border border-stone-200 rounded-lg text-sm ${theme.textPrimary} bg-white focus:ring-1 focus:ring-stone-900 focus:border-stone-900`}
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.label} value={option.value || ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-semibold ${theme.textPrimary} mb-2`}>
                    Your Notes
                  </label>
                  <textarea
                    value={localNote}
                    onChange={(e) => setLocalNote(e.target.value)}
                    onBlur={handleNoteBlur}
                    placeholder="Add your thoughts about this vendor..."
                    rows={3}
                    className={`w-full px-3 py-2 border border-stone-200 rounded-lg text-sm ${theme.textPrimary} focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none`}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
