import { Archive, CheckCircle2, Clock3, Mail, MailCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ui/Button'
import { Reveal } from '../../components/motion/Reveal'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Card } from '../../components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/State'
import { PageMeta } from '../../components/ui/PageMeta'
import { getDashboardStats } from '../../features/admin/adminMessagesApi'
import { getNewsletterStats } from '../../features/admin/adminNewsletterApi'
import type { ContactMessage } from '../../types'

type Stats = {
  nouveau: number
  en_cours: number
  traite: number
  archive: number
  total: number
  recent_messages: ContactMessage[]
}

const statCards = [
  { key: 'nouveau', label: 'Nouveaux messages', icon: Mail },
  { key: 'en_cours', label: 'Messages en cours', icon: Clock3 },
  { key: 'traite', label: 'Messages traités', icon: CheckCircle2 },
  { key: 'archive', label: 'Messages archivés', icon: Archive },
] as const

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [newsletterActifs, setNewsletterActifs] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Impossible de charger les statistiques.')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    getNewsletterStats()
      .then((data) => {
        if (!cancelled) setNewsletterActifs(data.actifs)
      })
      .catch(() => {
        if (!cancelled) setNewsletterActifs(0)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!stats) return <EmptyState title="Aucune donnée" message="Les statistiques ne sont pas disponibles." />

  return (
    <>
      <PageMeta title="Tableau de bord admin" description="Tableau de bord admin FALKAOH CONSULTING." />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
          <Reveal key={card.key} delay={index * 70}>
          <Link to={`/admin/messages?statut=${card.key}`} className="group block rounded-3xl focus-ring" aria-label={`Voir les ${card.label.toLowerCase()}`}>
            <Card className="h-full p-6 hover:border-gold/40 hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{card.label}</p>
                  <p className="mt-2 text-4xl font-black text-navy">{stats[card.key]}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-gold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Filtrer les messages
                  </p>
                </div>
                <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-soft-gold text-navy group-hover:bg-gold" aria-hidden="true"><Icon className="h-5 w-5" /></span>
              </div>
            </Card>
          </Link>
          </Reveal>
          )
        })}
      </div>

      <Reveal delay={90}>
        <Card className="mt-8 p-6 hover:border-gold/40 hover:shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy">Contenu du site</h2>
              <p className="mt-1 text-sm text-muted">Modifier les textes, services, statistiques, témoignages, contact, maps et SEO.</p>
            </div>
            <ButtonLink to="/admin/contenu" variant="secondary">Gérer le contenu</ButtonLink>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={110}>
        <Link to="/admin/newsletter" className="group mt-6 block rounded-3xl focus-ring" aria-label="Gérer la lettre d’information">
          <Card className="p-6 hover:border-gold/40 hover:shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-soft-gold text-navy group-hover:bg-gold" aria-hidden="true">
                  <MailCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-navy">Lettre d’information</h2>
                  <p className="mt-1 text-sm text-muted">Abonnés actifs, désabonnements et nouveaux inscrits depuis le site public.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-row-reverse">
                <div className="text-right">
                  <p className="text-3xl font-black text-navy">{newsletterActifs ?? '—'}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold opacity-0 transition-opacity duration-200 group-hover:opacity-100">Gérer les abonnés</p>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </Reveal>

      <Reveal delay={120}>
      <Card className="mt-8 p-6 hover:border-gold/40 hover:shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy">Messages récents</h2>
            <p className="mt-1 text-sm text-muted">Dernières demandes reçues via le formulaire public.</p>
          </div>
          <Link to="/admin/messages" className="font-bold text-gold hover:text-navy">Voir tous les messages →</Link>
        </div>

        {stats.recent_messages.length === 0 ? (
          <div className="mt-6"><EmptyState title="Aucun message" message="Aucune demande n’a encore été reçue." /></div>
        ) : (
          <div className="mt-6 grid gap-3">
            {stats.recent_messages.map((message) => (
              <Link
                key={message.id}
                to={`/admin/messages/${message.id}`}
                className="rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-card active:scale-[0.99]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-navy">{message.nom}</p>
                    <p className="mt-1 text-sm text-muted">{message.sujet}</p>
                  </div>
                  <StatusBadge status={message.statut} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
      </Reveal>
    </>
  )
}
