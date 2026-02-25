import { ThemeProvider } from '@/contexts/ThemeContext'
import ChatBubbleWrapper from '@/components/chat/ChatBubbleWrapper'

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ChatBubbleWrapper />
    </ThemeProvider>
  )
}
