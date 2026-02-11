'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import { Palette, Check } from 'lucide-react'

export default function SettingsTab() {
  const { theme, setTheme } = useTheme()
  const styles = useThemeStyles()

  return (
    <div className="space-y-6">
      <div className={`${styles.cardBackground} ${styles.border} ${styles.borderWidth} rounded-2xl p-6`}>
        <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-2`}>
          Theme
        </h3>
        <p className={`text-sm ${styles.textSecondary} mb-6`}>
          Choose your preferred visual style for the admin dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Pop Theme Button */}
          <button
            onClick={() => setTheme('pop')}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              theme === 'pop'
                ? 'border-bridezilla-pink bg-bridezilla-pink/10'
                : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-bridezilla-pink flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold ${styles.textPrimary}`}>Pop</h4>
                {theme === 'pop' && <Check className="w-4 h-4 text-bridezilla-pink flex-shrink-0" />}
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                Fun & playful with blue and pink
              </p>
              <div className="flex gap-1.5 mt-2">
                <div className="w-5 h-5 rounded-full bg-bridezilla-pink border border-white shadow-sm" />
                <div className="w-5 h-5 rounded-full bg-bridezilla-blue border border-white shadow-sm" />
              </div>
            </div>
          </button>

          {/* Heirloom Theme Button */}
          <button
            onClick={() => setTheme('heirloom')}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              theme === 'heirloom'
                ? 'border-[#1b3b2b] bg-emerald-50'
                : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1b3b2b] flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold ${styles.textPrimary}`}>Heirloom</h4>
                {theme === 'heirloom' && <Check className="w-4 h-4 text-[#1b3b2b] flex-shrink-0" />}
              </div>
              <p className={`text-xs ${styles.textSecondary}`}>
                Elegant with cream and green
              </p>
              <div className="flex gap-1.5 mt-2">
                <div className="w-5 h-5 rounded-full bg-[#1b3b2b] border border-white shadow-sm" />
                <div className="w-5 h-5 rounded-full bg-[#FAF9F6] border border-stone-300 shadow-sm" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
