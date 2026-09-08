import { company } from '../../data/company'
import { processSteps } from '../../data/processSteps'
import { services } from '../../data/services'
import { statistics } from '../../data/statistics'
import { testimonials } from '../../data/testimonials'
import type { SeoSettings, SiteContent } from '../../types'

export const defaultSeo: SeoSettings = {
  siteUrl: 'https://www.falkco.com',
  defaultTitle: 'FALKAOH CONSULTING — Conseil, accompagnement et performance',
  titleTemplate: '%s | FALKAOH CONSULTING',
  defaultDescription:
    'FALKAOH CONSULTING, cabinet de conseil spécialisé en conseil en gestion, accompagnement d’entreprise, études, formations professionnelles et performance organisationnelle.',
  keywords:
    'cabinet de conseil à Yaoundé, conseil en gestion, accompagnement d’entreprise, étude de marché, étude de faisabilité, formations professionnelles, événementiel professionnel, performance organisationnelle, FALKAOH CONSULTING',
  ogImage: '/images/hero-consulting-illustration.svg',
  robots: 'index, follow',
  locale: 'fr_MA',
  businessType: 'ProfessionalService',
}

export const defaultSiteContent: SiteContent = {
  company,
  services,
  statistics,
  testimonials,
  processSteps,
  seo: defaultSeo,
}
