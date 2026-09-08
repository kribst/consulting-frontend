import { Link, useParams } from 'react-router-dom'
import { ServiceCard } from '../../components/cards/ServiceCard'
import { Reveal } from '../../components/motion/Reveal'
import { CTASection } from '../../components/sections/CTASection'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ServiceDetailsPage() {
  const { slug } = useParams()
  const { content } = useSiteContent()
  const { services } = content
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return (
      <section className="container-page py-20">
        <PageMeta title="Service introuvable" description="Le service demandé est introuvable." />
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-navy">Service introuvable</h1>
          <p className="mt-3 text-muted">Le service demandé n’existe pas ou n’est plus disponible.</p>
          <ButtonLink to="/services" className="mt-6">Retour aux services</ButtonLink>
        </Card>
      </section>
    )
  }

  const related = service.relatedSlugs
    .map((relatedSlug) => services.find((item) => item.slug === relatedSlug))
    .filter(Boolean)
    .slice(0, 3)

  return (
    <>
      <PageMeta
        title={service.title}
        description={`${service.title} avec FALKAOH CONSULTING : ${service.summary}`}
        canonicalPath={`/services/${service.slug}`}
        image={service.image}
        structuredData={{
          '@context': 'https://falkaohafricagroup.com',
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          provider: { '@type': 'ProfessionalService', name: 'FALKAOH CONSULTING' },
          areaServed: 'Cameroun',
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
            <Link to="/services" className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-gold">← Retour aux services</Link>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              PRÉSENTEZ VOTRE BESOIN EN {service.title.toUpperCase()}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Vous avez un besoin en <span className="font-bold text-gold">{service.title}</span> ? Décrivez votre demande et l’équipe FALKAOH CONSULTING vous contactera dans les meilleurs délais pour vous accompagner.
            </p>
          </Reveal>
        </div>
      </section>


      <section className="bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-gold">DÉTAIL DU SERVICE</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight uppercase text-navy sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">{service.summary}</p>
            <div className="mt-8">
              <ButtonLink to={`/contact?service=${service.slug}`}>Contacter FALKCO pour ce service</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={140} className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-soft">
            <img src={service.image} alt={service.imageAlt} className="animate-image-mask aspect-[4/3] rounded-[1.5rem] object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
          <Card className="p-7 sm:p-8 hover:border-gold/40 hover:shadow-soft">
            <SectionHeader title="DESCRIPTION DÉTAILLÉE" description={service.description} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-4 text-lg font-bold text-navy">Ce que le service inclut</h2>
                <BulletList items={service.includes} />
              </div>
              <div>
                <h2 className="mb-4 text-lg font-bold text-navy">Pour qui ?</h2>
                <BulletList items={service.audience} />
              </div>
            </div>
          </Card>
          </Reveal>

          <Reveal delay={100}>
          <Card className="p-7 sm:p-8 hover:border-gold/40 hover:shadow-soft">
            <h2 className="text-lg font-bold text-navy">BÉNÉFICES POUR LE CLIENT</h2>
            <div className="mt-5">
              <BulletList items={service.benefits} />
            </div>
            <div className="mt-8 rounded-2xl bg-soft-gold p-5">
              <p className="font-bold text-navy">Objectif de cette mission</p>
              <p className="mt-2 text-sm leading-6 text-navy/75">
                Passer d’un besoin général à une démarche claire, utile et actionnable.
              </p>
            </div>
          </Card>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="CAS D’USAGE TYPIQUES" description="Quelques situations où ce service peut apporter une valeur concrète." />
            <div className="mt-8 grid gap-4">
              {service.useCases.map((useCase, index) => (
                <Reveal key={useCase} delay={index * 60}>
                  <Card className="p-5 font-bold text-navy hover:border-gold/40 hover:shadow-soft">{useCase}</Card>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="PROCESSUS D’INTERVENTION" description="Une méthode simple, lisible et adaptée au besoin du client." />
            <div className="mt-8 grid gap-4">
              {service.process.map((step, index) => (
                <Reveal key={step} delay={index * 60}>
                <div className="flex gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy font-bold text-gold">{index + 1}</span>
                  <div>
                    <p className="font-bold text-navy">{step}</p>
                    <p className="mt-1 text-sm text-muted">Étape structurée pour avancer avec clarté et méthode.</p>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page">
          <SectionHeader title="SERVICES LIÉS" description="Ces services peuvent compléter votre demande selon votre contexte." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item, index) => item ? (
              <Reveal key={item.slug} delay={index * 80}>
                <ServiceCard service={item} />
              </Reveal>
            ) : null)}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
