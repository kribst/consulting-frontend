import { FileText, RefreshCcw, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Label, Select, Textarea } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { useSiteContent } from '../../features/content/SiteContentContext'
import type { CompanyInfo, ProcessStep, SeoSettings, Service, SiteContent, SocialLink, Statistic, Testimonial } from '../../types'

type TabKey = 'company' | 'seo' | 'services' | 'statistics' | 'testimonials' | 'process'

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: 'company', label: 'Société', description: 'Nom, logo, contact, Google Maps et réseaux sociaux.' },
  { key: 'seo', label: 'SEO', description: 'Textes principaux pour la visibilité du site.' },
  { key: 'services', label: 'Services', description: 'Modifier les six services et leurs pages détails.' },
  { key: 'statistics', label: 'Statistiques', description: 'Chiffres de confiance visibles sur la page d’accueil.' },
  { key: 'testimonials', label: 'Témoignages', description: 'Avis et preuves sociales affichés publiquement.' },
  { key: 'process', label: 'Processus', description: 'Étapes de la méthode FALKCO.' },
]

const arrayFields: (keyof Service)[] = ['keyPoints', 'includes', 'audience', 'benefits', 'useCases', 'process', 'relatedSlugs']

function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent
}

function listToText(items: string[] = []) {
  return items.join('\n')
}

function textToList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function fieldId(prefix: string, index: number, name: string) {
  return `${prefix}-${index}-${name}`
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  const id = useMemo(() => label.toLowerCase().replace(/\s+/g, '-'), [label])
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  )
}

function TextAreaField({ label, value, onChange, rows = 4, help }: { label: string; value: string; onChange: (value: string) => void; rows?: number; help?: string }) {
  const id = useMemo(() => label.toLowerCase().replace(/\s+/g, '-'), [label])
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={rows} />
      {help ? <p className="mt-2 text-xs leading-5 text-muted">{help}</p> : null}
    </div>
  )
}

export function AdminContentPage() {
  const { content, saveContent, resetContent } = useSiteContent()
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(content))
  const [activeTab, setActiveTab] = useState<TabKey>('company')
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(cloneContent(content))
  }, [content])

  function updateCompany<K extends keyof CompanyInfo>(key: K, value: CompanyInfo[K]) {
    setDraft((current) => ({ ...current, company: { ...current.company, [key]: value } }))
  }

  function updateSeo<K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) {
    setDraft((current) => ({ ...current, seo: { ...current.seo, [key]: value } }))
  }

  function updateSocial(index: number, key: keyof SocialLink, value: string) {
    setDraft((current) => ({
      ...current,
      company: {
        ...current.company,
        socialLinks: current.company.socialLinks.map((social, socialIndex) =>
          socialIndex === index ? { ...social, [key]: value } : social,
        ),
      },
    }))
  }

  function addSocial() {
    setDraft((current) => ({
      ...current,
      company: {
        ...current.company,
        socialLinks: [...current.company.socialLinks, { label: 'Nouveau lien', href: 'https://', type: 'website' }],
      },
    }))
  }

  function removeSocial(index: number) {
    setDraft((current) => ({
      ...current,
      company: {
        ...current.company,
        socialLinks: current.company.socialLinks.filter((_, socialIndex) => socialIndex !== index),
      },
    }))
  }

  function updateService(index: number, key: keyof Service, value: Service[keyof Service]) {
    setDraft((current) => ({
      ...current,
      services: current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [key]: value } : service,
      ),
    }))
  }

  function addService() {
    setDraft((current) => {
      const nextId = Math.max(0, ...current.services.map((service) => service.id)) + 1
      const newService: Service = {
        id: nextId,
        title: 'Nouveau service',
        slug: `nouveau-service-${nextId}`,
        icon: 'briefcase-business',
        summary: 'Résumé court du service.',
        description: 'Description détaillée du service.',
        image: '/images/hero-consulting-illustration.svg',
        imageAlt: 'Image illustrative du service FALKAOH CONSULTING',
        keyPoints: ['Point clé 1', 'Point clé 2'],
        includes: ['Élément inclus 1', 'Élément inclus 2'],
        audience: ['Client cible'],
        benefits: ['Bénéfice client'],
        useCases: ['Cas d’usage'],
        process: ['Étape 1', 'Étape 2'],
        relatedSlugs: current.services.slice(0, 2).map((service) => service.slug),
      }
      return { ...current, services: [...current.services, newService] }
    })
  }

  function removeService(index: number) {
    setDraft((current) => ({ ...current, services: current.services.filter((_, serviceIndex) => serviceIndex !== index) }))
  }

  function updateStatistic(index: number, key: keyof Statistic, value: string) {
    setDraft((current) => ({
      ...current,
      statistics: current.statistics.map((statistic, statisticIndex) =>
        statisticIndex === index ? { ...statistic, [key]: value } : statistic,
      ),
    }))
  }

  function addStatistic() {
    setDraft((current) => ({
      ...current,
      statistics: [...current.statistics, { label: 'Nouvelle statistique', value: '0', description: 'Description courte' }],
    }))
  }

  function removeStatistic(index: number) {
    setDraft((current) => ({ ...current, statistics: current.statistics.filter((_, statisticIndex) => statisticIndex !== index) }))
  }

  function updateTestimonial(index: number, key: keyof Testimonial, value: string) {
    setDraft((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial, testimonialIndex) =>
        testimonialIndex === index ? { ...testimonial, [key]: value } : testimonial,
      ),
    }))
  }

  function addTestimonial() {
    setDraft((current) => {
      const nextId = current.testimonials.length > 0 ? Math.max(...current.testimonials.map((item) => item.id)) + 1 : 1
      return {
        ...current,
        testimonials: [...current.testimonials, { id: nextId, name: 'Nom du client', role: 'Fonction / organisation', quote: 'Témoignage client à afficher sur le site.' }],
      }
    })
  }

  function removeTestimonial(index: number) {
    setDraft((current) => ({ ...current, testimonials: current.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index) }))
  }

  function updateProcessStep(index: number, key: keyof ProcessStep, value: string) {
    setDraft((current) => ({
      ...current,
      processSteps: current.processSteps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, [key]: value } : step,
      ),
    }))
  }

  function addProcessStep() {
    setDraft((current) => ({
      ...current,
      processSteps: [...current.processSteps, { title: 'Nouvelle étape', description: 'Description de cette étape.' }],
    }))
  }

  function removeProcessStep(index: number) {
    setDraft((current) => ({ ...current, processSteps: current.processSteps.filter((_, stepIndex) => stepIndex !== index) }))
  }

  async function handleSave() {
    setSuccess('')
    setError('')
    setIsSaving(true)
    try {
      await saveContent(draft)
      setSuccess('Contenu enregistré. Les pages publiques utilisent maintenant ces informations.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer le contenu.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleReset() {
    const confirmed = window.confirm('Réinitialiser tout le contenu éditable vers les valeurs par défaut ?')
    if (!confirmed) return
    setSuccess('')
    setError('')
    try {
      await resetContent()
      setSuccess('Contenu réinitialisé avec succès.')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Réinitialisation impossible.')
    }
  }

  return (
    <>
      <PageMeta title="Gestion du contenu" description="Gestion du contenu et SEO du site FALKAOH CONSULTING." robots="noindex, nofollow" />

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Mini CMS</p>
              <h2 className="mt-2 text-2xl font-black text-navy">Modifier le contenu du site</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Cette page permet à l’admin de modifier le contenu public sans toucher au code : informations société, services,
                statistiques, témoignages, processus et informations SEO. En mode mock, les changements sont sauvegardés dans le navigateur.
              
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={handleReset}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Réinitialiser
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" aria-hidden="true" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {success ? <Alert type="success">{success}</Alert> : null}
            {error ? <Alert type="error">{error}</Alert> : null}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="p-3 lg:sticky lg:top-24 lg:self-start">
            <nav className="grid gap-2" aria-label="Sections contenu">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                    activeTab === tab.key ? 'bg-navy text-white shadow-card' : 'bg-surface text-navy hover:bg-soft-gold'
                  }`}
                >
                  <span className="block text-sm font-black">{tab.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${activeTab === tab.key ? 'text-white/70' : 'text-muted'}`}>{tab.description}</span>
                </button>
              ))}
            </nav>
          </Card>

          <div className="grid gap-6">
            {activeTab === 'company' ? (
              <Card className="p-6">
                <h3 className="text-xl font-black text-navy">Informations société</h3>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <TextField label="Nom société" value={draft.company.name} onChange={(value) => updateCompany('name', value)} />
                  <TextField label="Nom court" value={draft.company.shortName} onChange={(value) => updateCompany('shortName', value)} />
                  <TextField label="Titre interface" value={draft.company.title} onChange={(value) => updateCompany('title', value)} />
                  <TextField label="Slogan principal" value={draft.company.slogan} onChange={(value) => updateCompany('slogan', value)} />
                  <TextField label="Slogan secondaire" value={draft.company.secondarySlogan} onChange={(value) => updateCompany('secondarySlogan', value)} />
                  <TextField label="Téléphone" value={draft.company.phone} onChange={(value) => updateCompany('phone', value)} />
                  <TextField label="Lien téléphone" value={draft.company.phoneHref} onChange={(value) => updateCompany('phoneHref', value)} />
                  <TextField label="WhatsApp" value={draft.company.whatsapp} onChange={(value) => updateCompany('whatsapp', value)} />
                  <TextField label="Lien WhatsApp" value={draft.company.whatsappHref} onChange={(value) => updateCompany('whatsappHref', value)} />
                  <TextField label="Email" value={draft.company.email} onChange={(value) => updateCompany('email', value)} />
                  <TextField label="Lien email" value={draft.company.emailHref} onChange={(value) => updateCompany('emailHref', value)} />
                  <TextField label="Adresse" value={draft.company.address} onChange={(value) => updateCompany('address', value)} />
                  <TextField label="Horaires" value={draft.company.openingHours} onChange={(value) => updateCompany('openingHours', value)} />
                  <TextField label="Site web" value={draft.company.website} onChange={(value) => updateCompany('website', value)} />
                  <TextField label="Google Maps URL" value={draft.company.mapsUrl} onChange={(value) => updateCompany('mapsUrl', value)} />
                  <TextField label="Google Maps Embed URL" value={draft.company.mapsEmbedUrl} onChange={(value) => updateCompany('mapsEmbedUrl', value)} />
                  <TextField label="Logo" value={draft.company.logo} onChange={(value) => updateCompany('logo', value)} />
                  <TextField label="Logo clair" value={draft.company.logoLight} onChange={(value) => updateCompany('logoLight', value)} />
                  <TextField label="Alt logo" value={draft.company.logoAlt} onChange={(value) => updateCompany('logoAlt', value)} />
                  <TextField label="Hero image" value={draft.company.heroImage} onChange={(value) => updateCompany('heroImage', value)} />
                  <TextField label="Alt hero image" value={draft.company.heroImageAlt} onChange={(value) => updateCompany('heroImageAlt', value)} />
                  <TextField label="Image bureau/équipe" value={draft.company.officeImage} onChange={(value) => updateCompany('officeImage', value)} />
                  <TextField label="Alt image bureau/équipe" value={draft.company.officeImageAlt} onChange={(value) => updateCompany('officeImageAlt', value)} />
                </div>
                <div className="mt-5">
                  <TextAreaField label="Description footer / société" value={draft.company.description} onChange={(value) => updateCompany('description', value)} />
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-black text-navy">Réseaux sociaux</h4>
                    <Button type="button" variant="outline" onClick={addSocial}>Ajouter un lien</Button>
                  </div>
                  <div className="mt-4 grid gap-4">
                    {draft.company.socialLinks.map((social, index) => (
                      <div key={`${social.label}-${index}`} className="rounded-2xl border border-border bg-surface p-4">
                        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                          <TextField label="Label" value={social.label} onChange={(value) => updateSocial(index, 'label', value)} />
                          <TextField label="URL" value={social.href} onChange={(value) => updateSocial(index, 'href', value)} />
                          <div>
                            <Label htmlFor={`social-type-${index}`}>Type icône</Label>
                            <Select id={`social-type-${index}`} value={social.type} onChange={(event) => updateSocial(index, 'type', event.target.value)}>
                              <option value="website">Site web</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="youtube">YouTube</option>
                              <option value="twitter">Twitter/X</option>
                            </Select>
                          </div>
                          <Button type="button" variant="danger" onClick={() => removeSocial(index)}>Supprimer</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {activeTab === 'seo' ? (
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-soft-gold text-navy"><FileText className="h-5 w-5" /></span>
                  <div>
                    <h3 className="text-xl font-black text-navy">SEO global</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Cette section permet de gérer les informations SEO principales du site : titre, description, image de partage et texte éditorial. Utilise des contenus clairs, naturels et adaptés aux services de FALKAOH CONSULTING.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <TextField label="URL canonique du site" value={draft.seo.siteUrl} onChange={(value) => updateSeo('siteUrl', value)} placeholder="https://www.falkaohconsulting.com" />
                  <TextField label="Titre par défaut" value={draft.seo.defaultTitle} onChange={(value) => updateSeo('defaultTitle', value)} />
                  <TextField label="Template title" value={draft.seo.titleTemplate} onChange={(value) => updateSeo('titleTemplate', value)} placeholder="%s | FALKAOH CONSULTING" />
                  <TextField label="Image Open Graph" value={draft.seo.ogImage} onChange={(value) => updateSeo('ogImage', value)} />
                  <TextField label="Robots" value={draft.seo.robots} onChange={(value) => updateSeo('robots', value)} placeholder="index, follow" />
                  <TextField label="Locale" value={draft.seo.locale} onChange={(value) => updateSeo('locale', value)} placeholder="fr_MA" />
                  <TextField label="Schema type" value={draft.seo.businessType} onChange={(value) => updateSeo('businessType', value)} placeholder="ProfessionalService" />
                </div>
                <div className="mt-5 grid gap-5">
                  <TextAreaField label="Meta description par défaut" value={draft.seo.defaultDescription} onChange={(value) => updateSeo('defaultDescription', value)} help="Garde une description claire, humaine et spécifique au service. Environ 140–160 caractères quand possible." />
                  <TextAreaField label="Mots-clés éditoriaux" value={draft.seo.keywords} onChange={(value) => updateSeo('keywords', value)} help="À utiliser comme rappel éditorial. Évite le bourrage de mots-clés dans les pages." />
                </div>
                <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-sm leading-7 text-muted">
                  <p className="font-bold text-navy">Conseils de rédaction SEO :</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5">
                    <li>Rédige un titre clair qui présente l’activité de FALKAOH CONSULTING.</li>
                    <li>Écris une description courte qui explique la valeur apportée au visiteur.</li>
                    <li>Utilise des mots simples recherchés par les clients : conseil, accompagnement, études, formations.</li>
                    <li>Garde un ton professionnel, naturel et orienté besoin client.</li>
                    <li>Évite les répétitions inutiles et les phrases trop longues.</li>
                  </ul>
                </div>
              </Card>
            ) : null}

            {activeTab === 'services' ? (
              <Card className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-navy">Services</h3>
                    <p className="mt-1 text-sm text-muted">Chaque service alimente la page /services et sa page détail.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={addService}>Ajouter un service</Button>
                </div>
                <div className="mt-6 grid gap-6">
                  {draft.services.map((service, index) => (
                    <details key={`${service.slug}-${index}`} className="rounded-3xl border border-border bg-surface p-5" open={index === 0}>
                      <summary className="cursor-pointer text-lg font-black text-navy">{service.title || `Service ${index + 1}`}</summary>
                      <div className="mt-5 grid gap-5">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <Label htmlFor={fieldId('service', index, 'title')}>Titre</Label>
                            <Input id={fieldId('service', index, 'title')} value={service.title} onChange={(event) => updateService(index, 'title', event.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={fieldId('service', index, 'slug')}>Slug URL</Label>
                            <Input id={fieldId('service', index, 'slug')} value={service.slug} onChange={(event) => updateService(index, 'slug', event.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={fieldId('service', index, 'icon')}>Icône lucide</Label>
                            <Select id={fieldId('service', index, 'icon')} value={service.icon} onChange={(event) => updateService(index, 'icon', event.target.value)}>
                              <option value="scale">Scale</option>
                              <option value="landmark">Landmark</option>
                              <option value="users">Users</option>
                              <option value="users-round">Users round</option>
                              <option value="file-chart-column">File chart</option>
                              <option value="clipboard-list">List</option>
                              <option value="leaf">Leaf</option>
                              <option value="handshake">Handshake</option>
                              <option value="globe">Globe</option>
                              <option value="store">Store</option>
                              <option value="ship">Ship</option>
                              <option value="building-2">Building</option>
                              <option value="monitor-smartphone">Monitor</option>
                              <option value="clipboard-check">Audit</option>
                              <option value="graduation-cap">Graduation</option>
                              <option value="folder-kanban">Folder</option>
                              <option value="book-open">Book</option>
                              <option value="microscope">Microscope</option>
                              <option value="briefcase-business">Briefcase</option>
                              <option value="chart-no-axes-combined">Chart</option>
                              <option value="presentation">Presentation</option>
                              <option value="chart-spline">Growth</option>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={fieldId('service', index, 'image')}>Image</Label>
                            <Input id={fieldId('service', index, 'image')} value={service.image} onChange={(event) => updateService(index, 'image', event.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={fieldId('service', index, 'imageAlt')}>Alt image</Label>
                            <Input id={fieldId('service', index, 'imageAlt')} value={service.imageAlt} onChange={(event) => updateService(index, 'imageAlt', event.target.value)} />
                          </div>
                        </div>
                        <TextAreaField label="Résumé" value={service.summary} onChange={(value) => updateService(index, 'summary', value)} />
                        <TextAreaField label="Description" value={service.description} onChange={(value) => updateService(index, 'description', value)} rows={5} />
                        <div className="grid gap-5 md:grid-cols-2">
                          {arrayFields.map((field) => (
                            <TextAreaField
                              key={field}
                              label={String(field)}
                              value={listToText(service[field] as string[])}
                              onChange={(value) => updateService(index, field, textToList(value))}
                              help="Une ligne = un élément."
                            />
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button type="button" variant="danger" onClick={() => removeService(index)}>Supprimer ce service</Button>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </Card>
            ) : null}

            {activeTab === 'statistics' ? (
              <Card className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-black text-navy">Statistiques</h3>
                  <Button type="button" variant="outline" onClick={addStatistic}>Ajouter</Button>
                </div>
                <div className="mt-6 grid gap-4">
                  {draft.statistics.map((statistic, index) => (
                    <div key={`${statistic.label}-${index}`} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="grid gap-4 md:grid-cols-[0.5fr_1fr_1.5fr_auto] md:items-end">
                        <TextField label="Valeur" value={statistic.value} onChange={(value) => updateStatistic(index, 'value', value)} />
                        <TextField label="Libellé" value={statistic.label} onChange={(value) => updateStatistic(index, 'label', value)} />
                        <TextField label="Description" value={statistic.description} onChange={(value) => updateStatistic(index, 'description', value)} />
                        <Button type="button" variant="danger" onClick={() => removeStatistic(index)}>Supprimer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {activeTab === 'testimonials' ? (
              <Card className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-black text-navy">Témoignages</h3>
                  <Button type="button" variant="outline" onClick={addTestimonial}>Ajouter</Button>
                </div>
                <div className="mt-6 grid gap-4">
                  {draft.testimonials.map((testimonial, index) => (
                    <div key={`${testimonial.name}-${index}`} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField label="Nom" value={testimonial.name} onChange={(value) => updateTestimonial(index, 'name', value)} />
                        <TextField label="Rôle" value={testimonial.role} onChange={(value) => updateTestimonial(index, 'role', value)} />
                      </div>
                      <div className="mt-4">
                        <TextAreaField label="Citation" value={testimonial.quote} onChange={(value) => updateTestimonial(index, 'quote', value)} />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button type="button" variant="danger" onClick={() => removeTestimonial(index)}>Supprimer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {activeTab === 'process' ? (
              <Card className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-black text-navy">Processus d’accompagnement</h3>
                  <Button type="button" variant="outline" onClick={addProcessStep}>Ajouter</Button>
                </div>
                <div className="mt-6 grid gap-4">
                  {draft.processSteps.map((step, index) => (
                    <div key={`${step.title}-${index}`} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
                        <TextField label="Titre" value={step.title} onChange={(value) => updateProcessStep(index, 'title', value)} />
                        <TextField label="Description" value={step.description} onChange={(value) => updateProcessStep(index, 'description', value)} />
                        <Button type="button" variant="danger" onClick={() => removeProcessStep(index)}>Supprimer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
