'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
  }>
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const theme = useThemeStyles()

  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className={theme.textMuted} />}
          {item.href || item.onClick ? (
            <a
              href={item.href}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault()
                  item.onClick()
                }
              }}
              className={`${theme.textSecondary} hover:${theme.textPrimary} transition-colors cursor-pointer`}
            >
              {item.label}
            </a>
          ) : (
            <span className={`font-medium ${theme.textPrimary}`}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
