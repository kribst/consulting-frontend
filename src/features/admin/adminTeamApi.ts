import { apiRequest, USE_BACKEND } from '../../lib/api'
import type { TeamMember } from '../../types'

const STORAGE_KEY = 'falkco_team'

const mockSeed: TeamMember[] = [
  { id: 1, name: 'NGWE MAYO EMMANUEL', poste: 'Directeur Général', image: '/images/team/placeholder.png' },
  { id: 2, name: 'FOUDA JEAN CLAUDE', poste: 'Directeur des Opérations', image: '/images/team/placeholder.png' },
]

function readTeam(): TeamMember[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
    return mockSeed
  }
  return JSON.parse(raw) as TeamMember[]
}

function writeTeam(members: TeamMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
}

export async function getTeam(): Promise<TeamMember[]> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: TeamMember[] }>('/admin/team')
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  return readTeam()
}

export async function createTeamMember(values: { name: string; poste: string; image?: string }): Promise<TeamMember> {
  if (USE_BACKEND) {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('poste', values.poste)
    if (values.image) {
      formData.append('image', values.image)
    }
    const response = await apiRequest<{ data: TeamMember }>('/admin/team', {
      method: 'POST',
      body: formData as unknown as string,
    })
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const members = readTeam()
  const nextId = members.length > 0 ? Math.max(...members.map((item) => item.id)) + 1 : 1
  const created: TeamMember = { id: nextId, name: values.name, poste: values.poste, image: values.image || '' }
  writeTeam([...members, created])
  return created
}

export async function updateTeamMember(id: number, values: { name?: string; poste?: string; image?: string }): Promise<TeamMember> {
  if (USE_BACKEND) {
    const formData = new FormData()
    if (values.name) formData.append('name', values.name)
    if (values.poste) formData.append('poste', values.poste)
    if (values.image) formData.append('image', values.image)
    const response = await apiRequest<{ data: TeamMember }>(`/admin/team/${id}`, {
      method: 'PUT',
      body: formData as unknown as string,
    })
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const members = readTeam()
  const updated = members.map((item) => (item.id === id ? { ...item, ...values } : item))
  writeTeam(updated)
  const updatedItem = updated.find((item) => item.id === id)
  if (!updatedItem) throw new Error('Membre introuvable.')
  return updatedItem
}

export async function deleteTeamMember(id: number): Promise<void> {
  if (USE_BACKEND) {
    await apiRequest(`/admin/team/${id}`, { method: 'DELETE' })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const members = readTeam().filter((item) => item.id !== id)
  writeTeam(members)
}
