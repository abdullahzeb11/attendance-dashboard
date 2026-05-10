import { Check } from 'lucide-react'
import Modal from './Modal'

type Props = { open: boolean; onClose: () => void; onSelect: (plan: string) => void }

const plans = [
  {
    name: 'Starter',
    price: '$0',
    note: 'Up to 10 employees',
    features: ['Daily attendance', 'CSV export', 'Email support'],
    cta: 'Current plan',
    current: true,
  },
  {
    name: 'Pro',
    price: '$8',
    note: 'per employee / month',
    features: ['Unlimited employees', 'Advanced analytics', 'Custom reports', 'Slack & Teams sync'],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: 'Annual billing',
    features: ['SSO & SCIM', 'Dedicated CSM', 'SLA & audit logs', 'On-prem option'],
    cta: 'Contact sales',
  },
]

export default function PlansModal({ open, onClose, onSelect }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a plan" description="Upgrade anytime, prorated billing." size="lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={[
              'rounded-xl border p-4 flex flex-col',
              p.highlight ? 'border-brand-500 ring-1 ring-brand-500/30 bg-brand-50/30' : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">{p.name}</div>
              {p.highlight && (
                <span className="text-[10px] font-medium uppercase tracking-wide text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-slate-900">{p.price}</span>
              {p.price !== 'Custom' && <span className="text-xs text-slate-500">/mo</span>}
            </div>
            <div className="text-xs text-slate-500">{p.note}</div>
            <ul className="mt-3 space-y-1.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={p.current}
              onClick={() => onSelect(p.name)}
              className={[
                'mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors',
                p.current
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : p.highlight
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700',
              ].join(' ')}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
