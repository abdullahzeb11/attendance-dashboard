import { useState, useEffect } from 'react'
import Modal from './Modal'
import type { Employee } from '../data/mockData'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (emp: Omit<Employee, 'id' | 'avatar' | 'attendanceRate' | 'hours' | 'checkIn' | 'checkOut' | 'status'>) => void
}

const departments: Employee['department'][] = [
  'Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'HR', 'Finance',
]

export default function AddEmployeeModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState<Employee['department']>('Engineering')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setEmail('')
      setDepartment('Engineering')
      setRole('')
    }
  }, [open])

  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && role.trim().length > 1

  const submit = () => {
    if (!valid) return
    onCreate({ name: name.trim(), email: email.trim(), department, role: role.trim() })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add employee"
      description="Create a new team member record. They'll appear in the table immediately."
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className="px-3 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add employee
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riley Chen"
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="riley.chen@acme.co"
            className="input"
          />
        </Field>
        <Field label="Department">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as Employee['department'])}
            className="input"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Role / title">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Engineer"
            className="input"
          />
        </Field>
      </div>
      <style>{`.input{width:100%;border:1px solid #e2e8f0;background:#fff;border-radius:8px;padding:8px 10px;font-size:13px;outline:none;transition:.15s}
.input:focus{border-color:#3b6cf3;box-shadow:0 0 0 3px rgba(59,108,243,.18)}`}</style>
    </Modal>
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
