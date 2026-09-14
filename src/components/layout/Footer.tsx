import { ExternalLink, Facebook, Globe2, Instagram, Linkedin, MapPin, Phone, Twitter, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { navigationLinks } from '../../data/company'
import { useSiteContent } from '../../features/content/SiteContentContext'

const socialIcons = {
  linkedin: Linkedin,
  website: Globe2,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
}

export function Footer() {
  const { content } = useSiteContent()
  const { company, services } = content

  return (
    <footer className="bg-white text-navy">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_1fr_1fr]">
          <div>
            <a href="/" rel="noreferrer">
            <img src={company.logoLight} alt={company.logoAlt} className="h-95 w-auto" />
             </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-navy/70"
            style={{ fontSize: '14px', fontWeight: 500 }}
            >{company.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {company.socialLinks.map((social) => {
                const Icon = socialIcons[social.type as keyof typeof socialIcons] ?? ExternalLink
                return (
                  <a
                    key={`${social.label}-${social.href}`}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-xl border border-navy/15 px-3 py-2 text-sm font-semibold text-navy/80 transition hover:-translate-y-0.5 hover:bg-navy/10"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {social.label}
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold"
            style={{ fontSize: '14px', fontWeight: 800 }}
            >Navigation</h2>
            <ul className="mt-4 space-y-3 text-sm text-navy/70"
            style={{ fontSize: '14px', fontWeight: 500 }}
            >
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold"
            style={{ fontSize: '14px', fontWeight: 800 }}
            >Services</h2>
            <ul className="mt-4 space-y-3 text-sm text-navy/70"
            style={{ fontSize: '14px', fontWeight: 500 }}
            >
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className="inline-flex items-start gap-2 transition hover:text-[#0d7d7f] no-global-hover">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold"
            style={{ fontSize: '14px', fontWeight: 800 }}
            >Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-navy/70"
            style={{ fontSize: '14px', fontWeight: 500 }}
            >
              <li>
                <a href={company.phoneHref} className="inline-flex items-start gap-2 transition hover:text-[#0d7d7f] no-global-hover">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li><a href={company.emailHref} className="inline-flex items-start gap-2 transition hover:text-[#0d7d7f] no-global-hover">{company.email}</a></li>
              <li>
                <a href={company.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 transition hover:text-[#0d7d7f] no-global-hover">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{company.address}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2 transition hover:text-[#0d7d7f] no-global-hover">{company.openingHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy/10 pt-6 text-sm text-navy/60 ">
          © {new Date().getFullYear()} FALKAOH DIGITAL. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
