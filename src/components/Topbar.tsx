import { useState } from 'react'
import { Bell, Search, Plus, ChevronDown } from 'lucide-react'
import NotificationsPanel from './NotificationsPanel'
import UserMenu from './UserMenu'
import ThemeSwitcher, { type Theme } from './ThemeSwitcher'

type Props = {
  search: string
  onSearch: (v: string) => void
  onNewEntry: () => void
  onProfile: () => void
  onSettings: () => void
  onHelp: () => void
  onSignOut: () => void
  theme: Theme
  onThemeChange: (t: Theme) => void
  onNotify: (title: string) => void
}

export default function Topbar(props: Props) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 lg:gap-4 border-b border-slate-200 bg-white/85 backdrop-blur px-4 lg:px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={props.search}
            onChange={(e) => props.onSearch(e.target.value)}
            placeholder="Search employees, departments…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <ThemeSwitcher theme={props.theme} onChange={props.onThemeChange} />

        <button
          onClick={props.onNewEntry}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-3 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New entry
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v)
              setMenuOpen(false)
            }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative h-9 w-9 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <NotificationsPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            onNotify={props.onNotify}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen((v) => !v)
              setNotifOpen(false)
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 grid place-items-center text-white text-xs font-semibold">
              DM
            </div>
            <div className="hidden md:block leading-tight pr-1 text-left">
              <div className="text-sm font-medium text-slate-900">Dana Mitchell</div>
              <div className="text-[11px] text-slate-500">HR Admin</div>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          <UserMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onProfile={props.onProfile}
            onSettings={props.onSettings}
            onHelp={props.onHelp}
            onSignOut={props.onSignOut}
          />
        </div>
      </div>
    </header>
  )
}
