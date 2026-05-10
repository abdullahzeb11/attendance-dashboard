import { useEffect } from 'react'
import { X, Mail, Building2, Briefcase, Clock3, CalendarDays } from 'lucide-react'
import type { Employee } from '../data/mockData'

type Props = { employee: Employee | null; onClose: () => void; onEdit: (e: Employee) => void }

export default function EmployeeDrawer({ employee, onClose, onEdit }: Props) {
  useEffect(() => {
    if (!employee) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [employee, onClose])

  if (!employee) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/30 animate-[fadeIn_.15s_ease-out]" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-[420px] max-w-[95vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-[slideIn_.2s_ease-out]"
        style={{ animationName: 'slideInRight' }}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Employee profile</div>
          <button
            onClick={onClose}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100 text-slate-500"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 flex items-center gap-4 border-b border-slate-100">
            <img src={employee.avatar} alt="" className="h-16 w-16 rounded-full" />
            <div>
              <div className="text-base font-semibold text-slate-900">{employee.name}</div>
              <div className="text-xs text-slate-500">{employee.id}</div>
              <div className="text-xs text-slate-500 mt-0.5">{employee.role}</div>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3">
            <Row icon={Mail} label="Email" value={employee.email} />
            <Row icon={Building2} label="Department" value={employee.department} />
            <Row icon={Briefcase} label="Role" value={employee.role} />
            <Row icon={Clock3} label="Today's hours" value={`${employee.hours.toFixed(1)}h`} />
            <Row
              icon={CalendarDays}
              label="Attendance rate (30d)"
              value={`${employee.attendanceRate}%`}
            />
          </div>

          <div className="px-5 pb-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
              Recent activity
            </div>
            <ul className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {[
                { day: 'Today', detail: `Checked in at ${employee.checkIn ?? '—'}`, status: employee.status },
                { day: 'Yesterday', detail: 'Checked in at 09:04', status: 'Late' },
                { day: 'Apr 24', detail: 'Checked in at 08:48', status: 'Present' },
                { day: 'Apr 23', detail: 'Approved leave', status: 'Leave' },
              ].map((row, i) => (
                <li key={i} className="px-3 py-2.5 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-slate-900">{row.day}</div>
                    <div className="text-xs text-slate-500">{row.detail}</div>
                  </div>
                  <span className="text-xs text-slate-500">{row.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="px-3 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600"
          >
            Edit details
          </button>
        </div>
      </aside>
      <style>{`@keyframes slideInRight { from { transform: translateX(16px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center text-slate-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm text-slate-900">{value}</div>
      </div>
    </div>
  )
}
