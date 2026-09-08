import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Reveal } from '../../components/motion/Reveal'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ErrorState, LoadingState } from '../../components/ui/State'
import { getMessage, replyToMessage, updateMessageStatus, deleteMessage } from '../../features/admin/adminMessagesApi'
import { Input, Label, Textarea } from '../../components/ui/Form'
import { Modal } from '../../components/ui/Modal'
import type { ContactMessage, ContactMessageStatus } from '../../types'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(date))
}

export function AdminMessageDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const messageId = Number(id)
  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(messageId)) {
      setError('Identifiant de message invalide.')
      setIsLoading(false)
      return
    }
    getMessage(messageId)
      .then(setMessage)
      .catch((err) => setError(err instanceof Error ? err.message : 'Message introuvable.'))
      .finally(() => setIsLoading(false))
  }, [messageId])

  async function changeStatus(status: ContactMessageStatus) {
    if (!message) return
    setIsUpdating(true)
    setSuccess('')
    try {
      const updated = await updateMessageStatus(message.id, status)
      setMessage(updated)
      setSuccess('Le statut du message a été mis à jour.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de modifier le statut.')
    } finally {
      setIsUpdating(false)
    }
  }

  async function removeMessage() {
    if (!message) return
    const confirmed = window.confirm('Supprimer définitivement ce message ?')
    if (!confirmed) return
    setIsUpdating(true)
    setSuccess('')
    setError('')
    try {
      await deleteMessage(message.id)
      navigate('/admin/messages')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer le message.")
      setIsUpdating(false)
    }
  }

  function openReply() {
    setReplySubject(`Re: ${message?.sujet ?? ''}`)
    setReplyBody('')
    setError('')
    setIsReplyOpen(true)
  }

  async function sendReply() {
    if (!message || !replySubject.trim() || !replyBody.trim()) {
      setError('Le sujet et le message sont obligatoires.')
      return
    }
    setIsSendingReply(true)
    setError('')
    try {
      const result = await replyToMessage(message.id, replySubject.trim(), replyBody.trim())
      setIsReplyOpen(false)
      setSuccess(result.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'envoyer la réponse.")
    } finally {
      setIsSendingReply(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (error && !message) return <ErrorState message={error} />
  if (!message) return <ErrorState message="Message introuvable." />

  return (
    <>
      <PageMeta title="Détail du message" description="Détail d’un message de contact FALKAOH CONSULTING." />
      <div className="mb-6">
        <Link to="/admin/messages" className="font-bold text-gold hover:text-navy">← Retour aux messages</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
        <Card className="p-6 hover:border-gold/40 hover:shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Visiteur</p>
              <h1 className="mt-2 text-2xl font-black text-navy">{message.nom}</h1>
            </div>
            <StatusBadge status={message.statut} />
          </div>

          <dl className="mt-6 grid gap-4 text-sm">
            <div><dt className="font-bold text-navy">Email</dt><dd className="mt-1 text-muted"><a href={`mailto:${message.email}`}>{message.email}</a></dd></div>
            <div><dt className="font-bold text-navy">Téléphone</dt><dd className="mt-1 text-muted">{message.telephone ? <a href={`tel:${message.telephone}`}>{message.telephone}</a> : '—'}</dd></div>
            <div><dt className="font-bold text-navy">Entreprise</dt><dd className="mt-1 text-muted">{message.entreprise || '—'}</dd></div>
            <div><dt className="font-bold text-navy">Service demandé</dt><dd className="mt-1 text-muted">{message.service || '—'}</dd></div>
            <div><dt className="font-bold text-navy">Date de réception</dt><dd className="mt-1 text-muted">{formatDate(message.created_at)}</dd></div>
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openReply} className="focus-ring inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-surface active:scale-[0.98]">Répondre par email</button>
            {message.telephone ? <a href={`https://wa.me/${message.telephone.replace(/[^0-9]/g, '')}`} className="focus-ring inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-surface active:scale-[0.98]">WhatsApp</a> : null}
          </div>
        </Card>
        </Reveal>

        <Reveal delay={100}>
        <Card className="p-6 hover:border-gold/40 hover:shadow-soft">
          {success ? <Alert type="success">{success}</Alert> : null}
          {error ? <div className="mt-4"><Alert type="error">{error}</Alert></div> : null}
          <div className="mt-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Sujet</p>
            <h2 className="mt-2 text-2xl font-black text-navy">{message.sujet}</h2>
            <p className="mt-5 whitespace-pre-line rounded-2xl border border-border bg-surface p-5 leading-8 text-ink">{message.message}</p>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-bold text-navy">Modifier le statut</h3>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="button" variant="outline" disabled={isUpdating} onClick={() => changeStatus('en_cours')}>Marquer “En cours”</Button>
              <Button type="button" variant="secondary" disabled={isUpdating} onClick={() => changeStatus('traite')}>Marquer “Traité”</Button>
              <Button type="button" variant="outline" disabled={isUpdating} onClick={() => changeStatus('archive')}>Archiver</Button>
              <Button type="button" variant="danger" disabled={isUpdating} onClick={removeMessage}>Supprimer</Button>
            </div>
          </div>
        </Card>
        </Reveal>
      </div>

      <Modal
        open={isReplyOpen}
        onClose={() => (isSendingReply ? null : setIsReplyOpen(false))}
        title={`Répondre à ${message.email}`}
        description="Votre réponse sera envoyée directement depuis l'application via le SMTP configuré dans Django."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsReplyOpen(false)} disabled={isSendingReply}>Annuler</Button>
            <Button onClick={sendReply} disabled={isSendingReply}>{isSendingReply ? 'Envoi en cours...' : 'Envoyer la réponse'}</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div>
            <Label htmlFor="reply-subject">Sujet</Label>
            <Input id="reply-subject" value={replySubject} onChange={(event) => setReplySubject(event.target.value)} maxLength={255} />
          </div>
          <div>
            <Label htmlFor="reply-message">Message</Label>
            <Textarea id="reply-message" value={replyBody} onChange={(event) => setReplyBody(event.target.value)} rows={10} placeholder="Écrivez votre réponse..." />
          </div>
        </div>
      </Modal>
    </>
  )
}
