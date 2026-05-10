import { Search, BookOpen, MessageSquare, Mail } from 'lucide-react'
import Modal from './Modal'

type Props = { open: boolean; onClose: () => void; onContact: () => void }

const articles = [
  { title: 'Getting started with Attendly', tag: 'Onboarding' },
  { title: 'Setting up shift schedules', tag: 'Schedules' },
  { title: 'Configuring leave policies', tag: 'Leave' },
  { title: 'Exporting attendance reports', tag: 'Reports' },
  { title: 'Single sign-on (SSO) setup', tag: 'Security' },
]

export default function HelpModal({ open, onClose, onContact }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Help center" description="Search docs or get in touch with our team." size="lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Search articles, e.g. 'leave policy'…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <Quick icon={BookOpen} title="Browse docs" detail="120+ articles" />
        <Quick icon={MessageSquare} title="Live chat" detail="Avg reply 2 min" onClick={onContact} />
        <Quick icon={Mail} title="Email support" detail="support@attendly.app" onClick={onContact} />
      </div>

      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
          Popular articles
        </div>
        <ul className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {articles.map((a) => (
            <li
              key={a.title}
              className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer"
            >
              <span className="text-slate-800">{a.title}</span>
              <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">{a.tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}

function Quick({
  icon: Icon,
  title,
  detail,
  onClick,
}: {
  icon: typeof BookOpen
  title: string
  detail: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border border-slate-200 p-3 hover:border-brand-300 hover:bg-brand-50/30 transition-colors"
    >
      <Icon className="h-4 w-4 text-brand-600" />
      <div className="text-sm font-medium text-slate-900 mt-2">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{detail}</div>
    </button>
  )
}
