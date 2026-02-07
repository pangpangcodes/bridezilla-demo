'use client'

import { useState, useEffect } from 'react'
import { X, Settings } from 'lucide-react'

interface ReminderTypes {
  overdue: boolean
  due_today: boolean
  '7_days': boolean
  '30_days': boolean
}

interface PaymentReminderSettings {
  id: string
  enabled: boolean
  email_recipient: string
  reminder_types: ReminderTypes
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function PaymentReminderSettingsModal({ isOpen, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PaymentReminderSettings | null>(null)
  const [enabled, setEnabled] = useState(true)
  const [emailRecipient, setEmailRecipient] = useState('')
  const [reminderTypes, setReminderTypes] = useState<ReminderTypes>({
    overdue: true,
    due_today: true,
    '7_days': true,
    '30_days': true
  })
  const [emailError, setEmailError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem('admin_auth')
      const response = await fetch('/api/admin/payment-reminder-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      if (data.success && data.data.settings) {
        const s = data.data.settings
        setSettings(s)
        setEnabled(s.enabled)
        setEmailRecipient(s.email_recipient)
        setReminderTypes(s.reminder_types)
      }
    } catch (err) {
      console.error('Fetch settings error:', err)
      showToast('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmailRecipient(value)
    if (value && !validateEmail(value)) {
      setEmailError('Invalid email format')
    } else {
      setEmailError('')
    }
  }

  const handleReminderTypeToggle = (type: keyof ReminderTypes) => {
    setReminderTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSave = async () => {
    // Validation
    if (!emailRecipient) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(emailRecipient)) {
      setEmailError('Invalid email format')
      return
    }

    setSaving(true)
    try {
      const token = sessionStorage.getItem('admin_auth')
      const response = await fetch('/api/admin/payment-reminder-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled,
          email_recipient: emailRecipient,
          reminder_types: reminderTypes
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save settings')
      }

      showToast('Settings saved successfully', 'success')
      onSave()
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err: any) {
      console.error('Save settings error:', err)
      showToast(err.message || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-bridezilla-pink bg-bridezilla-light-pink">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-bridezilla-pink" />
              <h2 className="font-heading text-2xl uppercase tracking-wide text-gray-900">Payment Reminder Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-bridezilla-pink hover:text-bridezilla-pink/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading settings...</div>
            ) : (
              <>
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <label className="text-sm font-semibold text-gray-900">
                      Enable Payment Reminders
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Receive automated email reminders for upcoming and overdue payments
                    </p>
                  </div>
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enabled ? 'bg-bridezilla-pink' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Recipient */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Recipient
                  </label>
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={handleEmailChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      emailError
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-bridezilla-pink'
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-600 mt-1">{emailError}</p>
                  )}
                </div>

                {/* Reminder Types */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Send reminders for:
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} group`}>
                      <input
                        type="checkbox"
                        checked={enabled && reminderTypes.overdue}
                        onChange={() => handleReminderTypeToggle('overdue')}
                        disabled={!enabled}
                        className="w-4 h-4 text-bridezilla-pink rounded focus:ring-bridezilla-pink disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        Overdue payments
                      </span>
                    </label>

                    <label className={`flex items-center gap-3 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} group`}>
                      <input
                        type="checkbox"
                        checked={enabled && reminderTypes.due_today}
                        onChange={() => handleReminderTypeToggle('due_today')}
                        disabled={!enabled}
                        className="w-4 h-4 text-bridezilla-pink rounded focus:ring-bridezilla-pink disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        Due today
                      </span>
                    </label>

                    <label className={`flex items-center gap-3 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} group`}>
                      <input
                        type="checkbox"
                        checked={enabled && reminderTypes['7_days']}
                        onChange={() => handleReminderTypeToggle('7_days')}
                        disabled={!enabled}
                        className="w-4 h-4 text-bridezilla-pink rounded focus:ring-bridezilla-pink disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        7 days before due date
                      </span>
                    </label>

                    <label className={`flex items-center gap-3 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} group`}>
                      <input
                        type="checkbox"
                        checked={enabled && reminderTypes['30_days']}
                        onChange={() => handleReminderTypeToggle('30_days')}
                        disabled={!enabled}
                        className="w-4 h-4 text-bridezilla-pink rounded focus:ring-bridezilla-pink disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        30 days before due date
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:scale-105 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || !!emailError}
              className="px-4 py-2 text-sm font-semibold text-white bg-bridezilla-pink rounded-full hover:scale-105 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  )
}
