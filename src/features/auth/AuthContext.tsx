import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AdminUser } from '../../types'
import { apiRequest, USE_BACKEND } from '../../lib/api'

type AuthContextValue = {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const mockUser: AdminUser = {
  id: 1,
  nom: 'Admin FALKCO',
  email: 'admin@falkco.test',
  role: 'admin',
}

type LoginResponse = {
  token: string
  refresh_token: string
  utilisateur: AdminUser
}

type MeResponse = {
  utilisateur: AdminUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      const localUser = localStorage.getItem('falkco_admin_user')
      const token = localStorage.getItem('falkco_admin_token')

      if (!USE_BACKEND) {
        if (localUser) setUser(JSON.parse(localUser) as AdminUser)
        setIsLoading(false)
        return
      }

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await apiRequest<MeResponse>('/admin/moi')
        setUser(response.utilisateur)
        localStorage.setItem('falkco_admin_user', JSON.stringify(response.utilisateur))
      } catch {
        localStorage.removeItem('falkco_admin_token')
        localStorage.removeItem('falkco_admin_user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrap()
  }, [])

  async function login(email: string, password: string) {
    if (!USE_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 450))
      if (email !== 'admin@falkco.test' || password !== 'password') {
        throw new Error('Identifiants admin incorrects.')
      }
      localStorage.setItem('falkco_admin_user', JSON.stringify(mockUser))
      localStorage.setItem('falkco_admin_token', 'mock-token')
      setUser(mockUser)
      return
    }

    const response = await apiRequest<LoginResponse>('/admin/connexion', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    localStorage.setItem('falkco_admin_token', response.token)
    localStorage.setItem('falkco_admin_refresh_token', response.refresh_token)
    localStorage.setItem('falkco_admin_user', JSON.stringify(response.utilisateur))
    setUser(response.utilisateur)
  }

  async function logout() {
    if (USE_BACKEND && localStorage.getItem('falkco_admin_token')) {
      await apiRequest('/admin/deconnexion', { method: 'POST' }).catch(() => null)
    }
    localStorage.removeItem('falkco_admin_token')
    localStorage.removeItem('falkco_admin_refresh_token')
    localStorage.removeItem('falkco_admin_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
