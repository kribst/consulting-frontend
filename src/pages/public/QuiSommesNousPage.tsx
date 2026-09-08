import { Reveal } from '../../components/motion/Reveal'
import { CTASection } from '../../components/sections/CTASection'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'
import Separator from '../../components/ui/Separator'
import SubscribeForm from '../../components/SubscribeForm'
import { OurTeamArea } from '../../components/sections/OurTeamArea'


const values = ['Respect', 'Intégrité', 'Solidarité', 'Inclusion']



export function QuiSommesNousPage() {
  const { content } = useSiteContent()
  const { company, services } = content

  return (
    <>
      <PageMeta
        title="Qui sommes-nous"
        description="Découvrez FALKAOH CONSULTING, cabinet de conseil à yaoundé spécialisé dans l’accompagnement d’entreprise, les études, les formations et la performance organisationnelle."
        canonicalPath="/a-propos"
      />

      <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
        <div 
          className="absolute inset-0 bg-[url('/images/sommes.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="relative z-10 container-page">
          <Reveal className="max-w-4xl text-white">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-gold">Qui sommes-nous</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              UN CABINET DE CONSEIL ORIENTÉ CLARTÉ, ACCOMPAGNEMENT ET PERFORMANCE
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {company.name} accompagne les organisations camerounaises dans leurs besoins de conseil, structuration, études, formations et appui professionnel. Notre rôle est de transformer un besoin complexe en démarche claire, utile et actionnable.
            </p>
          </Reveal>
        </div>
      </section>

      <Separator />

      <section className="bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">PRÉSENTATION</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
              L’EXPERTISE AU SERVICE DE VOS PROJETS
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              {company.name} est une filiale du <a href="https://falkaohafricagroup.com/" target="_blank" rel="noreferrer" className="font-bold text-gold hover:text-deep-blue">GROUP FALKAOH</a>, ayant pour Directeur général Monsieur <strong>NGWE MAYO EMMANUEL</strong>.
              <br />
              <br />
              FALKCO est un cabinet qui intervient dans la réalisation d'études, d'enquêtes, de diagnostics, de formations, ainsi que dans la planification stratégique et opérationnelle. Le cabinet accompagne les organisations publiques, privées et de la société civile dans leurs projets, leurs transformations et leurs enjeux de développement.
            </p>
            <div className="mt-8">
              <ButtonLink to="/services" size="lg" className="cta-quote-button">Découvrir nos services</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={140} className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-soft">
            <img src='/images/propos.jpg' alt='FALKCO' className="animate-image-mask aspect-[4/3] rounded-[1.5rem] object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <Reveal>
          <Card className="p-7 hover:border-gold/40 hover:shadow-soft">
            <h2 className="text-xl font-bold text-navy">Mission</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
             Accompagner les pouvoirs publics, le secteur privé, les OSC et les particuliers dans l’atteinte de leurs objectifs de développement en leur apportant des solutions adaptées, efficientes et efficaces.
            </p>
          </Card>
          </Reveal>
          <Reveal delay={80}>
          <Card className="p-7 hover:border-gold/40 hover:shadow-soft">
            <h2 className="text-xl font-bold text-navy">Vision</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Devenir un partenaire de référence en afrique, en matière d’Etudes, de Conseils et de Formations. pour les organisations qui cherchent un conseil sérieux, clair et orienté performance.
            </p>
          </Card>
          </Reveal>
          <Reveal delay={160}>
          <Card className="p-7 hover:border-gold/40 hover:shadow-soft">
            <h2 className="text-xl font-bold text-navy">Pourquoi FALKCO ?</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Beaucoup de projets échouent par manque de structuration, d’analyse ou d’accompagnement. FALKAOH CONSULTING apporte méthode, recul et appui concret.
            </p>
          </Card>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Nos Valeurs"
            title="DES PRINCIPES SIMPLES POUR UNE RELATION DURABLE"
            description="Notre approche repose sur l’écoute du client, la rigueur dans l’analyse et la confidentialité des échanges."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="hidden sm:contents">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`placeholder-${i}`} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 opacity-0">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-hidden="true" />
                <span className="font-bold text-navy">placeholder</span>
              </div>
            ))}
            </div>
            {values.map((value, index) => (
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

      <section className="section-padding bg-navy text-white">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Qui sont nos clients cibles ?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">UN ACCOMPAGNEMENT ADAPTÉ <br />AU TERRAIN ÉCONOMIQUE</h2>
          </div>
          <p className="mt-4 text-white/75">
            FALKAOH CONSULTING accompagne les entreprises, PME, coopératives, GIC, ONG, associations et particuliers dans la structuration de leurs activités, l’analyse de faisabilité, le développement des compétences, la gestion financière et l’amélioration de leurs performances.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Domaines d’expertise"
            title="UNE EXPERTISE TRANSVERSALE"
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, index) => (
              <Reveal key={service.slug} delay={index * 70}>
                <Card className="p-6 text-center font-bold text-navy hover:border-gold/40 hover:shadow-soft">{service.title}</Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <OurTeamArea />
      <SubscribeForm />
    </>
  )
}
