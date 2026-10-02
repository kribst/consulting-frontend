import { ActualiteCard } from '../../components/cards/ActualiteCard'
import { Reveal } from '../../components/motion/Reveal'
import { CTASection } from '../../components/sections/CTASection'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import Separator from '../../components/ui/Separator'
import { useSiteContent } from '../../features/content/SiteContentContext'

export function ActualitePage() {
  const { content } = useSiteContent()
  const { actualites } = content

  const [latest, ...rest] = actualites

  return (
    <>
      <PageMeta
        title="Actualité"
        description="Retrouvez les actualités, publications et communiqués de FALKAOH CONSULTING : partenariats, formations, études et annonces."
        canonicalPath="/actualite"
      />

      <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
        <div
          className="absolute inset-0 bg-[url('/images/details.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="relative z-10 container-page">
          <Reveal className="max-w-4xl text-white">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-gold">Actualité</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              NOS DERNIÈRES PUBLICATIONS ET COMMUNIQUÉS
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Retrouvez les informations, communiqués et publications de FALKAOH CONSULTING sur l’accompagnement des entreprises et des organisations.
            </p>
          </Reveal>
        </div>
      </section>

      <Separator />

      {latest ? (
        <section className="section-padding bg-surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="À la une"
              title="DERNIÈRE PUBLICATION"
              description="L’information la plus récente publiée par le cabinet."
            />
            <div className="mt-10">
              <Reveal>
                <ActualiteCard actualite={latest} />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="section-padding bg-white">
          <div className="container-page">
            <SectionHeader
              eyebrow="Toutes les actualités"
              title="ARCHIVES DES PUBLICATIONS"
              description="Consultez les publications précédentes du cabinet."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((actualite, index) => (
                <Reveal key={actualite.slug} delay={index * 70}>
                  <ActualiteCard actualite={actualite} />
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