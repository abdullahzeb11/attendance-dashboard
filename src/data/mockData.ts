export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Leave' | 'Remote'

export type Employee = {
  id: string
  name: string
  email: string
  department: 'Engineering' | 'Design' | 'Product' | 'Sales' | 'Marketing' | 'HR' | 'Finance'
  role: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  hours: number
  attendanceRate: number
  avatar: string
}

const firstNames = [
  'Aarav', 'Layla', 'Marcus', 'Sofia', 'Ethan', 'Hana', 'Noah', 'Amira',
  'Liam', 'Zara', 'Mateo', 'Yuki', 'Olivia', 'Omar', 'Chloe', 'Idris',
  'Mei', 'Diego', 'Priya', 'Nora', 'Caleb', 'Lina', 'Theo', 'Ines',
]
const lastNames = [
  'Patel', 'Hassan', 'Reyes', 'Cohen', 'Nguyen', 'Khan', 'Rossi', 'Tanaka',
  'Silva', 'Okafor', 'Müller', 'Park', 'Garcia', 'Singh', 'Adler', 'Mendez',
]
const departments: Employee['department'][] = [
  'Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'HR', 'Finance',
]
const roles = ['Manager', 'Lead', 'Analyst', 'Specialist', 'Engineer', 'Designer', 'Coordinator']
const statuses: AttendanceStatus[] = ['Present', 'Present', 'Present', 'Late', 'Remote', 'Absent', 'Leave']

const seed = (n: number) => {
  let s = n + 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seed(42)
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]

const initialsAvatar = (name: string, color: string) => {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='${color}'/><text x='50%' y='54%' text-anchor='middle' font-family='Inter, Arial' font-size='24' font-weight='600' fill='white' dominant-baseline='middle'>${initials}</text></svg>`,
  )}`
}

const palette = ['#3b6cf3', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6366f1']

export const employees: Employee[] = Array.from({ length: 28 }, (_, i) => {
  const first = firstNames[i % firstNames.length]
  const last = lastNames[(i * 3) % lastNames.length]
  const name = `${first} ${last}`
  const status = pick(statuses)
  const dept = pick(departments)
  const checkIn =
    status === 'Absent' || status === 'Leave'
      ? null
      : `${String(8 + Math.floor(rand() * 2)).padStart(2, '0')}:${String(Math.floor(rand() * 60)).padStart(2, '0')}`
  const checkOut =
    status === 'Absent' || status === 'Leave'
      ? null
      : `${String(17 + Math.floor(rand() * 2)).padStart(2, '0')}:${String(Math.floor(rand() * 60)).padStart(2, '0')}`
  const hours =
    status === 'Absent' || status === 'Leave'
      ? 0
      : Math.round((7 + rand() * 2.2) * 10) / 10
  return {
    id: `EMP-${String(1042 + i).padStart(4, '0')}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@acme.co`,
    department: dept,
    role: pick(roles),
    status,
    checkIn,
    checkOut,
    hours,
    attendanceRate: Math.round((85 + rand() * 14) * 10) / 10,
    avatar: initialsAvatar(name, palette[i % palette.length]),
  }
})

export const attendanceTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 88 + Math.sin(i / 3) * 4
  const present = Math.round(base + (rand() - 0.5) * 6)
  const late = Math.round(4 + rand() * 4)
  const absent = Math.round(100 - present - late)
  return {
    day: `Apr ${day}`,
    present,
    late,
    absent: Math.max(absent, 0),
  }
})

export const departmentBreakdown = departments.map((dept) => {
  const employeesInDept = employees.filter((e) => e.department === dept)
  const present = employeesInDept.filter((e) => e.status === 'Present' || e.status === 'Remote').length
  const late = employeesInDept.filter((e) => e.status === 'Late').length
  const absent = employeesInDept.filter((e) => e.status === 'Absent' || e.status === 'Leave').length
  return { department: dept, present, late, absent, total: employeesInDept.length }
})

export const punctualityBreakdown = [
  { name: 'On time', value: 72, color: '#10b981' },
  { name: 'Slightly late (<15m)', value: 18, color: '#f59e0b' },
  { name: 'Late (>15m)', value: 7, color: '#ef4444' },
  { name: 'Remote', value: 3, color: '#3b6cf3' },
]

export const monthlyReports = [
  { month: 'Nov', avgHours: 8.1, attendance: 94.2, overtime: 6.3, leaves: 18 },
  { month: 'Dec', avgHours: 7.6, attendance: 91.8, overtime: 4.1, leaves: 32 },
  { month: 'Jan', avgHours: 8.2, attendance: 95.7, overtime: 7.4, leaves: 14 },
  { month: 'Feb', avgHours: 8.0, attendance: 93.9, overtime: 5.8, leaves: 19 },
  { month: 'Mar', avgHours: 8.3, attendance: 96.1, overtime: 8.1, leaves: 12 },
  { month: 'Apr', avgHours: 8.1, attendance: 94.6, overtime: 6.7, leaves: 16 },
]
