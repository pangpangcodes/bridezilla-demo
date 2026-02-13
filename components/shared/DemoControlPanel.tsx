'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import { useDemoTour } from '@/hooks/useDemoTour'
import type { DemoStep } from '@/lib/demo-tour-steps'

interface DemoControlPanelProps {
  steps: DemoStep[]
  storageKey: string
  onStepActivate?: (stepIndex: number) => void
}

export default function DemoControlPanel({
  steps,
  storageKey,
  onStepActivate,
}: DemoControlPanelProps) {
  const theme = useThemeStyles()
  const { isOpen, currentStep, advanceStep, dismissTour } = useDemoTour(
    storageKey,
    steps.length
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const step = steps[currentStep]
  if (!step) return null

  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    const nextIndex = currentStep + 1
    advanceStep()
    if (nextIndex < steps.length && onStepActivate) {
      onStepActivate(nextIndex)
    }
  }

  const panel = (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto w-full md:w-96 z-[100] animate-slide-in-from-bottom">
      <div
        className={`${theme.cardBackground} md:rounded-2xl rounded-t-2xl shadow-2xl ${theme.border} ${theme.borderWidth} p-6`}
      >
        {/* Progress Bar */}
        <div className="w-full h-1 bg-stone-100 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full ${theme.primaryButton} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`text-xs uppercase tracking-widest ${theme.textMuted}`}
          >
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={dismissTour}
            className={`${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <h3
          className={`font-display text-xl ${theme.textPrimary} mb-2`}
        >
          {step.title}
        </h3>
        <p
          className={`text-sm ${theme.textSecondary} leading-relaxed mb-6`}
        >
          {step.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={dismissTour}
            className={`text-xs uppercase tracking-widest ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className={`${theme.primaryButton} ${theme.textOnPrimary} ${theme.primaryButtonHover} px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
          >
            {isLastStep ? 'Finish' : 'Next Step'}
            {isLastStep ? (
              <CheckCircle2 size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(panel, document.body)
}
