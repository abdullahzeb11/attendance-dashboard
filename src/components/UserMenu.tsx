import { User, Settings, LifeBuoy, Moon, LogOut } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'

type Props = {
  open: boolean
  onClose: () => void
  onProfile: () => void
  onSettings: () => void
  onHelp: () => void
  onSignOut: () => void
  onToggleTheme: () => void
}

export default function UserMenu({ open, onClose, onProfile, onSettings, onHelp, onSignOut, onToggleTheme }: Props) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open)
  if (!open) return null
  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-64 rounded-xl border border-slate-200 bg-white shadow-2xl z-40 animate-[pop_.15s_ease-out] overflow-hidden"
    >
      <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 grid place-items-center text-white text-sm font-semibold">
          DM
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">Dana Mitchell</div>
          <div className="text-xs text-slate-500 truncate">dana.mitchell@acme.co</div>
        </div>
      </div>
      <ul className="py-1">
        <Item icon={User} label="My profile" onClick={() => { onProfile(); onClose() }} />
        <Item icon={Settings} label="Account settings" onClick={() => { onSettings(); onClose() }} />
        <Item icon={Moon} label="Toggle theme" onClick={() => { onToggleTheme(); onClose() }} />
        <Item icon={LifeBuoy} label="Help & docs" onClick={() => { onHelp(); onClose() }} />
      </ul>
      <div className="border-t border-slate-100 py-1">
        <Item
          icon={LogOut}
          label="Sign out"
          danger
          onClick={() => { onSignOut(); onClose() }}
        />
      </div>
    </div>
  )
}

function Item({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: typeof User
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={[
          'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
          danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50',
        ].join(' ')}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    </li>
  )
}
