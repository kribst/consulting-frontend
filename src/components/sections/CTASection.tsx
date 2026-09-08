import { Reveal } from '../motion/Reveal'
import { ButtonLink } from '../ui/Button'
import { useSiteContent } from '../../features/content/SiteContentContext'

export function CTASection() {
  const { content } = useSiteContent()
  const { company } = content

  return (
    <section className="container-page py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-white shadow-soft sm:p-10 lg:p-12">
          <div className="animate-soft-float pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Prochaine étape</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                AVEZ VOUS UN PROJET, OU BESOIN DE CONSEIL ?
              </h2>
              <p className="mt-4 max-w-2xl text-white/75">
                Envoyez une demande claire à {company.shortName}. L’équipe vous recontactera pour préciser le contexte, le périmètre et les prochaines étapes.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Reveal delay={120}>
                <ButtonLink to="/contact" size="lg" className="cta-quote-button">
                  Nous contacter
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
