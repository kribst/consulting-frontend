import {
  CheckSquare,
  Mail,
  MailCheck,
  MailMinus,
  Search,
  Send,
  Square,
  Trash2,
  Users,
} from 'lucide-react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Reveal } from '../../components/motion/Reveal'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Label, Select, Textarea } from '../../components/ui/Form'
import { Modal } from '../../components/ui/Modal'
import { NewsletterStatusBadge } from '../../components/ui/NewsletterStatusBadge'
import { PageMeta } from '../../components/ui/PageMeta'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/State'
import {
  deleteSubscriber,
  getNewsletterStats,
  sendNewsletterCampaign,
  updateSubscriberStatus,
} from '../../features/admin/adminNewsletterApi'
import type {
  NewsletterAudience,
  NewsletterStatus,
  NewsletterSubscriber,
} from '../../types'

const statusFilters: { label: string; value: '' | NewsletterStatus }[] = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actifs', value: 'actif' },
  { label: 'Désabonnés', value: 'desabonne' },
]

const audienceOptions: { label: string; value: NewsletterAudience; description: string }[] = [
  {
    label: 'Tous les abonnés',
    value: 'all',
    description: 'Envoie à l\'ensemble de la base, actifs et désabonnés.',
  },
  {
    label: 'Abonnés actifs uniquement',
    value: 'actifs',
    description: 'Recommandé : ne cible que les destinataires en mesure de lire.',
  },
  {
    label: 'Désabonnés uniquement',
    value: 'desabonnes',
    description: 'Utile pour une campagne de réactivation ou un message d\'adieu.',
  },
  {
    label: 'Sélection manuelle',
    value: 'selection',
    description: 'Envoie uniquement aux abonnés cochés dans le tableau.',
  },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(date),
  )
}

function isStatusValue(value: string | null): value is NewsletterStatus {
  return value === 'actif' || value === 'desabonne'
}

export function AdminNewsletterPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | NewsletterStatus>('')
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [stats, setStats] = useState({ total: 0, actifs: 0, desabonnes: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    null,
  )
  const [busyId, setBusyId] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const [isCampaignOpen, setIsCampaignOpen] = useState(false)
  const [campaignAudience, setCampaignAudience] = useState<NewsletterAudience>('selection')
  const [campaignSujet, setCampaignSujet] = useState('')
  const [campaignMessage, setCampaignMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(true)
      setError('')
      getNewsletterStats({ search, statut: status })
        .then((response) => {
          setSubscribers(response.subscribers)
          setStats({ total: response.total, actifs: response.actifs, desabonnes: response.desabonnes })
        })
        .catch((err) =>
          setError(err instanceof Error ? err.message : 'Impossible de charger les abonnés.'),
        )
        .finally(() => setIsLoading(false))
    }, 200)
    return () => window.clearTimeout(timer)
  }, [search, status])

  useEffect(() => {
    setSelectedIds((current) => {
      const visibleIds = new Set(subscribers.map((item) => item.id))
      const next = new Set<number>()
      current.forEach((id) => {
        if (visibleIds.has(id)) next.add(id)
      })
      return next
    })
  }, [subscribers])

  const totalLabel = useMemo(
    () => `${subscribers.length} abonné${subscribers.length > 1 ? 's' : ''}`,
    [subscribers.length],
  )
  const activeStatusLabel = statusFilters.find((item) => item.value === status)?.label
  const allSelected = subscribers.length > 0 && selectedIds.size === subscribers.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const audienceCounts = useMemo(() => {
    const total = stats.total
    return {
      all: total,
      actifs: stats.actifs,
      desabonnes: stats.desabonnes,
      selection: selectedIds.size,
    }
  }, [stats, selectedIds.size])

  function handleStatusFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    setStatus(isStatusValue(value) ? value : '')
  }

  function toggleOne(id: number) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (current.size === subscribers.length) return new Set()
      return new Set(subscribers.map((item) => item.id))
    })
  }

  function selectAll() {
    setSelectedIds(new Set(subscribers.map((item) => item.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function selectAllActifs() {
    setSelectedIds(new Set(subscribers.filter((item) => item.statut === 'actif').map((item) => item.id)))
  }

  async function handleToggleStatus(subscriber: NewsletterSubscriber) {
    const nextStatus: NewsletterStatus =
      subscriber.statut === 'actif' ? 'desabonne' : 'actif'
    setBusyId(subscriber.id)
    try {
      const updated = await updateSubscriberStatus(subscriber.id, nextStatus)
      setSubscribers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setStats((current) => {
        const actifs = subscribers.filter((item) => item.id === updated.id ? updated.statut === 'actif' : item.statut === 'actif').length
        const desabonnes = subscribers.filter((item) => item.id === updated.id ? updated.statut === 'desabonne' : item.statut === 'desabonne').length
        return {
          total: current.total,
          actifs,
          desabonnes,
        }
      })
      setFeedback({
        type: 'success',
        message:
          nextStatus === 'actif'
            ? `${updated.email} a été réabonné.`
            : `${updated.email} a été marqué comme désabonné.`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Action impossible.',
      })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(subscriber: NewsletterSubscriber) {
    const confirmed = window.confirm(
      `Supprimer définitivement ${subscriber.email} de la liste ?`,
    )
    if (!confirmed) return
    setBusyId(subscriber.id)
    try {
      await deleteSubscriber(subscriber.id)
      setSubscribers((current) => current.filter((item) => item.id !== subscriber.id))
      setSelectedIds((current) => {
        if (!current.has(subscriber.id)) return current
        const next = new Set(current)
        next.delete(subscriber.id)
        return next
      })
      setStats((current) => ({
        total: Math.max(0, current.total - 1),
        actifs:
          subscriber.statut === 'actif'
            ? Math.max(0, current.actifs - 1)
            : current.actifs,
        desabonnes:
          subscriber.statut === 'desabonne'
            ? Math.max(0, current.desabonnes - 1)
            : current.desabonnes,
      }))
      setFeedback({ type: 'success', message: `${subscriber.email} a été supprimé.` })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Suppression impossible.',
      })
    } finally {
      setBusyId(null)
    }
  }

  function openCampaign(audience: NewsletterAudience) {
    if (audience === 'selection' && selectedIds.size === 0) {
      setFeedback({
        type: 'error',
        message: 'Sélectionnez au moins un abonné pour utiliser cette audience.',
      })
      return
    }
    if (audience === 'actifs' && stats.actifs === 0) {
      setFeedback({ type: 'error', message: 'Aucun abonné actif à contacter.' })
      return
    }
    if (audience === 'desabonnes' && stats.desabonnes === 0) {
      setFeedback({ type: 'error', message: 'Aucun désabonné à contacter.' })
      return
    }
    if (audience === 'all' && stats.total === 0) {
      setFeedback({ type: 'error', message: 'Aucun abonné à contacter.' })
      return
    }
    setCampaignAudience(audience)
    setCampaignSujet('')
    setCampaignMessage('')
    setIsCampaignOpen(true)
  }

  async function handleSendCampaign() {
    if (!campaignSujet.trim() || !campaignMessage.trim()) {
      setFeedback({ type: 'error', message: 'Le sujet et le message sont obligatoires.' })
      return
    }
    setIsSending(true)
    try {
      const result = await sendNewsletterCampaign({
        sujet: campaignSujet.trim(),
        message: campaignMessage.trim(),
        audience: campaignAudience,
        subscriber_ids: campaignAudience === 'selection' ? Array.from(selectedIds) : undefined,
      })
      setIsCampaignOpen(false)
      setFeedback({ type: 'success', message: result.message })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : "Échec de l'envoi.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const recipientsCount =
    campaignAudience === 'selection'
      ? selectedIds.size
      : campaignAudience === 'all'
        ? stats.total
        : campaignAudience === 'actifs'
          ? stats.actifs
          : stats.desabonnes

  return (
    <>
      <PageMeta
        title="Lettre d’information admin"
        description="Gestion des abonnés à la lettre d’information FALKAOH CONSULTING."
      />

      <Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5 hover:border-gold/40 hover:shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Total abonnés</p>
                <p className="mt-2 text-3xl font-black text-navy">{stats.total}</p>
              </div>
              <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-soft-gold text-navy">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
          <Card className="p-5 hover:border-gold/40 hover:shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Abonnés actifs</p>
                <p className="mt-2 text-3xl font-black text-navy">{stats.actifs}</p>
              </div>
              <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-success">
                <MailCheck className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
          <Card className="p-5 hover:border-gold/40 hover:shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Désabonnés</p>
                <p className="mt-2 text-3xl font-black text-navy">{stats.desabonnes}</p>
              </div>
              <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                <MailMinus className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        </div>
      </Reveal>

      <Reveal delay={90}>
        <Card className="mt-6 p-5 sm:p-6 hover:border-gold/40 hover:shadow-soft">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px] lg:items-end">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Email ou nom..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select id="status" value={status} onChange={handleStatusFilterChange}>
                {statusFilters.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <p className="font-medium text-muted">{totalLabel}</p>
            {status ? (
              <span className="rounded-full bg-soft-gold px-3 py-1 text-xs font-bold text-navy">
                Filtre : {activeStatusLabel}
              </span>
            ) : null}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={120}>
        <Card className="mt-6 p-5 hover:border-gold/40 hover:shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">Envoi d'une campagne</h2>
              <p className="mt-1 text-sm text-muted">
                Sélectionnez une audience pour composer et envoyer un email groupé.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <Users className="h-4 w-4" aria-hidden="true" />
              {selectedIds.size > 0 ? (
                <span className="font-bold text-navy">{selectedIds.size} sélectionné(s)</span>
              ) : (
                <span>Aucune sélection</span>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openCampaign('all')}
              disabled={stats.total === 0}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Tous ({audienceCounts.all})
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => openCampaign('actifs')}
              disabled={audienceCounts.actifs === 0}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Actifs ({audienceCounts.actifs})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCampaign('desabonnes')}
              disabled={audienceCounts.desabonnes === 0}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Désabonnés ({audienceCounts.desabonnes})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCampaign('selection')}
              disabled={audienceCounts.selection === 0}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Sélection ({audienceCounts.selection})
            </Button>
          </div>
          {selectedIds.size > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAllActifs}
                className="focus-ring rounded-full border border-border bg-white px-3 py-1 font-bold text-navy transition hover:border-gold"
              >
                Sélectionner les actifs
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="focus-ring rounded-full border border-border bg-white px-3 py-1 font-bold text-muted transition hover:border-gold hover:text-navy"
              >
                Vider la sélection
              </button>
            </div>
          ) : null}
        </Card>
      </Reveal>

      {feedback ? (
        <div className="mt-6">
          <Alert type={feedback.type}>{feedback.message}</Alert>
        </div>
      ) : null}

      <div className="mt-6">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && subscribers.length === 0 ? (
          <EmptyState
            title="Aucun abonné trouvé"
            message="Aucun abonné ne correspond à votre recherche ou filtre."
          />
        ) : null}
        {!isLoading && !error && subscribers.length > 0 ? (
          <>
            <Reveal>
              <Card className="hidden overflow-hidden md:block">
                <div className="table-scrollbar overflow-x-auto">
                  <table className="min-w-[860px] w-full text-left text-sm">
                    <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="w-12 px-4 py-4">
                          <button
                            type="button"
                            onClick={toggleAllVisible}
                            aria-label={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                            aria-pressed={allSelected}
                            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-border bg-white text-navy transition hover:border-gold"
                          >
                            {allSelected ? (
                              <CheckSquare className="h-4 w-4" aria-hidden="true" />
                            ) : someSelected ? (
                              <span className="block h-3 w-3 rounded-sm bg-gold" aria-hidden="true" />
                            ) : (
                              <Square className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-4">Email</th>
                        <th className="px-4 py-4">Nom</th>
                        <th className="px-4 py-4">Statut</th>
                        <th className="px-4 py-4">Inscrit le</th>
                        <th className="px-4 py-4">Désabonné le</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {subscribers.map((subscriber) => {
                        const isSelected = selectedIds.has(subscriber.id)
                        return (
                          <tr
                            key={subscriber.id}
                            className={`bg-white transition hover:bg-surface ${isSelected ? 'bg-soft-gold/30' : ''}`}
                          >
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => toggleOne(subscriber.id)}
                                aria-label={isSelected ? `Désélectionner ${subscriber.email}` : `Sélectionner ${subscriber.email}`}
                                aria-pressed={isSelected}
                                className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-border bg-white text-navy transition hover:border-gold"
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <Square className="h-4 w-4" aria-hidden="true" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-4 font-bold text-navy">{subscriber.email}</td>
                            <td className="px-4 py-4 text-muted">{subscriber.nom || '—'}</td>
                            <td className="px-4 py-4">
                              <NewsletterStatusBadge status={subscriber.statut} />
                            </td>
                            <td className="px-4 py-4 text-muted">{formatDate(subscriber.subscribed_at)}</td>
                            <td className="px-4 py-4 text-muted">
                              {subscriber.unsubscribed_at
                                ? formatDate(subscriber.unsubscribed_at)
                                : '—'}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant={subscriber.statut === 'actif' ? 'outline' : 'primary'}
                                  onClick={() => handleToggleStatus(subscriber)}
                                  disabled={busyId === subscriber.id}
                                >
                                  {subscriber.statut === 'actif' ? 'Désabonner' : 'Réabonner'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDelete(subscriber)}
                                  disabled={busyId === subscriber.id}
                                  aria-label={`Supprimer ${subscriber.email}`}
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-4 md:hidden">
              {subscribers.map((subscriber, index) => {
                const isSelected = selectedIds.has(subscriber.id)
                return (
                  <Reveal key={subscriber.id} delay={index * 60}>
                    <Card className={`p-5 hover:border-gold/40 hover:shadow-soft ${isSelected ? 'border-gold/50 ring-1 ring-gold/40' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleOne(subscriber.id)}
                            aria-label={isSelected ? `Désélectionner ${subscriber.email}` : `Sélectionner ${subscriber.email}`}
                            aria-pressed={isSelected}
                            className="focus-ring mt-1 grid h-8 w-8 place-items-center rounded-lg border border-border bg-white text-navy transition hover:border-gold"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Square className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                          <div>
                            <h2 className="font-bold text-navy">{subscriber.email}</h2>
                            {subscriber.nom ? (
                              <p className="mt-1 text-sm text-muted">{subscriber.nom}</p>
                            ) : null}
                          </div>
                        </div>
                        <NewsletterStatusBadge status={subscriber.statut} />
                      </div>
                      <dl className="mt-4 grid gap-2 text-sm text-muted">
                        <div>
                          <dt className="inline font-bold text-navy">Inscrit le : </dt>
                          <dd className="inline">{formatDate(subscriber.subscribed_at)}</dd>
                        </div>
                        {subscriber.unsubscribed_at ? (
                          <div>
                            <dt className="inline font-bold text-navy">Désabonné le : </dt>
                            <dd className="inline">{formatDate(subscriber.unsubscribed_at)}</dd>
                          </div>
                        ) : null}
                      </dl>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={subscriber.statut === 'actif' ? 'outline' : 'primary'}
                          onClick={() => handleToggleStatus(subscriber)}
                          disabled={busyId === subscriber.id}
                        >
                          {subscriber.statut === 'actif' ? 'Désabonner' : 'Réabonner'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(subscriber)}
                          disabled={busyId === subscriber.id}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </Card>
                  </Reveal>
                )
              })}
            </div>
          </>
        ) : null}
      </div>

      <Modal
        open={isCampaignOpen}
        onClose={() => (isSending ? null : setIsCampaignOpen(false))}
        title="Envoyer une campagne"
        description="Composez votre message et confirmez l'envoi aux destinataires choisis."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCampaignOpen(false)} disabled={isSending}>
              Annuler
            </Button>
            <Button onClick={handleSendCampaign} disabled={isSending}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSending ? 'Envoi en cours...' : `Envoyer à ${recipientsCount} abonné(s)`}
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div>
            <Label htmlFor="audience">Audience</Label>
            <Select
              id="audience"
              value={campaignAudience}
              onChange={(event) => setCampaignAudience(event.target.value as NewsletterAudience)}
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <p className="mt-2 text-xs text-muted">
              {audienceOptions.find((option) => option.value === campaignAudience)?.description}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
            <p className="font-bold text-navy">Destinataires ciblés</p>
            <p className="mt-1 text-muted">
              {recipientsCount} abonné{recipientsCount > 1 ? 's' : ''} recevront ce message.
            </p>
          </div>
          <div>
            <Label htmlFor="sujet">Sujet de l'email</Label>
            <Input
              id="sujet"
              value={campaignSujet}
              onChange={(event) => setCampaignSujet(event.target.value)}
              placeholder="Ex. : Notre nouvelle étude sectorielle est disponible"
              maxLength={255}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={campaignMessage}
              onChange={(event) => setCampaignMessage(event.target.value)}
              placeholder="Rédigez votre message ici. Il sera envoyé en texte brut à chaque destinataire."
              rows={8}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
