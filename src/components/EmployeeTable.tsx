import { useState } from 'react'
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, MessageSquare, UserMinus } from 'lucide-react'
import type { Employee, AttendanceStatus } from '../data/mockData'
import { useClickOutside } from '../hooks/useClickOutside'

const statusStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  Late: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  Absent: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  Leave: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
  Remote: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100',
}

type SortKey = 'name' | 'department' | 'status' | 'hours' | 'attendanceRate'

type ColumnKey = 'id' | 'department' | 'status' | 'checkIn' | 'checkOut' | 'hours' | 'attendanceRate'

const allColumns: { key: ColumnKey; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'checkOut', label: 'Check-out' },
  { key: 'hours', label: 'Hours' },
  { key: 'attendanceRate', label: 'Attendance' },
]

type Props = {
  rows: Employee[]
  onAdd: () => void
  onView: (emp: Employee) => void
  onEdit: (emp: Employee) => void
  onMessage: (emp: Employee) => void
  onMarkAbsent: (emp: Employee) => void
}

export default function EmployeeTable({ rows, onAdd, onView, onEdit, onMessage, onMarkAbsent }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(
    new Set<ColumnKey>(['id', 'department', 'status', 'checkIn', 'checkOut', 'hours', 'attendanceRate']),
  )
  const pageSize = 8

  const colsRef = useClickOutside<HTMLDivElement>(() => setColumnsOpen(false), columnsOpen)

  const sorted = [...rows].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    const av = a[sort.key]
    const bv = b[sort.key]
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  const toggleCol = (k: ColumnKey) =>
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const isVisible = (k: ColumnKey) => visibleCols.has(k)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-visible">
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Employees</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {pageRows.length} of {sorted.length} matching records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={colsRef}>
            <button
              onClick={() => setColumnsOpen((v) => !v)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Columns
            </button>
            {columnsOpen && (
              <div className="absolute right-0 top-9 w-56 rounded-xl border border-slate-200 bg-white shadow-2xl z-30 p-2 animate-[pop_.15s_ease-out]">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 px-2 py-1">
                  Show columns
                </div>
                {allColumns.map((c) => (
                  <label
                    key={c.key}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isVisible(c.key)}
                      onChange={() => toggleCol(c.key)}
                      className="accent-brand-500"
                    />
                    <span className="text-sm text-slate-700">{c.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onAdd}
            className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
          >
            Add employee
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <Th sortable onClick={() => toggleSort('name')}>Employee</Th>
              {isVisible('id') && <Th>ID</Th>}
              {isVisible('department') && <Th sortable onClick={() => toggleSort('department')}>Department</Th>}
              {isVisible('status') && <Th sortable onClick={() => toggleSort('status')}>Status</Th>}
              {isVisible('checkIn') && <Th>Check-in</Th>}
              {isVisible('checkOut') && <Th>Check-out</Th>}
              {isVisible('hours') && <Th sortable onClick={() => toggleSort('hours')}>Hours</Th>}
              {isVisible('attendanceRate') && (
                <Th sortable onClick={() => toggleSort('attendanceRate')}>Attendance</Th>
              )}
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((emp) => (
              <tr key={emp.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3">
                  <button
                    onClick={() => onView(emp)}
                    className="flex items-center gap-3 text-left hover:underline decoration-slate-300 underline-offset-4"
                  >
                    <img src={emp.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div className="leading-tight">
                      <div className="font-medium text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.email}</div>
                    </div>
                  </button>
                </td>
                {isVisible('id') && <td className="px-5 py-3 text-slate-600 tabular-nums">{emp.id}</td>}
                {isVisible('department') && (
                  <td className="px-5 py-3 text-slate-700">
                    <div className="font-medium">{emp.department}</div>
                    <div className="text-xs text-slate-500">{emp.role}</div>
                  </td>
                )}
                {isVisible('status') && (
                  <td className="px-5 py-3">
                    <span
                      className={[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        statusStyles[emp.status],
                      ].join(' ')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {emp.status}
                    </span>
                  </td>
                )}
                {isVisible('checkIn') && <td className="px-5 py-3 text-slate-700 tabular-nums">{emp.checkIn ?? '—'}</td>}
                {isVisible('checkOut') && <td className="px-5 py-3 text-slate-700 tabular-nums">{emp.checkOut ?? '—'}</td>}
                {isVisible('hours') && <td className="px-5 py-3 text-slate-700 tabular-nums">{emp.hours.toFixed(1)}h</td>}
                {isVisible('attendanceRate') && (
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${emp.attendanceRate}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 tabular-nums">{emp.attendanceRate}%</span>
                    </div>
                  </td>
                )}
                <td className="px-5 py-3 text-right relative">
                  <RowMenu
                    open={openRow === emp.id}
                    onToggle={() => setOpenRow((v) => (v === emp.id ? null : emp.id))}
                    onClose={() => setOpenRow(null)}
                    onView={() => onView(emp)}
                    onEdit={() => onEdit(emp)}
                    onMessage={() => onMessage(emp)}
                    onMarkAbsent={() => onMarkAbsent(emp)}
                  />
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={allColumns.length + 2} className="text-center py-10 text-sm text-slate-500">
                  No employees match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Page {safePage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function RowMenu({
  open,
  onToggle,
  onClose,
  onView,
  onEdit,
  onMessage,
  onMarkAbsent,
}: {
  open: boolean
  onToggle: () => void
  onClose: () => void
  onView: () => void
  onEdit: () => void
  onMessage: () => void
  onMarkAbsent: () => void
}) {
  const ref = useClickOutside<HTMLDivElement>(onClose, open)
  return (
    <div ref={ref} className="inline-block relative">
      <button
        onClick={onToggle}
        className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100 text-slate-500"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 w-48 rounded-xl border border-slate-200 bg-white shadow-2xl z-20 py-1 animate-[pop_.15s_ease-out]">
          <MenuItem icon={Eye} label="View profile" onClick={() => { onView(); onClose() }} />
          <MenuItem icon={Pencil} label="Edit details" onClick={() => { onEdit(); onClose() }} />
          <MenuItem icon={MessageSquare} label="Send message" onClick={() => { onMessage(); onClose() }} />
          <div className="my-1 border-t border-slate-100" />
          <MenuItem icon={UserMinus} label="Mark absent" danger onClick={() => { onMarkAbsent(); onClose() }} />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: typeof Eye
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Th({
  children,
  sortable,
  onClick,
  align = 'left',
}: {
  children: React.ReactNode
  sortable?: boolean
  onClick?: () => void
  align?: 'left' | 'right'
}) {
  return (
    <th
      onClick={onClick}
      className={[
        'px-5 py-3 font-medium select-none',
        align === 'right' ? 'text-right' : 'text-left',
        sortable ? 'cursor-pointer hover:text-slate-700' : '',
      ].join(' ')}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && <ArrowUpDown className="h-3 w-3 opacity-50" />}
      </span>
    </th>
  )
}
