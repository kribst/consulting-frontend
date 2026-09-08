import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Input, Label } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/State'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../../features/admin/adminTeamApi'
import type { TeamMember } from '../../types'

export function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', poste: '' })
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  async function load() {
    setIsLoading(true)
    setError('')
    try {
      const data = await getTeam()
      setMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger l\'équipe.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function resetForm() {
    setForm({ name: '', poste: '' })
    setEditingId(null)
    setPreviewUrl('')
    setImageFile(null)
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id)
    setForm({ name: member.name, poste: member.poste })
    setPreviewUrl(member.image_url || member.image || '')
    setImageFile(null)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccess('')
    setError('')
    try {
      if (editingId) {
        const updated = await updateTeamMember(editingId, { name: form.name, poste: form.poste })
        setMembers((current) => current.map((item) => (item.id === editingId ? updated : item)))
        setSuccess('Membre mis à jour.')
      } else {
        const created = await createTeamMember({ name: form.name, poste: form.poste })
        setMembers((current) => [created, ...current])
        setSuccess('Membre ajouté.')
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.')
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Supprimer ce membre ?')
    if (!confirmed) return
    setError('')
    setSuccess('')
    try {
      await deleteTeamMember(id)
      setMembers((current) => current.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
      setSuccess('Membre supprimé.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.')
    }
  }

  return (
    <>
      <PageMeta title="Notre équipe - Admin" description="Gestion des membres de l'équipe FALKAOH CONSULTING." />
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-black text-navy flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            {editingId ? 'Modifier un membre' : 'Ajouter un membre'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Gérez les membres de votre équipe pour la page "Qui sommes-nous".
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            {success ? <Alert type="success">{success}</Alert> : null}
            {error ? <Alert type="error">{error}</Alert> : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="NGWE MAYO EMMANUEL"
                  required
                />
              </div>
              <div>
                <Label htmlFor="poste">Poste / Fonction</Label>
                <Input
                  id="poste"
                  value={form.poste}
                  onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))}
                  placeholder="Directeur Général"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Photo (optionnel)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy/90"
              />
              {previewUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-muted">Aperçu :</p>
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!form.name || !form.poste}>
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-black text-navy">Membres de l'équipe</h3>
          <div className="mt-6">
            {isLoading ? <LoadingState /> : null}
            {!isLoading && error && !members.length ? <ErrorState message={error} /> : null}
            {!isLoading && !error && members.length === 0 ? (
              <EmptyState
                title="Aucun membre"
                message="Ajoutez le premier membre de votre équipe à l'aide du formulaire ci-dessus."
              />
            ) : null}
            {!isLoading && members.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="overflow-hidden rounded-2xl border border-border bg-surface"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={member.image_url || member.image || '/images/team/placeholder.png'}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-navy">{member.name}</p>
                      <p className="text-sm text-muted">{member.poste}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => startEdit(member)}
                          className="flex-1 text-xs"
                        >
                          Modifier
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(member.id)}
                          className="flex-1 text-xs"
                        >
                          Supprimer
                        </Button>
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
