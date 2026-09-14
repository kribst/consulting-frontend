export type ServiceSlug = string

export type Service = {
  id: number
  title: string
  slug: ServiceSlug
  icon: string
  summary: string
  description: string
  image: string
  imageAlt: string
  keyPoints: string[]
  includes: string[]
  audience: string[]
  benefits: string[]
  useCases: string[]
  process: string[]
  relatedSlugs: ServiceSlug[]
}

export type Statistic = {
  label: string
  value: string
  description: string
}

export type Testimonial = {
  id: number
  name: string
  role: string
  quote: string
}


export type SocialLink = {
  label: string
  href: string
  type: string
}

export type CompanyInfo = {
  name: string
  shortName: string
  title: string
  slogan: string
  secondarySlogan: string
  description: string
  logo: string
  logoLight: string
  logoAlt: string
  phone: string
  phoneHref: string
  whatsapp: string
  whatsappHref: string
  email: string
  emailHref: string
  address: string
  openingHours: string
  website: string
  mapsUrl: string
  mapsEmbedUrl: string
  socialLinks: SocialLink[]
  heroImage: string
  heroImageAlt: string
  officeImage: string
  officeImageAlt: string
}

export type ProcessStep = {
  title: string
  description: string
}

export type SeoSettings = {
  siteUrl: string
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  keywords: string
  ogImage: string
  robots: string
  locale: string
  businessType: string
}

export type SiteContent = {
  company: CompanyInfo
  services: Service[]
  statistics: Statistic[]
  testimonials: Testimonial[]
  processSteps: ProcessStep[]
  seo: SeoSettings
}

export type TeamMember = {
  id: number
  name: string
  poste: string
  image: string
  image_url?: string | null
}

export type ContactMessageStatus = 'nouveau' | 'en_cours' | 'traite' | 'archive'

export type ContactMessage = {
  id: number
  nom: string
  email: string
  telephone?: string
  entreprise?: string
  service_id?: number | null
  service?: string
  sujet: string
  message: string
  statut: ContactMessageStatus
  created_at: string
  updated_at?: string
}

export type ContactFormValues = {
  nom: string
  email: string
  telephone: string
  entreprise: string
  service_id: string
  sujet: string
  message: string
}

export type AdminUser = {
  id: number
  nom: string
  email: string
  role: 'admin'
}

export type NewsletterStatus = 'actif' | 'desabonne'

export type NewsletterSubscriber = {
  id: number
  email: string
  nom: string
  statut: NewsletterStatus
  source: string
  subscribed_at: string
  unsubscribed_at: string | null
}

export type NewsletterStats = {
  total: number
  actifs: number
  desabonnes: number
  subscribers: NewsletterSubscriber[]
}

export type NewsletterAudience = 'all' | 'actifs' | 'desabonnes' | 'selection'

export type NewsletterCampaign = {
  id: number
  sujet: string
  message: string
  audience: NewsletterAudience
  statut: 'brouillon' | 'envoyee' | 'echouee'
  destinataires_count: number
  envoyee_at: string | null
  created_at: string
}
