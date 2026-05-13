import { Sun, Monitor, Moon } from 'lucide-react'

export type Theme = 'light' | 'system' | 'dark'

type Props = {
  theme: Theme
  onChange: (t: Theme) => void
}

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'dark', icon: Moon, label: 'Dark' },
]

export default function ThemeSwitcher({ theme, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={`${opt.label} theme`}
            onClick={() => onChange(opt.value)}
            className={[
              'h-8 w-8 grid place-items-center rounded-md transition-colors',
              active
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}
