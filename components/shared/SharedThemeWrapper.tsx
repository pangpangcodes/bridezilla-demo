'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export function SharedThemeWrapper({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()

  // Always use Heirloom theme for shared pages
  useEffect(() => {
    setTheme('heirloom')
  }, [setTheme])

  return <>{children}</>
}
