import { apiRequest, USE_BACKEND } from '../../lib/api'
import { mockMessages } from '../../data/mockMessages'
import { getCurrentSiteContent } from '../content/siteContentStorage'
import type { ContactFormValues, ContactMessage } from '../../types'

const STORAGE_KEY = 'falkco_contact_messages'

function readMessages(): ContactMessage[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return mockMessages
  return JSON.parse(raw) as ContactMessage[]
}

function writeMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function initializeMockMessages() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    writeMessages(mockMessages)
  }
}

type StoreMessageResponse = {
  message: string
  data: {
    id: number
    statut: string
  }
}

export async function sendContactMessage(values: ContactFormValues): Promise<StoreMessageResponse> {
  if (USE_BACKEND) {
    return apiRequest<StoreMessageResponse>('/messages-contact', {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        service_id: values.service_id ? Number(values.service_id) : null,
        service: values.service_id
          ? getCurrentSiteContent().services.find((item) => String(item.id) === values.service_id)?.title ?? ''
          : '',
      }),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 600))
  initializeMockMessages()
  const messages = readMessages()
  const service = getCurrentSiteContent().services.find((item) => String(item.id) === values.service_id)
  const newMessage: ContactMessage = {
    id: Math.max(0, ...messages.map((message) => message.id)) + 1,
    nom: values.nom,
    email: values.email,
    telephone: values.telephone || undefined,
    entreprise: values.entreprise || undefined,
    service_id: values.service_id ? Number(values.service_id) : null,
    service: service?.title,
    sujet: values.sujet,
    message: values.message,
    statut: 'nouveau',
    created_at: new Date().toISOString(),
  }
  writeMessages([newMessage, ...messages])
  return {
    message: 'Votre message a été envoyé avec succès.',
    data: { id: newMessage.id, statut: newMessage.statut },
  }
}

export function validateContact(values: ContactFormValues) {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {}
  if (!values.nom.trim()) errors.nom = 'Le nom complet est obligatoire.'
  if (!values.email.trim()) {
    errors.email = 'L’email est obligatoire.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.'
  }
  if (values.telephone && !/^[+\d\s().-]{8,20}$/.test(values.telephone)) {
    errors.telephone = 'Veuillez saisir un numéro de téléphone réaliste.'
  }
  if (!values.sujet.trim()) errors.sujet = 'Le sujet est obligatoire.'
  if (!values.message.trim()) {
    errors.message = 'Le message est obligatoire.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères.'
  }
  return errors
}
