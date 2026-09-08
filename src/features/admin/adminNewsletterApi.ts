import { apiRequest, USE_BACKEND } from '../../lib/api'
import type {
  NewsletterAudience,
  NewsletterCampaign,
  NewsletterStats,
  NewsletterStatus,
  NewsletterSubscriber,
} from '../../types'

const STORAGE_KEY = 'falkco_newsletter_subscribers'

const mockSeed: NewsletterSubscriber[] = [
  {
    id: 1,
    email: 'aissatou.diallo@falkco.test',
    nom: 'Aïssatou Diallo',
    statut: 'actif',
    source: 'site',
    subscribed_at: '2026-08-12T09:24:00Z',
    unsubscribed_at: null,
  },
  {
    id: 2,
    email: 'mamadou.sow@falkco.test',
    nom: 'Mamadou Sow',
    statut: 'actif',
    source: 'site',
    subscribed_at: '2026-08-19T14:02:00Z',
    unsubscribed_at: null,
  },
  {
    id: 3,
    email: 'fatou.ndiaye@falkco.test',
    nom: 'Fatou Ndiaye',
    statut: 'desabonne',
    source: 'site',
    subscribed_at: '2026-07-04T10:11:00Z',
    unsubscribed_at: '2026-08-21T08:45:00Z',
  },
  {
    id: 4,
    email: 'contact@entreprise-exemple.com',
    nom: '',
    statut: 'actif',
    source: 'site',
    subscribed_at: '2026-08-28T16:38:00Z',
    unsubscribed_at: null,
  },
]

function readSubscribers(): NewsletterSubscriber[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
    return mockSeed
  }
  return JSON.parse(raw) as NewsletterSubscriber[]
}

function writeSubscribers(subscribers: NewsletterSubscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers))
}

export async function getNewsletterStats(params?: {
  search?: string
  statut?: NewsletterStatus | ''
}): Promise<NewsletterStats> {
  if (USE_BACKEND) {
    const query = new URLSearchParams()
    if (params?.search) query.set('recherche', params.search)
    if (params?.statut) query.set('statut', params.statut)
    const response = await apiRequest<{ data: NewsletterStats }>(
      `/admin/newsletter?${query.toString()}`,
    )
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  let subscribers = readSubscribers()
  const search = params?.search?.trim().toLowerCase()
  if (search) {
    subscribers = subscribers.filter((item) =>
      [item.email, item.nom].filter(Boolean).some((value) => String(value).toLowerCase().includes(search)),
    )
  }
  if (params?.statut) {
    subscribers = subscribers.filter((item) => item.statut === params.statut)
  }
  const all = readSubscribers()
  return {
    total: all.length,
    actifs: all.filter((item) => item.statut === 'actif').length,
    desabonnes: all.filter((item) => item.statut === 'desabonne').length,
    subscribers,
  }
}

export async function updateSubscriberStatus(
  id: number,
  statut: NewsletterStatus,
): Promise<NewsletterSubscriber> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: NewsletterSubscriber }>(
      `/admin/newsletter/${id}/statut`,
      {
        method: 'PATCH',
        body: JSON.stringify({ statut }),
      },
    )
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const subscribers = readSubscribers()
  const updated = subscribers.map((item) =>
    item.id === id
      ? {
          ...item,
          statut,
          unsubscribed_at:
            statut === 'desabonne' ? new Date().toISOString() : null,
        }
      : item,
  )
  writeSubscribers(updated)
  const subscriber = updated.find((item) => item.id === id)
  if (!subscriber) throw new Error('Abonné introuvable.')
  return subscriber
}

export async function deleteSubscriber(id: number): Promise<void> {
  if (USE_BACKEND) {
    await apiRequest(`/admin/newsletter/${id}`, { method: 'DELETE' })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const subscribers = readSubscribers().filter((item) => item.id !== id)
  writeSubscribers(subscribers)
}

const CAMPAIGNS_KEY = 'falkco_newsletter_campaigns'

function readCampaigns(): NewsletterCampaign[] {
  const raw = localStorage.getItem(CAMPAIGNS_KEY)
  if (!raw) {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify([]))
    return []
  }
  return JSON.parse(raw) as NewsletterCampaign[]
}

function writeCampaigns(campaigns: NewsletterCampaign[]) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns))
}

export type SendCampaignInput = {
  sujet: string
  message: string
  audience: NewsletterAudience
  subscriber_ids?: number[]
}

export type SendCampaignResult = {
  message: string
  campaign: NewsletterCampaign
}

export async function sendNewsletterCampaign(
  input: SendCampaignInput,
): Promise<SendCampaignResult> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ message: string; data: NewsletterCampaign }>(
      '/admin/newsletter/campagnes',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    )
    return { message: response.message, campaign: response.data }
  }

  await new Promise((resolve) => setTimeout(resolve, 400))

  const subscribers = readSubscribers()
  let recipients: NewsletterSubscriber[] = []
  if (input.audience === 'all') recipients = subscribers
  else if (input.audience === 'actifs') {
    recipients = subscribers.filter((item) => item.statut === 'actif')
  } else if (input.audience === 'desabonnes') {
    recipients = subscribers.filter((item) => item.statut === 'desabonne')
  } else if (input.audience === 'selection') {
    const ids = new Set(input.subscriber_ids ?? [])
    recipients = subscribers.filter((item) => ids.has(item.id))
  }

  const campaign: NewsletterCampaign = {
    id: Date.now(),
    sujet: input.sujet,
    message: input.message,
    audience: input.audience,
    statut: recipients.length > 0 ? 'envoyee' : 'echouee',
    destinataires_count: recipients.length,
    envoyee_at: recipients.length > 0 ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
  }

  const campaigns = [campaign, ...readCampaigns()].slice(0, 50)
  writeCampaigns(campaigns)

  return {
    message:
      recipients.length > 0
        ? `Campagne envoyée à ${recipients.length} abonné(s) (mode démo).`
        : 'Aucun destinataire trouvé pour cette audience.',
    campaign,
  }
}

export async function getNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: NewsletterCampaign[] }>('/admin/newsletter/campagnes')
    return response.data
  }
  return readCampaigns()
}
