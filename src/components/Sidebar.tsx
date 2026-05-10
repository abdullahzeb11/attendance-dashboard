import {
  LayoutDashboard,
  Users,
  CalendarClock,
  FileBarChart2,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react'

export type Page = 'dashboard' | 'employees' | 'attendance' | 'reports' | 'settings'

const nav: { label: string; icon: typeof LayoutDashboard; page: Page }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { label: 'Employees', icon: Users, page: 'employees' },
  { label: 'Attendance', icon: CalendarClock, page: 'attendance' },
  { label: 'Reports', icon: FileBarChart2, page: 'reports' },
  { label: 'Settings', icon: Settings, page: 'settings' },
]

type Props = {
  active: Page
  onNavigate: (p: Page) => void
  onHelp: () => void
  onSignOut: () => void
  onSeePlans: () => void
}

export default function Sidebar({ active, onNavigate, onHelp, onSignOut, onSeePlans }: Props) {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <button
        onClick={() => onNavigate('dashboard')}
        className="px-5 py-5 flex items-center gap-2 text-left hover:bg-slate-50/60"
      >
        <div className="h-9 w-9 rounded-lg bg-brand-500 grid place-items-center text-white font-bold">
          A
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 leading-tight">Attendly</div>
          <div className="text-[11px] text-slate-500">Workforce Suite</div>
        </div>
      </button>

      <nav className="px-3 mt-2 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 px-2 mb-2">
          Workspace
        </div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            const isActive = active === item.page
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.page)}
                  className={[
                    'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 px-2 mt-6 mb-2">
          Support
        </div>
        <ul className="space-y-1">
          <li>
            <button
              onClick={onHelp}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <LifeBuoy className="h-4 w-4" />
              Help center
            </button>
          </li>
          <li>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>

      <div className="m-3 rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-4">
        <div className="text-sm font-semibold text-slate-900">Upgrade to Pro</div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Unlock advanced analytics, custom reports and SSO.
        </p>
        <button
          onClick={onSeePlans}
          className="mt-3 w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium py-2 transition-colors"
        >
          See plans
        </button>
      </div>
    </aside>
  )
}
