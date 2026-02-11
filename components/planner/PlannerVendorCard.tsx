'use client'

import { useState } from 'react'
import { Globe, Instagram, Mail, Phone, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import type { SharedVendor, VendorStatus } from '@/types/planner'
import type { ThemeColors } from '@/lib/themes'

interface PlannerVendorCardProps {
  vendor: SharedVendor
  theme: ThemeColors
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  null: { label: 'Not Reviewed', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  interested: { label: 'Shortlisted', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  contacted: { label: 'Contacted', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  quoted: { label: 'Quoted', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  booked: { label: 'Booked', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pass: { label: 'Declined', color: 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-70' },
}

// Category image mapping (placeholder images)
const CATEGORY_IMAGES: Record<string, string> = {
  'Florist': 'https://images.unsplash.com/photo-1596073419667-9d77d59f033f?auto=format&fit=crop&q=80&w=800',
  'Venue': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  'Catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
  'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
  'Entertainment': 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
  'Hair & Makeup': 'https://images.unsplash.com/photo-1487412947132-26c5c1cd8d0f?auto=format&fit=crop&q=80&w=800',
  'Photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  'Stationery': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800',
  'Videography': 'https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?auto=format&fit=crop&q=80&w=800',
  'default': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
}

export default function PlannerVendorCard({ vendor, theme }: PlannerVendorCardProps) {
  const [showPricing, setShowPricing] = useState(false)

  const getStatusBadge = (status: VendorStatus | undefined) => {
    const badge = STATUS_BADGES[status || 'null']
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.color} shadow-sm`}>
        {badge.label}
      </span>
    )
  }

  const formatCurrency = (amount: number | null | undefined, currency: 'EUR' | 'USD') => {
    if (!amount) return null
    const symbol = currency === 'EUR' ? '€' : '$'
    return `${symbol}${amount.toLocaleString()}`
  }

  const plannerNote = vendor.custom_note || vendor.planner_note
  const displayImage = CATEGORY_IMAGES[vendor.vendor_type] || CATEGORY_IMAGES['default']
  const isBooked = vendor.couple_status === 'booked'
  const isDeclined = vendor.couple_status === 'pass'

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-stone-300 flex flex-col h-full ${
        isBooked ? 'ring-2 ring-emerald-500/20' : ''
      } ${isDeclined ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Square Image */}
      <div className="w-full aspect-square relative shrink-0 overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={vendor.vendor_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3 shadow-sm z-10">
          {getStatusBadge(vendor.couple_status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {vendor.vendor_type}
            </span>
          </div>
          <h3 className="font-serif text-xl text-stone-900 leading-tight mb-1">
            {vendor.vendor_name}
          </h3>
          {vendor.contact_name && (
            <p className="text-sm text-gray-600">{vendor.contact_name}</p>
          )}
        </div>

        {/* Price */}
        {(vendor.estimated_cost_eur || vendor.estimated_cost_usd) && (
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              {vendor.estimated_cost_eur && (
                <span className="font-serif text-lg text-stone-800 font-medium">
                  {formatCurrency(vendor.estimated_cost_eur, 'EUR')}
                </span>
              )}
              {vendor.estimated_cost_eur && vendor.estimated_cost_usd && (
                <span className="text-gray-400">/</span>
              )}
              {vendor.estimated_cost_usd && (
                <span className="font-serif text-lg text-stone-800 font-medium">
                  {formatCurrency(vendor.estimated_cost_usd, 'USD')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Estimated</p>
          </div>
        )}

        {/* Links Area */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {vendor.website && (
            <a
              href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-stone-900 border border-gray-100 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <Globe size={12} /> Website
            </a>
          )}
          {vendor.instagram && (
            <a
              href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-stone-900 border border-gray-100 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <Instagram size={12} /> Insta
            </a>
          )}
          {vendor.email && (
            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-stone-900 border border-gray-100 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <Mail size={12} /> Email
            </a>
          )}
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone}`}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-stone-900 border border-gray-100 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <Phone size={12} /> Call
            </a>
          )}
        </div>

        {/* Planner Note */}
        {plannerNote && (
          <div className="p-3 mb-4 rounded-lg border text-xs leading-relaxed bg-gray-50 border-gray-200">
            <div className="flex gap-2 items-center mb-1 font-bold uppercase tracking-widest text-[10px] text-gray-500">
              <Sparkles size={12} /> Your Note
            </div>
            <p className="italic text-gray-700">"{plannerNote}"</p>
          </div>
        )}

        {/* Couple's Feedback */}
        {vendor.couple_note && (
          <div className="p-3 mb-4 rounded-lg border text-xs leading-relaxed bg-blue-50 border-blue-200">
            <div className="flex gap-2 items-center mb-1 font-bold uppercase tracking-widest text-[10px] text-blue-600">
              <Sparkles size={12} /> Couple's Feedback
            </div>
            <p className="italic text-blue-900">"{vendor.couple_note}"</p>
          </div>
        )}

        {/* Expandable Pricing Details */}
        <div className="mb-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="flex items-center justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-stone-900 transition-colors"
          >
            <span>Pricing & Packages</span>
            {showPricing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showPricing && (
            <div className="mt-3 text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                {vendor.email && (
                  <div><span className="font-semibold">Email:</span> {vendor.email}</div>
                )}
                {vendor.phone && (
                  <div><span className="font-semibold">Phone:</span> {vendor.phone}</div>
                )}
                {vendor.website && (
                  <div><span className="font-semibold">Website:</span> <a href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{vendor.website}</a></div>
                )}
                {!vendor.email && !vendor.phone && !vendor.website && (
                  <div className="text-gray-500 italic">Contact details not available</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vendor Library ID */}
        {vendor.vendor_library_id && (
          <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span className="font-semibold">Library ID:</span> #{vendor.vendor_library_id}
          </div>
        )}
      </div>
    </div>
  )
}
