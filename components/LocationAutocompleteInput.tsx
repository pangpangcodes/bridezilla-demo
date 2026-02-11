'use client'

import { MapPin, ExternalLink } from 'lucide-react'

interface LocationAutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
  name?: string
}

export default function LocationAutocompleteInput({
  value,
  onChange,
  placeholder = 'e.g., Marbella, Spain',
  className = '',
  required = false,
  id = 'location',
  name = 'location'
}: LocationAutocompleteInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleViewOnMaps = () => {
    if (value) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <MapPin className="w-4 h-4 text-stone-400" />
      </div>
      <input
        type="text"
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={handleInputChange}
        className={`w-full pl-11 pr-11 py-3 border border-stone-200 rounded-xl text-sm focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all ${className}`}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={handleViewOnMaps}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
          title="View on Google Maps"
          aria-label="View on Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
