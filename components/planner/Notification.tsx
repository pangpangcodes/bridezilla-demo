'use client'

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { useThemeStyles } from '@/hooks/useThemeStyles'

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function Notification({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationProps) {
  const theme = useThemeStyles()

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: theme.success.bg,
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      titleColor: theme.success.text,
      textColor: theme.success.text
    },
    error: {
      icon: AlertCircle,
      bgColor: theme.error.bg,
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: theme.error.text
    },
    info: {
      icon: Info,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      titleColor: 'text-gray-900',
      textColor: 'text-gray-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } = config[type]

  return (
    <div className="fixed top-24 right-4 z-[9999] max-w-md animate-slide-in-right">
      <div className={`${bgColor} ${borderColor} border rounded-xl shadow-2xl p-4 flex gap-3`}>
        <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold ${titleColor} uppercase tracking-widest mb-1`}>
            {title}
          </h4>
          {message && (
            <p className={`text-sm ${textColor} whitespace-pre-line`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`${textColor} hover:${titleColor} transition-colors flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
