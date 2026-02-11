'use client'

import { use } from 'react'
import SharedWorkspace from '@/components/shared/SharedWorkspace'
import { SharedThemeWrapper } from '@/components/shared/SharedThemeWrapper'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ThemeProvider>
      <SharedThemeWrapper>
        <SharedWorkspace shareLinkId={id} />
      </SharedThemeWrapper>
    </ThemeProvider>
  )
}
