import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const modes = [
  {
    id: 'AUTO',
    label: 'Auto',
    tagline: 'Quick city hops',
    emoji: '🛺',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'CAR',
    label: 'Car',
    tagline: 'Comfort rides',
    emoji: '🚗',
    gradient: 'from-sky-500/20 via-cyan-500/10 to-transparent'
  },
  {
    id: 'BIKE',
    label: 'Bike',
    tagline: 'Fast & breezy',
    emoji: '🏍️',
    gradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent'
  },
  {
    id: 'SCOOTY',
    label: 'Scooty',
    tagline: 'Easy solo rides',
    emoji: '🛵',
    gradient: 'from-lime-500/20 via-emerald-500/10 to-transparent'
  },
  {
    id: 'EV',
    label: 'EV',
    tagline: 'Clean & quiet',
    emoji: '⚡',
    gradient: 'from-indigo-500/20 via-violet-500/10 to-transparent'
  }
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex flex-col gap-3">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-300">Hyderabad</span>
          <h1 className="text-3xl font-semibold">Choose your ride</h1>
          <p className="text-sm text-slate-300">Pick a vehicle and start your booking in seconds.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                navigate(`/booking/${mode.id.toLowerCase()}`)
              }}
              className={`vehicle-card bg-gradient-to-br ${mode.gradient} sm:rounded-3xl sm:p-4 rounded-2xl p-3`}
              data-testid={`mode-${mode.id}`}
            >
              <div className="vehicle-icon">{mode.emoji}</div>
              <div>
                <div className="text-xl font-semibold">{mode.label}</div>
                <div className="text-sm text-slate-200">{mode.tagline}</div>
              </div>
              <div className="absolute right-4 top-4 rounded-full border border-white/20 px-2 py-1 text-xs text-slate-200">
                Tap to book
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
