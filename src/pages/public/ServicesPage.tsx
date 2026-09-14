import { ServiceCard } from '../../components/cards/ServiceCard'
import { Reveal } from '../../components/motion/Reveal'
import { CTASection } from '../../components/sections/CTASection'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'
import Separator from '../../components/ui/Separator'

export function ServicesPage() {
  const { content } = useSiteContent()
  const { services } = content

  return (
    <>
      <PageMeta
        title="Services"
        description="Découvrez les services FALKAOH CONSULTING : conseil en gestion, accompagnement d’entreprise, études de marché, études de faisabilité, formations professionnelles et événementiel professionnel."
        canonicalPath="/services"
      />

      <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
        <div 
          className="absolute inset-0 bg-[url('/images/service.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="relative z-10 container-page">
          <Reveal className="max-w-4xl text-white">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-gold">Nos services</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              UNE OFFRE CLAIRE POUR ACCOMPAGNER VOS PROJETS ET VOTRE PERFORMANCE
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              FALKAOH CONSULTING intervient sur plusieurs services complémentaires. Chaque mission peut être adaptée selon votre contexte, votre niveau de maturité et vos priorités.
            </p>
          </Reveal>
        </div>
      </section>

      <Separator />

      <section className="section-padding bg-surface">
        <div className="container-page">
          <SectionHeader
            title="SERVICES PRINCIPAUX"
            description="Choisissez un service pour lire le détail, comprendre le périmètre et préparer votre demande."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 70}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

    </>
  )
}
