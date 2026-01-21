import React from 'react'

export interface StepItem {
  id: string
  title: string
  subtitle?: string
}

interface StepperProps {
  steps: StepItem[]
  activeStep: number
  variant?: 'light' | 'dark'
}

export default function Stepper({ steps, activeStep, variant = 'light' }: StepperProps) {
  const isDark = variant === 'dark'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {steps.map((step, index) => {
        const isActive = index === activeStep
        const isComplete = index < activeStep
        return (
          <div key={step.id} className="flex min-w-[150px] flex-1 items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                isComplete
                  ? 'border-brand bg-brand text-white'
                  : isActive
                    ? isDark
                      ? 'border-brand bg-white text-brand shadow-soft'
                      : 'border-brand bg-white text-brand shadow-soft'
                    : isDark
                      ? 'border-white/20 bg-white/10 text-slate-200'
                      : 'border-slate-200 bg-white text-slate-400'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {index + 1}
            </div>
            <div className="min-w-0">
              <div className={`text-xs font-semibold ${
                isActive
                  ? isDark
                    ? 'text-white'
                    : 'text-slate-900'
                  : isDark
                    ? 'text-slate-300'
                    : 'text-slate-400'
              }`}>
                {step.title}
              </div>
              {step.subtitle && (
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  {step.subtitle}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-2 hidden h-px flex-1 ${isDark ? 'bg-white/20' : 'bg-slate-200'} sm:block`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
