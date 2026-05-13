import { useEffect, useMemo, useState } from 'react'
import { Users, UserCheck, Clock3, UserX, Plane } from 'lucide-react'
import Sidebar, { type Page } from './components/Sidebar'
import Topbar from './components/Topbar'
import { type Theme } from './components/ThemeSwitcher'
import KPICard from './components/KPICard'
import AttendanceTrendChart from './components/AttendanceTrendChart'
import DepartmentChart from './components/DepartmentChart'
import PunctualityChart from './components/PunctualityChart'
import Filters from './components/Filters'
import EmployeeTable from './components/EmployeeTable'
import MonthlyReport from './components/MonthlyReport'
import Toasts, { type Toast, type ToastVariant } from './components/Toasts'
import Modal from './components/Modal'
import AddEmployeeModal from './components/AddEmployeeModal'
import HelpModal from './components/HelpModal'
import PlansModal from './components/PlansModal'
import ConfirmDialog from './components/ConfirmDialog'
import EmployeeDrawer from './components/EmployeeDrawer'
import SettingsPage from './components/SettingsPage'
import { employees as initialEmployees, type AttendanceStatus, type Employee } from './data/mockData'

const departments: Employee['department'][] = [
  'Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'HR', 'Finance',
]
const statuses: AttendanceStatus[] = ['Present', 'Late', 'Absent', 'Leave', 'Remote']

const palette = ['#3b6cf3', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6366f1']

function makeAvatar(name: string, color: string) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='${color}'/><text x='50%' y='54%' text-anchor='middle' font-family='Inter, Arial' font-size='24' font-weight='600' fill='white' dominant-baseline='middle'>${initials}</text></svg>`,
  )}`
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = window.localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
  })

  const [employeeList, setEmployeeList] = useState<Employee[]>(initialEmployees)

  const [query, setQuery] = useState('')
  const [topQuery, setTopQuery] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [status, setStatus] = useState('All statuses')
  const [range, setRange] = useState('Today')

  // Modal/dialog state
  const [addOpen, setAddOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [drawerEmp, setDrawerEmp] = useState<Employee | null>(null)
  const [confirmAbsent, setConfirmAbsent] = useState<Employee | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = (title: string, opts?: { description?: string; variant?: ToastVariant }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, title, description: opts?.description, variant: opts?.variant ?? 'info' }])
  }
  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const root = document.documentElement
    const apply = (t: Theme) => {
      const isDark =
        t === 'dark' ||
        (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      root.classList.toggle('dark', isDark)
    }
    apply(theme)
    window.localStorage.setItem('theme', theme)
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => apply('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  const changeTheme = (t: Theme) => setTheme(t)

  const effectiveQuery = (query || topQuery).trim().toLowerCase()
  const filtered = useMemo(() => {
    return employeeList.filter((e) => {
      const matchesQuery =
        !effectiveQuery ||
        [e.name, e.email, e.id, e.role, e.department].some((f) =>
          f.toLowerCase().includes(effectiveQuery),
        )
      const matchesDept = department === 'All departments' || e.department === department
      const matchesStatus = status === 'All statuses' || e.status === status
      return matchesQuery && matchesDept && matchesStatus
    })
  }, [employeeList, effectiveQuery, department, status])

  const totals = useMemo(() => {
    const all = employeeList
    return {
      total: all.length,
      present: all.filter((e) => e.status === 'Present' || e.status === 'Remote').length,
      late: all.filter((e) => e.status === 'Late').length,
      absent: all.filter((e) => e.status === 'Absent').length,
      leave: all.filter((e) => e.status === 'Leave').length,
    }
  }, [employeeList])

  const handleNavigate = (p: Page) => setPage(p)

  const handleAddEmployee = (data: {
    name: string
    email: string
    department: Employee['department']
    role: string
  }) => {
    const id = `EMP-${String(1042 + employeeList.length).padStart(4, '0')}`
    const newEmp: Employee = {
      id,
      name: data.name,
      email: data.email,
      department: data.department,
      role: data.role,
      status: 'Present',
      checkIn: '09:00',
      checkOut: null,
      hours: 0,
      attendanceRate: 100,
      avatar: makeAvatar(data.name, palette[employeeList.length % palette.length]),
    }
    setEmployeeList((prev) => [newEmp, ...prev])
    notify('Employee added', { description: `${data.name} (${id}) is now active`, variant: 'success' })
  }

  const handleExport = () => {
    notify('Export started', {
      description: `${filtered.length} rows exporting as CSV`,
      variant: 'success',
    })
  }

  const handleMessage = (emp: Employee) => {
    notify('Message sent', { description: `Direct message delivered to ${emp.name}`, variant: 'success' })
  }

  const handleMarkAbsent = (emp: Employee) => {
    setEmployeeList((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: 'Absent', checkIn: null, checkOut: null, hours: 0 } : e)),
    )
    notify('Marked absent', { description: `${emp.name} marked as absent today`, variant: 'warning' })
  }

  return (
    <div className="min-h-screen flex bg-[#f7f8fb]">
      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        onHelp={() => setHelpOpen(true)}
        onSignOut={() => setSignOutOpen(true)}
        onSeePlans={() => setPlansOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          search={topQuery}
          onSearch={setTopQuery}
          onNewEntry={() => setAddOpen(true)}
          onProfile={() => setProfileOpen(true)}
          onSettings={() => setPage('settings')}
          onHelp={() => setHelpOpen(true)}
          onSignOut={() => setSignOutOpen(true)}
          theme={theme}
          onThemeChange={changeTheme}
          onNotify={(title) => notify(title, { variant: 'info' })}
        />

        <main className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          {page === 'dashboard' && (
            <DashboardView
              totals={totals}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              department={department}
              setDepartment={setDepartment}
              status={status}
              setStatus={setStatus}
              range={range}
              setRange={setRange}
              onExport={handleExport}
              onAdd={() => setAddOpen(true)}
              onView={(e) => setDrawerEmp(e)}
              onEdit={() => setDrawerEmp(null)}
              onMessage={handleMessage}
              onMarkAbsent={(e) => setConfirmAbsent(e)}
              onViewFullReport={() => handleNavigate('reports')}
            />
          )}

          {page === 'employees' && (
            <PageShell title="Employees" subtitle="Browse, search, and manage your full team roster.">
              <Filters
                query={query}
                onQuery={setQuery}
                department={department}
                onDepartment={setDepartment}
                status={status}
                onStatus={setStatus}
                range={range}
                onRange={setRange}
                departments={departments}
                statuses={statuses}
                onExport={handleExport}
              />
              <EmployeeTable
                rows={filtered}
                onAdd={() => setAddOpen(true)}
                onView={(e) => setDrawerEmp(e)}
                onEdit={() => {}}
                onMessage={handleMessage}
                onMarkAbsent={(e) => setConfirmAbsent(e)}
              />
            </PageShell>
          )}

          {page === 'attendance' && (
            <PageShell
              title="Attendance"
              subtitle="Today's check-ins, late arrivals, and live attendance trends."
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                <KPICard label="Total" value={String(totals.total)} delta={2.4} icon={Users} accent="blue" />
                <KPICard label="Present" value={String(totals.present)} delta={1.8} icon={UserCheck} accent="green" />
                <KPICard label="Late" value={String(totals.late)} delta={-3.2} icon={Clock3} accent="amber" />
                <KPICard label="Absent" value={String(totals.absent)} delta={0.6} icon={UserX} accent="rose" />
                <KPICard label="On leave" value={String(totals.leave)} delta={-1.1} icon={Plane} accent="violet" />
              </div>
              <AttendanceTrendChart />
              <DepartmentChart />
            </PageShell>
          )}

          {page === 'reports' && (
            <PageShell title="Reports" subtitle="Monthly performance, attendance, and time-off summaries.">
              <MonthlyReport />
              <PunctualityChart />
            </PageShell>
          )}

          {page === 'settings' && (
            <PageShell title="Settings" subtitle="Configure your workspace, work hours, and notifications.">
              <SettingsPage
                onSave={() => notify('Settings saved', { variant: 'success' })}
                theme={theme}
                onThemeChange={changeTheme}
              />
            </PageShell>
          )}

          <footer className="pt-2 pb-6 text-center text-xs text-slate-400">
            © 2026 Attendly · v2.4.1 · All times shown in your local timezone
          </footer>
        </main>
      </div>

      <Toasts toasts={toasts} onDismiss={dismiss} />

      <AddEmployeeModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleAddEmployee} />
      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onContact={() => notify('Support request sent', { variant: 'success' })}
      />
      <PlansModal
        open={plansOpen}
        onClose={() => setPlansOpen(false)}
        onSelect={(plan) => {
          setPlansOpen(false)
          notify(`Selected ${plan} plan`, {
            description: 'Billing details have been emailed to you',
            variant: 'success',
          })
        }}
      />
      <ConfirmDialog
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={() => notify('Signed out', { description: 'You have been logged out', variant: 'info' })}
        title="Sign out of Attendly?"
        description="You'll need to sign back in to continue managing the workspace."
        confirmLabel="Sign out"
        destructive
      />
      <ConfirmDialog
        open={!!confirmAbsent}
        onClose={() => setConfirmAbsent(null)}
        onConfirm={() => confirmAbsent && handleMarkAbsent(confirmAbsent)}
        title="Mark employee as absent?"
        description={
          confirmAbsent
            ? `This will set today's status for ${confirmAbsent.name} to absent.`
            : ''
        }
        confirmLabel="Mark absent"
        destructive
      />
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="My profile"
        description="Your account information at Attendly."
      >
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 grid place-items-center text-white text-lg font-semibold">
            DM
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-slate-900">Dana Mitchell</div>
            <div className="text-sm text-slate-500">HR Admin · Acme Co.</div>
            <div className="text-xs text-slate-500 mt-0.5">dana.mitchell@acme.co</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Member since" value="Jan 2024" />
          <Stat label="Last sign-in" value="2 hours ago" />
          <Stat label="Workspace role" value="Admin" />
          <Stat label="2FA" value="Enabled" />
        </div>
      </Modal>

      <EmployeeDrawer
        employee={drawerEmp}
        onClose={() => setDrawerEmp(null)}
        onEdit={() => setDrawerEmp(null)}
      />
    </div>
  )
}


function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-900 mt-0.5">{value}</div>
    </div>
  )
}

function PageShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </>
  )
}

type DashViewProps = {
  totals: { total: number; present: number; late: number; absent: number; leave: number }
  filtered: Employee[]
  query: string
  setQuery: (v: string) => void
  department: string
  setDepartment: (v: string) => void
  status: string
  setStatus: (v: string) => void
  range: string
  setRange: (v: string) => void
  onExport: () => void
  onAdd: () => void
  onView: (e: Employee) => void
  onEdit: (e: Employee) => void
  onMessage: (e: Employee) => void
  onMarkAbsent: (e: Employee) => void
  onViewFullReport: () => void
}

function DashboardView(p: DashViewProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">
            Attendance overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time view of your workforce on{' '}
            <span className="font-medium text-slate-700">Friday, April 26, 2026</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 font-medium ring-1 ring-inset ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <span>Updated a moment ago</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard label="Total employees" value={String(p.totals.total)} delta={2.4} icon={Users} accent="blue" caption="Active across 7 departments" />
        <KPICard label="Present today" value={String(p.totals.present)} delta={1.8} icon={UserCheck} accent="green" caption={`${Math.round((p.totals.present / Math.max(p.totals.total, 1)) * 100)}% attendance rate`} />
        <KPICard label="Late arrivals" value={String(p.totals.late)} delta={-3.2} icon={Clock3} accent="amber" caption="Avg 12 min behind schedule" />
        <KPICard label="Absent" value={String(p.totals.absent)} delta={0.6} icon={UserX} accent="rose" caption="Unplanned absences only" />
        <KPICard label="On leave" value={String(p.totals.leave)} delta={-1.1} icon={Plane} accent="violet" caption="Approved time off" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <AttendanceTrendChart />
        </div>
        <PunctualityChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <DepartmentChart />
        <MonthlyReport
          onViewFullReport={p.onViewFullReport}
          onRangeChange={() => {}}
        />
      </div>

      <Filters
        query={p.query}
        onQuery={p.setQuery}
        department={p.department}
        onDepartment={p.setDepartment}
        status={p.status}
        onStatus={p.setStatus}
        range={p.range}
        onRange={p.setRange}
        departments={departments}
        statuses={statuses}
        onExport={p.onExport}
      />

      <EmployeeTable
        rows={p.filtered}
        onAdd={p.onAdd}
        onView={p.onView}
        onEdit={p.onEdit}
        onMessage={p.onMessage}
        onMarkAbsent={p.onMarkAbsent}
      />
    </>
  )
}
