import { useClickOutside } from '../hooks/useClickOutside'
import { Clock3, UserPlus, Plane, FileBarChart2 } from 'lucide-react'

type Props = { open: boolean; onClose: () => void; onNotify: (title: string) => void }

const items = [
  {
    icon: Clock3,
    title: '3 employees clocked in late',
    detail: 'Engineering · last 30 min',
    time: '2m',
    unread: true,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: UserPlus,
    title: 'New hire onboarded',
    detail: 'Mei Park joined Design',
    time: '1h',
    unread: true,
    color: 'text-brand-600 bg-brand-50',
  },
  {
    icon: Plane,
    title: 'Leave request submitted',
    detail: 'Diego Silva — May 3 to May 7',
    time: '3h',
    unread: true,
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: FileBarChart2,
    title: 'April report is ready',
    detail: 'Attendance up 1.2% MoM',
    time: '1d',
    unread: false,
    color: 'text-emerald-600 bg-emerald-50',
  },
]

export default function NotificationsPanel({ open, onClose, onNotify }: Props) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open)
  if (!open) return null
  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-96 max-w-[92vw] rounded-xl border border-slate-200 bg-white shadow-2xl z-40 animate-[pop_.15s_ease-out]"
    >
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Notifications</div>
        <button
          onClick={() => onNotify('All notifications marked read')}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Mark all read
        </button>
      </div>
      <ul className="max-h-96 overflow-y-auto">
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <li
              key={i}
              className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
            >
              <div className={`h-9 w-9 rounded-lg grid place-items-center ${it.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-900 flex items-center gap-2">
                  {it.title}
                  {it.unread && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">{it.detail}</div>
              </div>
              <div className="text-[11px] text-slate-400 shrink-0">{it.time}</div>
            </li>
          )
        })}
      </ul>
      <div className="px-4 py-2 border-t border-slate-100 text-center">
        <button
          onClick={() => onNotify('Opened activity feed')}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          View all activity
        </button>
      </div>
    </div>
  )
}
