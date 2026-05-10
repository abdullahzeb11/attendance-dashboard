import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

type Props = {
  label: string
  value: string
  delta: number
  icon: LucideIcon
  accent: 'blue' | 'green' | 'amber' | 'rose' | 'violet'
  caption?: string
}

const accentMap: Record<Props['accent'], { bg: string; fg: string }> = {
  blue: { bg: 'bg-brand-50', fg: 'text-brand-600' },
  green: { bg: 'bg-emerald-50', fg: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', fg: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', fg: 'text-rose-600' },
  violet: { bg: 'bg-violet-50', fg: 'text-violet-600' },
}

export default function KPICard({ label, value, delta, icon: Icon, accent, caption }: Props) {
  const positive = delta >= 0
  const colors = accentMap[accent]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-lg grid place-items-center ${colors.bg} ${colors.fg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={[
            'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
          ].join(' ')}
        >
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? '+' : ''}
          {delta}%
        </span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
        {caption && <div className="text-xs text-slate-400 mt-2">{caption}</div>}
      </div>
    </div>
  )
}
