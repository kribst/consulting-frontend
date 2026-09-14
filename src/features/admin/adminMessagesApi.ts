import { mockMessages } from '../../data/mockMessages'
import { apiRequest, USE_BACKEND } from '../../lib/api'
import type { ContactMessage, ContactMessageStatus } from '../../types'

const STORAGE_KEY = 'falkco_contact_messages'

type ApiCollection<T> = { data: T[] }
type ApiItem<T> = { data: T }

type DashboardStats = {
  nouveau: number
  en_cours: number
  traite: number
  archive: number
  total: number
  recent_messages: ContactMessage[]
}

function readMessages(): ContactMessage[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMessages))
    return mockMessages
  }
  return JSON.parse(raw) as ContactMessage[]
}

function writeMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: DashboardStats }>('/admin/dashboard')
    return response.data
  }
  await new Promise((resolve) => setTimeout(resolve, 300))
  const messages = readMessages()
  return {
    nouveau: messages.filter((message) => message.statut === 'nouveau').length,
    en_cours: messages.filter((message) => message.statut === 'en_cours').length,
    traite: messages.filter((message) => message.statut === 'traite').length,
    archive: messages.filter((message) => message.statut === 'archive').length,
    total: messages.length,
    recent_messages: messages.slice(0, 5),
  }
}

export async function getMessages(params?: { search?: string; status?: string }): Promise<ContactMessage[]> {
  if (USE_BACKEND) {
    const query = new URLSearchParams()
    if (params?.search) query.set('recherche', params.search)
    if (params?.status) query.set('statut', params.status)
    const response = await apiRequest<ApiCollection<ContactMessage>>(`/admin/messages-contact?${query.toString()}`)
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  let messages = readMessages()
  const search = params?.search?.trim().toLowerCase()
  if (search) {
    messages = messages.filter((message) =>
      [message.nom, message.email, message.telephone, message.entreprise, message.service, message.sujet]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search)),
    )
  }
  if (params?.status) {
    messages = messages.filter((message) => message.statut === params.status)
  }
  return messages
}

export async function getMessage(id: number): Promise<ContactMessage> {
  if (USE_BACKEND) {
    const response = await apiRequest<ApiItem<ContactMessage>>(`/admin/messages-contact/${id}`)
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const message = readMessages().find((item) => item.id === id)
  if (!message) throw new Error('Message introuvable.')
  return message
}

export async function updateMessageStatus(id: number, statut: ContactMessageStatus): Promise<ContactMessage> {
  if (USE_BACKEND) {
    const response = await apiRequest<ApiItem<ContactMessage>>(`/admin/messages-contact/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    })
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const messages = readMessages()
  const updated = messages.map((message) =>
    message.id === id ? { ...message, statut, updated_at: new Date().toISOString() } : message,
  )
  writeMessages(updated)
  const message = updated.find((item) => item.id === id)
  if (!message) throw new Error('Message introuvable.')
  return message
}

export async function replyToMessage(id: number, sujet: string, message: string): Promise<{ message: string }> {
  if (!USE_BACKEND) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { message: 'Réponse envoyée en mode démo.' }
  }

  return apiRequest<{ message: string }>(`/admin/messages-contact/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ sujet, message }),
  })
}

export async function deleteMessage(id: number): Promise<void> {
  if (USE_BACKEND) {
    await apiRequest(`/admin/messages-contact/${id}/supprimer`, { method: 'DELETE' })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const messages = readMessages().filter((message) => message.id !== id)
  writeMessages(messages)
}
