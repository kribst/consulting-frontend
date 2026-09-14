import type { ContactMessageStatus } from '../../types'

const statusConfig: Record<ContactMessageStatus, { label: string; classes: string }> = {
  nouveau: { label: 'Nouveau', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  en_cours: { label: 'En cours', classes: 'bg-amber-50 text-warning border-amber-200' },
  traite: { label: 'Traité', classes: 'bg-green-50 text-success border-green-200' },
  archive: { label: 'Archivé', classes: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export function StatusBadge({ status }: { status: ContactMessageStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${config.classes}`}>
      {config.label}
    </span>
  )
}

export const statusLabels = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  archive: 'Archivé',
} satisfies Record<ContactMessageStatus, string>
