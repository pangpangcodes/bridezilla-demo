'use client'

import { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import ChatBubble from './ChatBubble'

function ChatBubbleInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  let currentView = 'couples'
  if (pathname.includes('/couples/')) {
    currentView = 'couple_detail'
  } else {
    const view = searchParams.get('view')
    if (view) currentView = view
  }

  return <ChatBubble currentView={currentView} />
}

export default function ChatBubbleWrapper() {
  return (
    <Suspense fallback={null}>
      <ChatBubbleInner />
    </Suspense>
  )
}
