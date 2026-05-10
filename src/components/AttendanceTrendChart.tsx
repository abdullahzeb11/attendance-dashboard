import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { attendanceTrend } from '../data/mockData'
import { useState } from 'react'

const ranges = ['7D', '30D', '90D'] as const
type Range = typeof ranges[number]

export default function AttendanceTrendChart() {
  const [range, setRange] = useState<Range>('30D')
  const data =
    range === '7D'
      ? attendanceTrend.slice(-7)
      : range === '30D'
      ? attendanceTrend
      : attendanceTrend

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Attendance trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily breakdown of present, late, and absent employees
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={[
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                range === r
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="g-present" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b6cf3" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b6cf3" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g-late" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g-absent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              interval={Math.ceil(data.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: 10, fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="present"
              name="Present"
              stroke="#3b6cf3"
              strokeWidth={2}
              fill="url(#g-present)"
            />
            <Area
              type="monotone"
              dataKey="late"
              name="Late"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#g-late)"
            />
            <Area
              type="monotone"
              dataKey="absent"
              name="Absent"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#g-absent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
