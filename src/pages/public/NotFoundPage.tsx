import { Reveal } from '../../components/motion/Reveal'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageMeta } from '../../components/ui/PageMeta'

export function NotFoundPage() {
  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-20">
      <PageMeta title="Page introuvable" description="La page demandée est introuvable." />
      <Reveal className="w-full max-w-2xl">
        <Card className="p-8 text-center hover:border-gold/40 hover:shadow-soft sm:p-10">
          <div className="animate-soft-float mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-soft-gold text-4xl" aria-hidden="true">404</div>
          <h1 className="mt-6 text-3xl font-black text-navy sm:text-4xl">Page introuvable</h1>
          <p className="mt-4 text-muted">La page que vous recherchez n’existe pas ou a été déplacée.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/">Retour à l’accueil</ButtonLink>
            <ButtonLink to="/services" variant="outline">Voir les services</ButtonLink>
          </div>
        </Card>
      </Reveal>
    </section>
  )
}
