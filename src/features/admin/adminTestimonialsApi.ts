import { apiRequest, USE_BACKEND } from '../../lib/api'
import type { Testimonial } from '../../types'

const STORAGE_KEY = 'falkco_testimonials'

const mockSeed: Testimonial[] = [
  {
    id: 1,
    name: 'Directeur général',
    role: 'PME à Yaoundé',
    quote: 'FALKCO nous a aidés à clarifier nos priorités de gestion et à structurer un plan d\u2019action réaliste.',
  },
  {
    id: 2,
    name: 'Porteuse de projet',
    role: 'Entrepreneuriat',
    quote: 'L\u2019accompagnement a été sérieux, progressif et adapté. Nous avons gagné en visibilité.',
  },
  {
    id: 3,
    name: 'Responsable formation',
    role: 'Organisation professionnelle',
    quote: 'La formation était pratique, claire et directement liée aux besoins de nos équipes.',
  },
]

function readTestimonials(): Testimonial[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
    return mockSeed
  }
  return JSON.parse(raw) as Testimonial[]
}

function writeTestimonials(testimonials: Testimonial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials))
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: Testimonial[] }>('/admin/testimonials')
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  return readTestimonials()
}

export async function createTestimonial(values: { name: string; role: string; quote: string }): Promise<Testimonial> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: Testimonial }>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const testimonials = readTestimonials()
  const nextId = testimonials.length > 0 ? Math.max(...testimonials.map((item) => item.id)) + 1 : 1
  const created: Testimonial = { id: nextId, ...values }
  writeTestimonials([...testimonials, created])
  return created
}

export async function updateTestimonial(id: number, values: { name?: string; role?: string; quote?: string }): Promise<Testimonial> {
  if (USE_BACKEND) {
    const response = await apiRequest<{ data: Testimonial }>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    })
    return response.data
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const testimonials = readTestimonials()
  const updated = testimonials.map((item) => (item.id === id ? { ...item, ...values } : item))
  writeTestimonials(updated)
  const updatedItem = updated.find((item) => item.id === id)
  if (!updatedItem) throw new Error('Témoignage introuvable.')
  return updatedItem
}

export async function deleteTestimonial(id: number): Promise<void> {
  if (USE_BACKEND) {
    await apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' })
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const testimonials = readTestimonials().filter((item) => item.id !== id)
  writeTestimonials(testimonials)
}
