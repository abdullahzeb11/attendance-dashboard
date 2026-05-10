import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { punctualityBreakdown } from '../data/mockData'

export default function PunctualityChart() {
  const total = punctualityBreakdown.reduce((s, d) => s + d.value, 0)
  const onTime = punctualityBreakdown[0].value

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-900">Punctuality</h3>
        <p className="text-xs text-slate-500 mt-0.5">Last 30-day average</p>
      </div>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={punctualityBreakdown}
              dataKey="value"
              innerRadius={60}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {punctualityBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number, n) => [`${v}%`, n as string]}
              contentStyle={{ borderRadius: 10, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-semibold text-slate-900">{onTime}%</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">On time</div>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {punctualityBreakdown.map((item) => (
          <li key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="text-slate-900 font-medium tabular-nums">
              {Math.round((item.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
