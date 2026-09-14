import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Input, Label, Textarea } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/State'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../features/admin/adminTestimonialsApi'
import type { Testimonial } from '../../types'

export function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', role: '', quote: '' })

  async function load() {
    setIsLoading(true)
    setError('')
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les témoignages.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function resetForm() {
    setForm({ name: '', role: '', quote: '' })
    setEditingId(null)
  }

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id)
    setForm({ name: testimonial.name, role: testimonial.role, quote: testimonial.quote })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccess('')
    setError('')
    try {
      if (editingId) {
        const updated = await updateTestimonial(editingId, form)
        setTestimonials((current) => current.map((item) => (item.id === editingId ? updated : item)))
        setSuccess('Témoignage mis à jour.')
      } else {
        const created = await createTestimonial(form)
        setTestimonials((current) => [created, ...current])
        setSuccess('Témoignage ajouté.')
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.')
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Supprimer ce témoignage ?')
    if (!confirmed) return
    setError('')
    setSuccess('')
    try {
      await deleteTestimonial(id)
      setTestimonials((current) => current.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
      setSuccess('Témoignage supprimé.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.')
    }
  }

  return (
    <>
      <PageMeta title="Témoignages admin" description="Gestion des témoignages FALKAOH CONSULTING." />
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-black text-navy">
            {editingId ? 'Modifier un témoignage' : 'Ajouter un témoignage'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Les témoignages sont limités à 500 caractères pour la citation.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            {success ? <Alert type="success">{success}</Alert> : null}
            {error ? <Alert type="error">{error}</Alert> : null}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nom du client" required />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Fonction / organisation" required />
              </div>
            </div>
            <div>
              <Label htmlFor="quote">Citation</Label>
              <Textarea id="quote" value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} rows={4} required maxLength={500} />
              <p className="mt-2 text-xs text-muted">{form.quote.length}/500 caractères</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!form.name || !form.role || !form.quote}>
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-black text-navy">Liste des témoignages</h3>
          <div className="mt-6">
            {isLoading ? <LoadingState /> : null}
            {!isLoading && error ? <ErrorState message={error} /> : null}
            {!isLoading && !error && testimonials.length === 0 ? (
              <EmptyState title="Aucun témoignage" message="Ajoutez votre premier témoignage à l'aide du formulaire ci-dessus." />
            ) : null}
            {!isLoading && !error && testimonials.length > 0 ? (
              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold text-navy">{testimonial.name}</p>
                        <p className="text-sm text-muted">{testimonial.role}</p>
                        <p className="mt-3 text-sm leading-6 text-ink">"{testimonial.quote}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => startEdit(testimonial)}>Modifier</Button>
                        <Button type="button" variant="danger" onClick={() => handleDelete(testimonial.id)}>Supprimer</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </>
  )
}
