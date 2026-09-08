import { apiRequest, USE_BACKEND } from '../../lib/api'
import type { SiteContent } from '../../types'
import { defaultSiteContent } from './defaultSiteContent'

export const SITE_CONTENT_STORAGE_KEY = 'falkco_site_content_v1'

type SiteContentResponse = {
  data?: Partial<SiteContent> | null
}

function normalizeLegacyBranding(content: Partial<SiteContent>): Partial<SiteContent> {
  const normalized = JSON.parse(JSON.stringify(content)) as Partial<SiteContent>

  const replaceLegacyBrand = (value?: string) => {
    if (!value) return value
    return value
      .replace(/FALKCO\s*(?:Rabat|Yaoundé)/gi, 'FALKCO')
      .replace(/\bRabat\b/gi, 'Yaoundé')
      .replace(/\bMaroc\b/gi, 'Cameroun')
      .replace(/\bMorocco\b/gi, 'Cameroon')
      .replace(/\bMoroccan\b/gi, 'Cameroonian')
      .replace(/\bmoroccan\b/gi, 'cameroonian')
      .replace(/\bmarocain(?:e|s)?\b/gi, 'camerounais')
      .replace(/\bmarocaine\b/gi, 'camerounaise')
      .replace(/\bMoroccans?\b/gi, 'Cameroonians')
      .replace(/FALKCO\b/gi, 'FALKCO')
      .replace(/Consulting and Performance Support/gi, 'FALKCO')
  }

  if (normalized.company) {
    normalized.company.name = replaceLegacyBrand(normalized.company.name) ?? normalized.company.name
    normalized.company.shortName = replaceLegacyBrand(normalized.company.shortName) ?? normalized.company.shortName
    normalized.company.title = replaceLegacyBrand(normalized.company.title) ?? normalized.company.title
    normalized.company.slogan = replaceLegacyBrand(normalized.company.slogan) ?? normalized.company.slogan
    normalized.company.secondarySlogan = replaceLegacyBrand(normalized.company.secondarySlogan) ?? normalized.company.secondarySlogan
    normalized.company.description = replaceLegacyBrand(normalized.company.description) ?? normalized.company.description
    normalized.company.logoAlt = replaceLegacyBrand(normalized.company.logoAlt) ?? normalized.company.logoAlt
    normalized.company.logo = normalized.company.logo?.replace(/\/logo-falkco\.svg/i, '/images/consulting.png') ?? normalized.company.logo
    normalized.company.logoLight = normalized.company.logoLight?.replace(/\/logo-falkco-light\.svg/i, '/images/consulting.png') ?? normalized.company.logoLight
  }

  if (normalized.seo) {
    normalized.seo.defaultTitle = replaceLegacyBrand(normalized.seo.defaultTitle) ?? normalized.seo.defaultTitle
    normalized.seo.titleTemplate = replaceLegacyBrand(normalized.seo.titleTemplate) ?? normalized.seo.titleTemplate
    normalized.seo.defaultDescription = replaceLegacyBrand(normalized.seo.defaultDescription) ?? normalized.seo.defaultDescription
    normalized.seo.keywords = replaceLegacyBrand(normalized.seo.keywords) ?? normalized.seo.keywords
  }

  return normalized
}

function cloneDefaultContent(): SiteContent {
  return JSON.parse(JSON.stringify(defaultSiteContent)) as SiteContent
}

export function mergeSiteContent(partial?: Partial<SiteContent> | null): SiteContent {
  const fallback = cloneDefaultContent()
  if (!partial) return fallback

  const normalizedPartial = normalizeLegacyBranding(partial)

  return {
    ...fallback,
    ...normalizedPartial,
    company: { ...fallback.company, ...(normalizedPartial.company ?? {}) },
    seo: { ...fallback.seo, ...(normalizedPartial.seo ?? {}) },
    services: Array.isArray(normalizedPartial.services) && normalizedPartial.services.length > 0 ? normalizedPartial.services : fallback.services,
    statistics: Array.isArray(normalizedPartial.statistics) && normalizedPartial.statistics.length > 0 ? normalizedPartial.statistics : fallback.statistics,
    testimonials: Array.isArray(normalizedPartial.testimonials) && normalizedPartial.testimonials.length > 0 ? normalizedPartial.testimonials : fallback.testimonials,
    processSteps: Array.isArray(normalizedPartial.processSteps) && normalizedPartial.processSteps.length > 0 ? normalizedPartial.processSteps : fallback.processSteps,
  }
}

export function readStoredSiteContent(): SiteContent {
  const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY)
  if (!raw) return cloneDefaultContent()

  try {
    return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>)
  } catch {
    return cloneDefaultContent()
  }
}

export function writeStoredSiteContent(content: SiteContent) {
  localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content))
}

export function resetStoredSiteContent() {
  localStorage.removeItem(SITE_CONTENT_STORAGE_KEY)
}

export function getCurrentSiteContent(): SiteContent {
  if (typeof window === 'undefined') return cloneDefaultContent()
  if (import.meta.env.DEV) return cloneDefaultContent()
  return readStoredSiteContent()
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!USE_BACKEND) {
    return cloneDefaultContent()
  }
  const response = await apiRequest<SiteContentResponse>('/site-content')
  return mergeSiteContent(response.data ?? readStoredSiteContent())
}

export async function persistSiteContent(content: SiteContent): Promise<SiteContent> {
  const merged = mergeSiteContent(content)
  writeStoredSiteContent(merged)

  if (USE_BACKEND) {
    const response = await apiRequest<SiteContentResponse>('/admin/site-content', {
      method: 'PUT',
      body: JSON.stringify(merged),
    })
    const saved = mergeSiteContent(response.data)
    writeStoredSiteContent(saved)
    return saved
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return merged
}
