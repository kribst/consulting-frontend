import { Link, useParams } from 'react-router-dom'
import { ActualiteCard, PublicationMeta } from '../../components/cards/ActualiteCard'
import { Reveal } from '../../components/motion/Reveal'
import { CTASection } from '../../components/sections/CTASection'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'

export function ActualiteDetailsPage() {
  const { slug } = useParams()
  const { content } = useSiteContent()
  const { actualites } = content
  const actualite = actualites.find((item) => item.slug === slug)

  if (!actualite) {
    return (
      <section className="container-page py-20">
        <PageMeta title="Actualité introuvable" description="L’actualité demandée est introuvable." />
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-navy">Actualité introuvable</h1>
          <p className="mt-3 text-muted">L’actualité demandée n’existe pas ou n’est plus disponible.</p>
          <ButtonLink to="/actualite" className="mt-6">Retour aux actualités</ButtonLink>
        </Card>
      </section>
    )
  }

  const related = actualites.filter((item) => item.slug !== actualite.slug).slice(0, 3)

  return (
    <>
      <PageMeta
        title={actualite.title}
        description={actualite.summary}
        canonicalPath={`/actualite/${actualite.slug}`}
        image={actualite.image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: actualite.title,
          description: actualite.summary,
          image: actualite.image,
          datePublished: actualite.datePublication,
          dateModified: actualite.datePublication,
          timePublished: actualite.heurePublication,
          author: { '@type': 'Organization', name: 'FALKAOH CONSULTING' },
          publisher: { '@type': 'Organization', name: 'FALKAOH CONSULTING' },
        }}
      />

      <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
        <div
          className="absolute inset-0 bg-[url('/images/details.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="relative z-10 container-page">
          <Reveal className="max-w-4xl text-white">
            <Link to="/actualite" className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-gold">
              ← Retour aux actualités
            </Link>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.22em] text-gold">{actualite.category}</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {actualite.title.toUpperCase()}
            </h1>
            <div className="mt-6 [&_*]:text-white/85 [&_span]:text-white/85">
              <PublicationMeta actualite={actualite} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <div className="space-y-6">
              {actualite.content.map((paragraph, index) => (
                <p key={index} className="text-base leading-8 text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <ButtonLink to="/contact">Nous contacter</ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={140} className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-soft">
            <img
              src={actualite.image}
              alt={actualite.imageAlt}
              className="animate-image-mask aspect-[4/3] rounded-[1.5rem] object-cover"
            />
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-padding bg-surface">
          <div className="container-page">
            <SectionHeader
              title="ACTUALITÉS LIÉES"
              description="D’autres publications du cabinet à découvrir."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <ActualiteCard actualite={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection />
    </>
  )
}