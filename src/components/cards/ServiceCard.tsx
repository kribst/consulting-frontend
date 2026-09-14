import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ChartSpline,
  ClipboardCheck,
  ClipboardList,
  FileChartColumn,
  FolderKanban,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Leaf,
  Microscope,
  MonitorSmartphone,
  Presentation,
  Scale,
  Ship,
  Store,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Service } from '../../types'
import { ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'

const serviceIcons: Record<string, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  handshake: Handshake,
  'chart-no-axes-combined': ChartNoAxesCombined,
  'graduation-cap': GraduationCap,
  presentation: Presentation,
  'chart-spline': ChartSpline,
  scale: Scale,
  landmark: Landmark,
  users: Users,
  'users-round': UsersRound,
  'file-chart-column': FileChartColumn,
  'clipboard-list': ClipboardList,
  leaf: Leaf,
  globe: Globe,
  store: Store,
  ship: Ship,
  'building-2': Building2,
  'monitor-smartphone': MonitorSmartphone,
  'clipboard-check': ClipboardCheck,
  'folder-kanban': FolderKanban,
  'book-open': BookOpen,
  microscope: Microscope,
  strategy: BriefcaseBusiness,
  support: Handshake,
  analysis: ChartNoAxesCombined,
  training: GraduationCap,
  event: Presentation,
  growth: ChartSpline,
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = serviceIcons[service.icon] ?? BriefcaseBusiness

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-soft">
     
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="motion-icon grid h-12 w-12 place-items-center rounded-2xl bg-soft-gold text-navy group-hover:bg-gold" aria-hidden="true">
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <h3 className="text-xl font-bold text-navy">
            <Link to={`/services/${service.slug}`} className="transition hover:text-deep-blue">
              {service.title}
            </Link>
          </h3>
        </div>
        <p className="text-sm leading-6 text-muted">{service.summary}</p>
        
        <div className="mt-6">
          <ButtonLink to={`/services/${service.slug}`} variant="outline">
            Voir le détail
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}
