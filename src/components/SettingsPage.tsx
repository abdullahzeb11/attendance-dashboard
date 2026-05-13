import { useState } from 'react'
import ThemeSwitcher, { type Theme } from './ThemeSwitcher'

type Props = { onSave: () => void; theme: Theme; onThemeChange: (t: Theme) => void }

export default function SettingsPage({ onSave, theme, onThemeChange }: Props) {
  const [orgName, setOrgName] = useState('Acme Co.')
  const [timezone, setTimezone] = useState('Asia/Riyadh')
  const [workStart, setWorkStart] = useState('09:00')
  const [workEnd, setWorkEnd] = useState('17:30')
  const [graceMinutes, setGraceMinutes] = useState(10)
  const [notifyLate, setNotifyLate] = useState(true)
  const [notifyAbsent, setNotifyAbsent] = useState(true)
  const [requireGeo, setRequireGeo] = useState(false)

  return (
    <div className="space-y-6">
      <Section title="Organization" description="General workspace info shown across the app.">
        <Field label="Organization name">
          <input className="input" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        </Field>
        <Field label="Default timezone">
          <select className="input" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option>Asia/Riyadh</option>
            <option>Asia/Dubai</option>
            <option>Europe/London</option>
            <option>America/New_York</option>
            <option>America/Los_Angeles</option>
          </select>
        </Field>
        <Field label="Theme">
          <div className="flex items-center gap-3">
            <ThemeSwitcher theme={theme} onChange={onThemeChange} />
            <span className="text-xs text-slate-500 capitalize">{theme}</span>
          </div>
        </Field>
      </Section>

      <Section title="Work hours" description="Standard schedule used for attendance calculations.">
        <Field label="Start time">
          <input type="time" className="input" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
        </Field>
        <Field label="End time">
          <input type="time" className="input" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
        </Field>
        <Field label="Late grace period (minutes)">
          <input
            type="number"
            min={0}
            max={60}
            className="input"
            value={graceMinutes}
            onChange={(e) => setGraceMinutes(Number(e.target.value))}
          />
        </Field>
      </Section>

      <Section title="Notifications" description="Email alerts sent to admins.">
        <Toggle label="Notify when an employee is late" checked={notifyLate} onChange={setNotifyLate} />
        <Toggle label="Notify on unplanned absences" checked={notifyAbsent} onChange={setNotifyAbsent} />
        <Toggle label="Require geolocation for check-in" checked={requireGeo} onChange={setRequireGeo} />
      </Section>

      <div className="flex justify-end gap-2">
        <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700">
          Reset
        </button>
        <button
          onClick={onSave}
          className="px-3 py-2 text-sm rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
        >
          Save changes
        </button>
      </div>

      <style>{`.input{width:100%;border:1px solid #e2e8f0;background:#fff;border-radius:8px;padding:8px 10px;font-size:13px;outline:none;transition:.15s}
.input:focus{border-color:#3b6cf3;box-shadow:0 0 0 3px rgba(59,108,243,.18)}`}</style>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer col-span-full sm:col-span-1">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-brand-500' : 'bg-slate-300',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked ? 'left-[18px]' : 'left-0.5',
          ].join(' ')}
        />
      </button>
    </label>
  )
}
