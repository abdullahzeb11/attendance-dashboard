import { Filter, Calendar, Download } from 'lucide-react'
import type { AttendanceStatus, Employee } from '../data/mockData'

type Props = {
  query: string
  onQuery: (v: string) => void
  department: string
  onDepartment: (v: string) => void
  status: string
  onStatus: (v: string) => void
  range: string
  onRange: (v: string) => void
  departments: Employee['department'][]
  statuses: AttendanceStatus[]
  onExport: () => void
}

export default function Filters({
  query,
  onQuery,
  department,
  onDepartment,
  status,
  onStatus,
  range,
  onRange,
  departments,
  statuses,
  onExport,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Filter className="h-4 w-4 text-slate-400" />
          Filters
        </div>

        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Search by name, ID, email…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
          />
        </div>

        <Select value={department} onChange={onDepartment} options={['All departments', ...departments]} />
        <Select value={status} onChange={onStatus} options={['All statuses', ...statuses]} />

        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 bg-white">
          <Calendar className="h-4 w-4 text-slate-400" />
          <select
            value={range}
            onChange={(e) => onRange(e.target.value)}
            className="bg-transparent outline-none text-sm pr-1"
          >
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
            <option>Last 30 days</option>
            <option>Last quarter</option>
          </select>
        </div>

        <button
          onClick={onExport}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
