import { Menu, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navigationLinks } from '../../data/company'
import { useSiteContent } from '../../features/content/SiteContentContext'
import { ButtonLink } from '../ui/Button'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { content } = useSiteContent()
  const { company } = content

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur transition-all duration-300 ${
        isScrolled ? 'border-border/80 bg-white/95 shadow-sm' : 'border-transparent bg-white/95'
      }`}
    >
      <div
        className={`container-page flex items-center justify-between gap-4 transition-all duration-300 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center ${
          isScrolled ? 'h-16' : 'h-[67px]'
        }`}
      >
        <div className="flex items-center justify-start">
          <NavLink to="/" className="focus-ring group flex shrink-0 items-center rounded-xl" aria-label="Retour à l'accueil FALKAOH CONSULTING">
            <img
              src="/images/consulting.png"
              alt={company.logoAlt}
              style={{ width: "140px", height: "auto", display: "block" }}
              className={`h-10 w-auto transition-all duration-300 group-hover:-translate-y-0.5 ${isScrolled ? 'h-10' : 'h-11'}`}
            />
          </NavLink>
        </div>

        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Navigation principale">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `nav-link relative inline-flex items-center px-3.5 py-0 text-[15px] font-bold uppercase tracking-[0.04em] leading-[67px] transition-all duration-300 focus-visible:outline-none ${
                  isActive ? 'text-[#1d4147]' : 'text-[#2e6061] hover:text-[#1d4147]'
                }`
              }
            >
              <span className="relative z-10">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-2 text-sm font-bold text-navy transition hover:border-[#2e6061]/30 hover:text-deep-blue hover:shadow-sm"
          >
            <Phone className="h-4 w-4 text-[#2e6061]" strokeWidth={2.2} aria-hidden="true" />
            <span>{company.phone}</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="focus-ring ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-navy transition hover:-translate-y-0.5 hover:shadow-card active:scale-95 lg:hidden"
          aria-label="Ouvrir le menu mobile"
          aria-expanded={isOpen}
        >
          <Menu className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  )
}
