import { FilePenLine, Inbox, LayoutDashboard, LogOut, Mail, Menu, MessageSquareQuote, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useSiteContent } from '../../features/content/SiteContentContext'

const links = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: LayoutDashboard },
  { label: 'Messages', href: '/admin/messages', icon: Inbox },
  { label: 'Lettre d\u2019information', href: '/admin/newsletter', icon: Mail },
  { label: 'Notre équipe', href: '/admin/team', icon: Users },
  { label: 'Témoignages', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Contenu du site', href: '/admin/contenu', icon: FilePenLine },
]

type AdminNavProps = {
  onNavigate?: () => void
  onLogout: () => void
}

function AdminNav({ onNavigate, onLogout }: AdminNavProps) {
  return (
    <nav className="grid gap-2" aria-label="Navigation administration">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.href}
            to={link.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                isActive ? 'bg-white text-navy' : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        )
      })}
      <button
        type="button"
        onClick={onLogout}
        className="focus-ring mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/75 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Déconnexion
      </button>
    </nav>
  )
}

export function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { content } = useSiteContent()
  const { company } = content
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  async function handleLogout() {
    setIsOpen(false)
    await logout()
    navigate('/admin/connexion')
  }

  const mobileDrawer = createPortal(
    <div className={`fixed inset-0 z-[100] lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} role="dialog" aria-modal="true" aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Fermer le menu administration"
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-navy/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute left-0 top-0 flex h-dvh w-[min(88vw,340px)] flex-col bg-navy p-5 text-white shadow-soft transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <img src="/images/consulting_rournd.png" alt={company.logoAlt} className="h-12 w-auto" />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white transition hover:bg-white/10 active:scale-95"
            aria-label="Fermer le menu administration"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Administration</p>
        <div className="mt-5">
          <AdminNav onNavigate={() => setIsOpen(false)} onLogout={handleLogout} />
        </div>
      </aside>
    </div>,
    document.body,
  )

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-navy p-4 text-white lg:hidden">
        <img src="/images/consulting_rournd.png" alt={company.logoAlt} className="h-11 w-auto" />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white transition hover:bg-white/10 active:scale-95"
          aria-label="Ouvrir le menu administration"
          aria-expanded={isOpen}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {mobileDrawer}

      <aside className="hidden border-border bg-navy p-6 text-white lg:sticky lg:top-0 lg:block lg:h-screen">
        <div>
          <img src="/images/consulting_rect.png" alt={company.logoAlt} className="h-20 w-auto" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Administration</p>
        </div>
        <div className="mt-6">
          <AdminNav onLogout={handleLogout} />
        </div>
      </aside>
    </>
  )
}
