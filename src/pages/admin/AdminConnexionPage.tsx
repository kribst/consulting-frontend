import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Reveal } from '../../components/motion/Reveal'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FormError, Input, Label } from '../../components/ui/Form'
import { PageMeta } from '../../components/ui/PageMeta'
import { useSiteContent } from '../../features/content/SiteContentContext'
import { useAuth } from '../../features/auth/AuthContext'

export function AdminConnexionPage() {
  const { user, login } = useAuth()
  const { content } = useSiteContent()
  const { company } = content
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (user) return <Navigate to="/admin/tableau-de-bord" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Veuillez saisir l’email et le mot de passe.')
      return
    }
    setIsLoading(true)
    try {
      await login(email, password)
      const from = typeof location.state === 'object' && location.state && 'from' in location.state ? String(location.state.from) : '/admin/tableau-de-bord'
      navigate(from, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Connexion impossible.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-surface p-4">
      <PageMeta title="Connexion admin" description="Connexion à l’espace admin FALKAOH CONSULTING." />
      <Reveal className="w-full max-w-md">
      <Card className="w-full p-6 sm:p-8 hover:border-gold/40 hover:shadow-soft">
        <div className="text-center">
          <img src={company.logo} alt={company.logoAlt} className="mx-auto h-14 w-auto" />
          <h1 className="mt-5 text-2xl font-black text-navy">Connexion administration</h1>
          <p className="mt-2 text-sm text-muted">{company.shortName} — ESPACE D'ADMINISTRATION</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          {error ? <Alert type="error">{error}</Alert> : null}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="adresse@email.com"
            />
            <FormError />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
            />
          </div>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

      </Card>
      </Reveal>
    </section>
  )
}
