// En prod (Railway), utiliser des chemins relatifs pour que nginx proxy vers le backend.
// En dev local, VITE_API_URL pointe vers http://127.0.0.1:8000/api
export const API_URL = import.meta.env.VITE_API_URL || '/api'
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true'

// Pour les médias : si chemin relatif (/api), media est à /media/
// Si URL absolue (dev), on dérive la base depuis l'URL
const API_BASE = API_URL.startsWith('/') ? '' : API_URL.replace(/\/api\/?$/, '')
export const MEDIA_BASE_URL = API_URL.startsWith('/') ? '/media/' : `${API_BASE}/media/`

export function toMediaUrl(path?: string | null, fallback = '/images/team/placeholder.jpg') {
  if (!path) return fallback
  if (/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|\/)/.test(path)) return path
  return `${MEDIA_BASE_URL}${path}`.replace(/\/+/g, '/')
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const request = (token: string | null) => {
    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')

    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return fetch(`${API_URL}${path}`, { ...options, headers })
  }

  let response = await request(localStorage.getItem('falkco_admin_token'))

  if (response.status === 401 && path !== '/admin/token/refresh') {
    const refreshToken = localStorage.getItem('falkco_admin_refresh_token')
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/admin/token/refresh`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (refreshResponse.ok) {
        const refreshed = (await refreshResponse.json()) as { access: string; refresh?: string }
        localStorage.setItem('falkco_admin_token', refreshed.access)
        if (refreshed.refresh) {
          localStorage.setItem('falkco_admin_refresh_token', refreshed.refresh)
        }
        response = await request(refreshed.access)
      }
    }
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message: unknown }).message)
        : 'Erreur de communication avec le serveur.'
    throw new ApiError(message, response.status, data)
  }

  return data as T
}
