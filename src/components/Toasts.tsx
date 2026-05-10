import { useEffect } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export type ToastVariant = 'success' | 'info' | 'warning'
export type Toast = {
  id: number
  title: string
  description?: string
  variant?: ToastVariant
}

const iconByVariant: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
}
const colorByVariant: Record<ToastVariant, string> = {
  success: 'text-emerald-600',
  info: 'text-brand-600',
  warning: 'text-amber-600',
}

type Props = {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export default function Toasts({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const variant = toast.variant ?? 'info'
  const Icon = iconByVariant[variant]
  const color = colorByVariant[variant]

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3500)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div className="pointer-events-auto rounded-xl bg-white border border-slate-200 shadow-lg p-3 flex items-start gap-3 animate-[slideIn_.2s_ease-out]">
      <Icon className={`h-5 w-5 ${color} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900">{toast.title}</div>
        {toast.description && <div className="text-xs text-slate-500 mt-0.5">{toast.description}</div>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="h-6 w-6 grid place-items-center rounded-md hover:bg-slate-100 text-slate-500"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
