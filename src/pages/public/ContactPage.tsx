import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ContactInfoCard } from '../../components/cards/ContactInfoCard'
import { Reveal } from '../../components/motion/Reveal'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FormError, Input, Label, Select, Textarea } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useSiteContent } from '../../features/content/SiteContentContext'
import { sendContactMessage, validateContact } from '../../features/contact/contactApi'
import type { ContactFormValues } from '../../types'
import Separator from '../../components/ui/Separator'

const emptyForm: ContactFormValues = {
  nom: '',
  email: '',
  telephone: '',
  entreprise: '',
  service_id: '',
  sujet: '',
  message: '',
}

export function ContactPage() {
  const { content } = useSiteContent()
  const { company, services } = content
  const [searchParams] = useSearchParams()
  const selectedServiceSlug = searchParams.get('service')
  const selectedService = services.find((service) => service.slug === selectedServiceSlug)
  const initialForm = useMemo(
    () => ({
      ...emptyForm,
      service_id: selectedService ? String(selectedService.id) : '',
      sujet: selectedService ? `Demande - ${selectedService.title}` : '',
    }),
    [selectedService],
  )

  const [values, setValues] = useState<ContactFormValues>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function updateValue(name: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    const validationErrors = validateContact(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await sendContactMessage(values)
      setSuccessMessage(response.message || 'Votre message a été envoyé avec succès. L’équipe FALKCO vous contactera dans les meilleurs délais.')
      setValues(emptyForm)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible d’envoyer votre message pour le moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageMeta
        title="Contact"
        description="Contactez FALKAOH CONSULTING pour une demande de conseil en gestion, accompagnement d’entreprise, étude de marché, étude de faisabilité, formation professionnelle ou événementiel professionnel."
        canonicalPath="/contact"
      />

      <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
        <div 
          className="absolute inset-0 bg-[url('/images/contact.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="relative z-10 container-page">
          <Reveal className="max-w-4xl text-white">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-gold">Contact</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white/85 sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              PRÉSENTEZ VOTRE BESOIN À FALKAOH CONSULTING
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Décrivez votre demande, votre projet ou votre besoin d’accompagnement. L’équipe FALKCO vous contactera dans les meilleurs délais.
            </p>
          </Reveal>
        </div>
      </section>

      <Separator />

      <section className="section-padding bg-surface">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <Reveal>
            <ContactInfoCard icon={<Phone className="h-5 w-5" />} title="Téléphone">
              <a href={company.phoneHref} className="font-bold text-navy hover:text-deep-blue">{company.phone}</a>
            </ContactInfoCard>
            </Reveal>
            <Reveal delay={70}>
            <ContactInfoCard icon={<Mail className="h-5 w-5" />} title="Email">
              <a href={company.emailHref} className="font-bold text-navy hover:text-deep-blue">{company.email}</a>
            </ContactInfoCard>
            </Reveal>
            <Reveal delay={140}>
            <ContactInfoCard icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp">
              <a href={company.whatsappHref} className="font-bold text-navy hover:text-deep-blue">Envoyer un message WhatsApp</a>
            </ContactInfoCard>
            </Reveal>
            <Reveal delay={210}>
            <ContactInfoCard icon={<MapPin className="h-5 w-5" />} title="Adresse">
              <a href={company.mapsUrl} target="_blank" rel="noreferrer" className="font-bold text-navy hover:text-deep-blue">{company.address}</a><br />
              <span>{company.openingHours}</span>
            </ContactInfoCard>
            </Reveal>

            <Reveal delay={280}>
            <Card className="overflow-hidden p-3 hover:border-gold/40 hover:shadow-soft">
              <iframe
                title="Localisation FALKAOH CONSULTING sur Google Maps"
                src={company.mapsEmbedUrl}
                className="aspect-[4/3] w-full rounded-2xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Card>
            </Reveal>
          </div>

          <Reveal delay={120}>
          <Card className="p-6 sm:p-8 hover:border-gold/40 hover:shadow-soft">
            <SectionHeader
              title="FORMULAIRE DE DEMANDE"
              description="Les champs marqués comme obligatoires doivent être remplis correctement."
            />
            <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
              {successMessage ? <Alert type="success">{successMessage}</Alert> : null}
              {errorMessage ? <Alert type="error">{errorMessage}</Alert> : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input id="nom" value={values.nom} onChange={(e) => updateValue('nom', e.target.value)} placeholder="Votre nom complet" />
                  <FormError message={errors.nom} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={values.email} onChange={(e) => updateValue('email', e.target.value)} placeholder="exemple@email.com" />
                  <FormError message={errors.email} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" value={values.telephone} onChange={(e) => updateValue('telephone', e.target.value)} placeholder="+237 ___ ___ ___" />
                  <FormError message={errors.telephone} />
                </div>
                <div>
                  <Label htmlFor="entreprise">Entreprise</Label>
                  <Input id="entreprise" value={values.entreprise} onChange={(e) => updateValue('entreprise', e.target.value)} placeholder="Nom de l’entreprise" />
                </div>
              </div>

              <div>
                <Label htmlFor="service_id">Service souhaité</Label>
                <Select id="service_id" value={values.service_id} onChange={(e) => updateValue('service_id', e.target.value)}>
                  <option value="">Sélectionner un service</option>
                  {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
                </Select>
              </div>

              <div>
                <Label htmlFor="sujet">Sujet *</Label>
                <Input id="sujet" value={values.sujet} onChange={(e) => updateValue('sujet', e.target.value)} placeholder="Objet de votre demande" />
                <FormError message={errors.sujet} />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" value={values.message} onChange={(e) => updateValue('message', e.target.value)} placeholder="Décrivez votre besoin en quelques lignes..." />
                <FormError message={errors.message} />
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" aria-hidden="true" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
            </form>
          </Card>
          </Reveal>
        </div>
      </section>
    </>
  )
}
