import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal } from '../../components/motion/Reveal'
import { Card } from '../../components/ui/Card'
import { Input, Label, Select } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/State'
import { getMessages } from '../../features/admin/adminMessagesApi'
import type { ContactMessage, ContactMessageStatus } from '../../types'

const statuses: { label: string; value: '' | ContactMessageStatus }[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Nouveau', value: 'nouveau' },
  { label: 'En cours', value: 'en_cours' },
  { label: 'Traité', value: 'traite' },
  { label: 'Archivé', value: 'archive' },
]

function isStatusValue(value: string | null): value is ContactMessageStatus {
  return value === 'nouveau' || value === 'en_cours' || value === 'traite' || value === 'archive'
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export function AdminMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFromUrl = searchParams.get('statut')
  const initialStatus = isStatusValue(statusFromUrl) ? statusFromUrl : ''
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | ContactMessageStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlStatus = searchParams.get('statut')
    setStatus(isStatusValue(urlStatus) ? urlStatus : '')
  }, [searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(true)
      getMessages({ search, status })
        .then(setMessages)
        .catch((err) => setError(err instanceof Error ? err.message : 'Impossible de charger les messages.'))
        .finally(() => setIsLoading(false))
    }, 200)
    return () => window.clearTimeout(timer)
  }, [search, status])

  const totalLabel = useMemo(() => `${messages.length} message${messages.length > 1 ? 's' : ''}`, [messages.length])
  const activeStatusLabel = statuses.find((item) => item.value === status)?.label

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value
    setStatus(isStatusValue(nextStatus) ? nextStatus : '')
    const nextParams = new URLSearchParams(searchParams)
    if (isStatusValue(nextStatus)) {
      nextParams.set('statut', nextStatus)
    } else {
      nextParams.delete('statut')
    }
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <PageMeta title="Messages admin" description="Gestion des messages de contact FALKAOH CONSULTING." />
      <Reveal>
      <Card className="p-5 sm:p-6 hover:border-gold/40 hover:shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px] lg:items-end">
          <div>
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, email, entreprise, sujet..."
            />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select id="status" value={status} onChange={handleStatusChange}>
              {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <p className="font-medium text-muted">{totalLabel}</p>
          {status ? <span className="rounded-full bg-soft-gold px-3 py-1 text-xs font-bold text-navy">Filtre : {activeStatusLabel}</span> : null}
        </div>
      </Card>
      </Reveal>

      <div className="mt-6">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && messages.length === 0 ? (
          <EmptyState title="Aucun message trouvé" message="Aucun message ne correspond à votre recherche ou filtre." />
        ) : null}
        {!isLoading && !error && messages.length > 0 ? (
          <>
            <Reveal>
            <Card className="hidden overflow-hidden md:block">
              <div className="table-scrollbar overflow-x-auto">
                <table className="min-w-[980px] w-full text-left text-sm">
                  <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-4 py-4">Nom</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Téléphone</th>
                      <th className="px-4 py-4">Entreprise</th>
                      <th className="px-4 py-4">Service</th>
                      <th className="px-4 py-4">Sujet</th>
                      <th className="px-4 py-4">Statut</th>
                      <th className="px-4 py-4">Date</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {messages.map((message) => (
                      <tr key={message.id} className="bg-white transition hover:bg-surface">
                        <td className="px-4 py-4 font-bold text-navy">{message.nom}</td>
                        <td className="px-4 py-4 text-muted">{message.email}</td>
                        <td className="px-4 py-4 text-muted">{message.telephone || '—'}</td>
                        <td className="px-4 py-4 text-muted">{message.entreprise || '—'}</td>
                        <td className="px-4 py-4 text-muted">{message.service || '—'}</td>
                        <td className="px-4 py-4 text-muted">{message.sujet}</td>
                        <td className="px-4 py-4"><StatusBadge status={message.statut} /></td>
                        <td className="px-4 py-4 text-muted">{formatDate(message.created_at)}</td>
                        <td className="px-4 py-4">
                          <Link to={`/admin/messages/${message.id}`} className="font-bold text-gold hover:text-navy">Voir</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            </Reveal>

            <div className="grid gap-4 md:hidden">
              {messages.map((message, index) => (
                <Reveal key={message.id} delay={index * 60}>
                <Card className="p-5 hover:border-gold/40 hover:shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-navy">{message.nom}</h2>
                      <p className="mt-1 text-sm text-muted">{message.email}</p>
                    </div>
                    <StatusBadge status={message.statut} />
                  </div>
                  <p className="mt-4 font-bold text-ink">{message.sujet}</p>
                  <dl className="mt-4 grid gap-2 text-sm text-muted">
                    <div><dt className="inline font-bold text-navy">Téléphone : </dt><dd className="inline">{message.telephone || '—'}</dd></div>
                    <div><dt className="inline font-bold text-navy">Entreprise : </dt><dd className="inline">{message.entreprise || '—'}</dd></div>
                    <div><dt className="inline font-bold text-navy">Service : </dt><dd className="inline">{message.service || '—'}</dd></div>
                    <div><dt className="inline font-bold text-navy">Date : </dt><dd className="inline">{formatDate(message.created_at)}</dd></div>
                  </dl>
                  <Link to={`/admin/messages/${message.id}`} className="mt-5 inline-flex font-bold text-gold hover:text-navy">Voir le détail →</Link>
                </Card>
                </Reveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
