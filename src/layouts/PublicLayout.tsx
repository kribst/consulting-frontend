import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { LoadingState } from '../components/ui/State'
import { useSiteContent } from '../features/content/SiteContentContext'
import ScrollTop from '../components/ui/ScrollTop'

export function PublicLayout() {
  const location = useLocation()
  const { isLoading } = useSiteContent()

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface p-4">
        <LoadingState label="Chargement du contenu..." variant="minimal" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />
      <main key={location.pathname} className="animate-route-enter">
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
    </div>
  )
}
