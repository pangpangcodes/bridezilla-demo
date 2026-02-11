'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X, Search } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'

interface Option {
  value: string
  label: string
  count?: number
}

interface SearchableMultiSelectProps {
  options: Option[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  allLabel?: string
  className?: string
}

export default function SearchableMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  allLabel = 'All',
  className = ''
}: SearchableMultiSelectProps) {
  const theme = useThemeStyles()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const optionsListRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleOption = (value: string, e?: React.MouseEvent) => {
    // Prevent default behavior that might cause scroll jumps
    e?.preventDefault()

    // Store current scroll position
    const scrollPosition = optionsListRef.current?.scrollTop || 0

    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (optionsListRef.current) {
        optionsListRef.current.scrollTop = scrollPosition
      }
    })
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
    setSearchQuery('')
  }

  const selectAll = () => {
    onChange(options.map(opt => opt.value))
  }

  const isAllSelected = selectedValues.length === options.length
  const selectedCount = selectedValues.length

  const displayText = () => {
    if (selectedCount === 0 || isAllSelected) {
      return allLabel
    }
    if (selectedCount === 1) {
      return options.find(opt => opt.value === selectedValues[0])?.label || allLabel
    }
    return `${selectedCount} selected`
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 ${theme.border} ${theme.borderWidth} rounded-xl text-sm font-medium ${theme.cardBackground} ${theme.secondaryButtonHover} transition-colors flex items-center justify-between gap-2`}
      >
        <span className={selectedCount > 0 && !isAllSelected ? theme.textPrimary : theme.textSecondary}>
          {displayText()}
        </span>
        <div className="flex items-center gap-1">
          {selectedCount > 0 && !isAllSelected && (
            <div
              onClick={clearAll}
              className="p-0.5 hover:bg-stone-200 rounded transition-colors cursor-pointer"
              aria-label="Clear selection"
              role="button"
            >
              <X className="w-3 h-3" />
            </div>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-[320px] min-w-[280px] w-full flex flex-col">
          {/* Search Input */}
          <div className="p-4 border-b border-stone-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Select All / Clear All */}
          <div className="px-4 py-3 border-b border-stone-200 flex gap-3">
            <button
              type="button"
              onClick={selectAll}
              className="flex-1 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex-1 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          </div>

          {/* Options List */}
          <div ref={optionsListRef} className="flex-1 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => toggleOption(option.value, e)}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-stone-50 transition-colors ${
                      isSelected ? 'bg-stone-50' : ''
                    }`}
                  >
                    {/* Checkbox at the beginning */}
                    <div className="flex-shrink-0 w-4 h-4 border border-stone-300 rounded flex items-center justify-center">
                      {isSelected && (
                        <Check className="w-3 h-3 text-stone-600" strokeWidth={2} />
                      )}
                    </div>
                    <span className={`flex-1 min-w-0 ${isSelected ? 'font-medium text-stone-900' : 'text-stone-700'}`}>
                      {option.label}
                      {option.count !== undefined && (
                        <span className="text-stone-500 ml-1.5 font-normal">({option.count})</span>
                      )}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-stone-500">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
