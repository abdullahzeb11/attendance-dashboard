import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { departmentBreakdown } from '../data/mockData'

export default function DepartmentChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Attendance by department</h3>
        <p className="text-xs text-slate-500 mt-0.5">Today's headcount split by status</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={departmentBreakdown}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Bar dataKey="present" name="Present" stackId="a" fill="#3b6cf3" radius={[0, 0, 0, 0]} />
            <Bar dataKey="late" name="Late" stackId="a" fill="#f59e0b" />
            <Bar dataKey="absent" name="Absent / Leave" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
