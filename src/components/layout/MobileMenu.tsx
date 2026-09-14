import { Phone, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { navigationLinks } from '../../data/company'
import { useSiteContent } from '../../features/content/SiteContentContext'
import { ButtonLink } from '../ui/Button'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { content } = useSiteContent()
  const { company } = content

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const menu = (
    <div
      className={`fixed inset-0 z-[100] lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-navy/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Fermer le menu"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />
      <div
        className={`absolute right-0 top-0 flex h-dvh w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-soft transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <img src={company.logo} alt={company.logoAlt} className="h-12 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-border text-navy transition hover:-translate-y-0.5 hover:bg-surface active:scale-95"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-7 grid gap-2" aria-label="Navigation mobile">
          {navigationLinks.map((link, index) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${80 + index * 45}ms` : '0ms' }}
              className={({ isActive }) =>
                `nav-link relative px-4 py-3 text-[15px] font-bold uppercase tracking-[0.04em] text-[#2e6061] transition-all duration-300 focus-visible:outline-none ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                } ${isActive ? 'text-[#1d4147]' : 'hover:text-[#1d4147]'}`
              }
            >
              <span className="relative z-10">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`mt-auto grid gap-3 pt-8 transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <ButtonLink to="/contact" onClick={onClose} className="w-full">
            Nous contacter
          </ButtonLink>
          <a
            href={company.phoneHref}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:bg-surface active:scale-95"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {company.phone}
          </a>
        </div>
      </div>
    </div>
  )

  return createPortal(menu, document.body)
}
