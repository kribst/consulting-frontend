import { ServiceCard } from '../../components/cards/ServiceCard'
import { StatCard } from '../../components/cards/StatCard'
import { Reveal } from '../../components/motion/Reveal'
import { Badge } from '../../components/ui/Badge'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'
import Separator from '../../components/ui/Separator'
import { ClientSliderSection } from '../../components/sections/ClientSliderSection'
import { TestimonialCarousel } from '../../components/sections/TestimonialCarousel'
import SubscribeForm from '../../components/SubscribeForm'
import Separ from '../../components/ui/separ'
import { apiRequest, USE_BACKEND } from '../../lib/api'
import type { Testimonial } from '../../types'
import { useEffect, useState } from 'react'

export function AccueilPage() {
  const { content } = useSiteContent()
  const { company, services, statistics, testimonials, processSteps } = content
  const [apiTestimonials, setApiTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    if (!USE_BACKEND) return
    let cancelled = false
    apiRequest<{ data: Testimonial[] }>('/testimonials')
      .then((response) => {
        if (!cancelled && response.data) setApiTestimonials(response.data)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const displayedTestimonials = apiTestimonials.length > 0 ? apiTestimonials : testimonials

  return (
    <>
      <PageMeta
        title="Accueil"
        description="FALKAOH CONSULTING, cabinet de conseil à Ngousso, yaoundé cameroun : conseil en gestion, accompagnement d’entreprise, études, formations professionnelles et performance organisationnelle."
        canonicalPath="/"
      />



      <section className="relative overflow-hidden bg-navy text-white">
        {/* Vidéo en arrière-plan */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-consulting-illustration.svg"
        >
          <source src="/videos/consulting.mp4" type="video/mp4" />
        </video>

        {/* ← AJOUTEZ CE BLOC : overlay sombre */}
        <div className="absolute inset-0 bg-navy/15" aria-hidden="true" />

        {/* Contenu par-dessus */}
        <div className="relative z-10 container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <Reveal>
            <Badge className="border-white/20 bg-white/10 text-white/88 text-white">Cabinet de conseil</Badge>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white/88 sm:text-5xl lg:text-6xl" style={{ textTransform: 'capitalize' }}>
              {company.slogan}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88" style={{ textTransform: 'capitalize' }}>
              {company.secondarySlogan}.
            </p>
            <div className="mt-8">
              <ButtonLink to="/services" size="lg" className="cta-quote-button">
                Découvrir nos services
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

    <Separator />



      <section className="section-padding bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <SectionHeader
              eyebrow="Présentation"
              title="MÉTHODOLOGIE DE TRAVAIL"
              description="Notre démarche repose sur une approche structurée et itérative, de l'analyse initiale à l'évaluation finale, en passant par la co-construction des solutions avec vous."
            />
            <div className="mt-8">
              <ButtonLink to="/a-propos" variant="secondary" className="cta-quote-button">
                Qui sommes-nous
              </ButtonLink>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Diagnostic',
              'Proposition',
              'Mise en œuvre',
              'Suivi',
              'Pérennité',
              'Evaluation',
            ].map((value, index) => (
              <Reveal key={value} delay={index * 55}>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-gold/50 hover:bg-white hover:shadow-card">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-hidden="true" />
                  <span className="font-bold text-navy">{value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Services"
            title="DES SERVICES ADAPTÉS À VOS ENJEUX"
            description="FALKCO couvre les besoins essentiels d’une organisation : conseil en gestion, accompagnement, études, formations, événementiel et missions personnalisées."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.slice(0, 6).map((service, index) => (
              <Reveal key={service.slug} delay={index * 70}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink to="/services" className="cta-quote-button">Voir plus de services</ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white sm:py-20">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Confiance & expertise</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">UNE DÉMARCHE SÉRIEUSE, ORIENTÉE PERFORMANCE</h2>
              <p className="mt-4 text-white/70">Les chiffres ci-dessous sont des exemples éditables pour présenter la crédibilité de FALKAOH CONSULTING.</p>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statistics.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 80} className="h-full">
                  <StatCard stat={stat} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="STRATÉGIE"
            title="UNE APPROCHE AXÉE SUR LES RÉSULTATS"
            description="Une expertise multidisciplinaire au service de la croissance et de la performance."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <Card className="p-6 text-center hover:border-gold/40 hover:shadow-soft">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-soft-gold text-lg font-black text-navy">
                    {step.title.charAt(0).toUpperCase()}
                  </span>
                  <h3 className="mt-5 font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      

      <section className="section-padding bg-surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Avis clients"
            title="UNE RELATION BASÉE SUR LA CONFIANCE"
            description="Exemples de témoignages pour illustrer la valeur perçue par les clients et partenaires."
            align="center"
          />
          <div className="mt-12">
            <TestimonialCarousel testimonials={displayedTestimonials} />
          </div>
        </div>
      </section>


      <ClientSliderSection paddingY="20px" />
      <SubscribeForm />
      <Separ />
    
    </>
  )
}
