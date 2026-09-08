import { useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

const titles: Record<string, string> = {
  '/admin/tableau-de-bord': 'Tableau de bord',
  '/admin/messages': 'Messages de contact',
  '/admin/newsletter': 'Lettre d’information',
  '/admin/contenu': 'Contenu du site',
}

export function AdminTopbar() {
  const { user } = useAuth()
  const location = useLocation()
  const title = titles[location.pathname] ?? 'Administration FALKCO'

  return (
    <header className="border-b border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Espace admin</p>
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
        </div>
        <div className="rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-muted">
          Connecté : <span className="font-bold text-navy">{user?.nom}</span>
        </div>
      </div>
    </header>
  )
}
