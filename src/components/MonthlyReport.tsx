import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChevronRight } from 'lucide-react'
import { monthlyReports } from '../data/mockData'

type Props = { onViewFullReport?: () => void; onRangeChange?: (range: string) => void }

export default function MonthlyReport({ onViewFullReport, onRangeChange }: Props = {}) {
  const latest = monthlyReports[monthlyReports.length - 1]
  const previous = monthlyReports[monthlyReports.length - 2]
  const attendanceDelta = +(latest.attendance - previous.attendance).toFixed(1)
  const hoursDelta = +(latest.avgHours - previous.avgHours).toFixed(1)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Monthly report</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Attendance, average hours, overtime, and approved leaves
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => onRangeChange?.(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
          >
            <option>Last 6 months</option>
            <option>This year</option>
            <option>Custom range</option>
          </select>
          <button
            onClick={onViewFullReport}
            className="text-sm inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium"
          >
            View full report
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="Attendance" value={`${latest.attendance}%`} delta={attendanceDelta} suffix="%" />
        <Stat label="Avg. hours / day" value={`${latest.avgHours}h`} delta={hoursDelta} suffix="h" />
        <Stat label="Overtime hours" value={`${latest.overtime}k`} delta={+(latest.overtime - previous.overtime).toFixed(1)} />
        <Stat label="Approved leaves" value={`${latest.leaves}`} delta={latest.leaves - previous.leaves} invertColor />
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyReports} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={36} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              domain={[80, 100]}
              width={36}
            />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Bar yAxisId="left" dataKey="overtime" name="Overtime (k hrs)" fill="#c7d2fe" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar yAxisId="left" dataKey="leaves" name="Leaves" fill="#fde68a" radius={[6, 6, 0, 0]} barSize={28} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="attendance"
              name="Attendance %"
              stroke="#3b6cf3"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  delta,
  suffix = '',
  invertColor = false,
}: {
  label: string
  value: string
  delta: number
  suffix?: string
  invertColor?: boolean
}) {
  const positive = invertColor ? delta < 0 : delta >= 0
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-slate-900 tabular-nums">{value}</span>
        <span
          className={[
            'text-xs font-medium tabular-nums',
            positive ? 'text-emerald-600' : 'text-rose-600',
          ].join(' ')}
        >
          {delta >= 0 ? '+' : ''}
          {delta}
          {suffix}
        </span>
      </div>
    </div>
  )
}
