import type { NewsletterStatus } from '../../types'

const statusConfig: Record<NewsletterStatus, { label: string; classes: string }> = {
  actif: { label: 'Actif', classes: 'bg-green-50 text-success border-green-200' },
  desabonne: { label: 'Désabonné', classes: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export function NewsletterStatusBadge({ status }: { status: NewsletterStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${config.classes}`}>
      {config.label}
    </span>
  )
}
