import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import ScrollTop from '../components/ui/ScrollTop'
import Loader from '../components/ui/Loader'

export function PublicLayout() {
  const location = useLocation()

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
