import { CalendarDays, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPublicationDate, formatPublicationTime } from '../../lib/publicationDate'
import type { Actualite } from '../../types'
import { ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'

export function PublicationMeta({ actualite, className = '' }: { actualite: Actualite; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted ${className}`}>
      <span className="inline-flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gold" strokeWidth={2.2} aria-hidden="true" />
        <span>
          Publié le <span className="text-navy">{formatPublicationDate(actualite.datePublication)}</span>
        </span>
      </span>
      <span className="inline-flex items-center gap-2">
        <Clock className="h-4 w-4 text-gold" strokeWidth={2.2} aria-hidden="true" />
        <span>
          À <span className="text-navy">{formatPublicationTime(actualite.heurePublication)}</span>
        </span>
      </span>
    </div>
  )
}

export function ActualiteCard({ actualite }: { actualite: Actualite }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-soft">
      <div className="overflow-hidden">
        <img
          src={actualite.image}
          alt={actualite.imageAlt}
          className="animate-image-mask aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold">{actualite.category}</p>

        <h3 className="mt-3 text-xl font-bold text-navy">
          <Link to={`/actualite/${actualite.slug}`} className="transition hover:text-deep-blue">
            {actualite.title}
          </Link>
        </h3>

        <PublicationMeta actualite={actualite} className="mt-4" />

        <p className="mt-4 text-sm leading-6 text-muted">{actualite.summary}</p>

        <div className="mt-auto pt-6">
          <ButtonLink to={`/actualite/${actualite.slug}`} variant="outline">
            Lire la suite
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}