import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../../features/content/SiteContentContext'

type PageMetaProps = {
  title: string
  description?: string
  canonicalPath?: string
  keywords?: string
  image?: string
  robots?: string
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

function upsertMeta(selector: string, createAttributes: Record<string, string>, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    Object.entries(createAttributes).forEach(([key, value]) => meta?.setAttribute(key, value))
    document.head.appendChild(meta)
  }
  meta.content = content
}

function upsertLink(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

function absoluteUrl(siteUrl: string, pathOrUrl: string) {
  if (!pathOrUrl) return siteUrl
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${siteUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`
}

export function PageMeta({ title, description, canonicalPath, keywords, image, robots, structuredData }: PageMetaProps) {
  const location = useLocation()
  const { content } = useSiteContent()
  const { company, seo } = content

  useEffect(() => {
    const pageTitle = title === company.shortName ? title : seo.titleTemplate.replace('%s', title)
    const metaDescription = description || seo.defaultDescription
    const canonicalUrl = absoluteUrl(seo.siteUrl, canonicalPath || location.pathname)
    const imageUrl = absoluteUrl(seo.siteUrl, image || seo.ogImage || company.heroImage)
    const pageKeywords = keywords || seo.keywords
    const robotsValue = robots || seo.robots

    document.documentElement.lang = 'fr-CM'
    document.title = pageTitle

    upsertMeta('meta[name="description"]', { name: 'description' }, metaDescription)
    upsertMeta('meta[name="keywords"]', { name: 'keywords' }, pageKeywords)
    upsertMeta('meta[name="robots"]', { name: 'robots' }, robotsValue)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, pageTitle)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, metaDescription)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl)
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, seo.locale)
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, pageTitle)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, metaDescription)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl)
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color' }, '#2e6061')
    upsertLink('canonical', canonicalUrl)

    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': seo.businessType || 'ProfessionalService',
      name: company.name,
      alternateName: company.shortName,
      url: seo.siteUrl,
      logo: absoluteUrl(seo.siteUrl, company.logo),
      image: imageUrl,
      description: company.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Yaoundé',
        addressCountry: 'CM',
        streetAddress: company.address,
      },
      telephone: company.phone,
      email: company.email,
      areaServed: 'Cameroun',
      sameAs: company.socialLinks.map((social) => social.href),
    }

    const payload = structuredData
      ? Array.isArray(structuredData)
        ? [baseStructuredData, ...structuredData]
        : [baseStructuredData, structuredData]
      : baseStructuredData

    let jsonLd = document.querySelector<HTMLScriptElement>('script[data-falkco-json-ld="page"]')
    if (!jsonLd) {
      jsonLd = document.createElement('script')
      jsonLd.type = 'application/ld+json'
      jsonLd.dataset.falkcoJsonLd = 'page'
      document.head.appendChild(jsonLd)
    }
    jsonLd.textContent = JSON.stringify(payload)
  }, [canonicalPath, company, content, description, image, keywords, location.pathname, robots, seo, structuredData, title])

  return null
}
