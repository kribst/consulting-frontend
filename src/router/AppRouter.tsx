import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminConnexionPage } from '../pages/admin/AdminConnexionPage'
import { AdminContentPage } from '../pages/admin/AdminContentPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminMessageDetailsPage } from '../pages/admin/AdminMessageDetailsPage'
import { AdminMessagesPage } from '../pages/admin/AdminMessagesPage'
import { AdminNewsletterPage } from '../pages/admin/AdminNewsletterPage'
import { AdminTeamPage } from '../pages/admin/AdminTeamPage'
import { AdminTestimonialsPage } from '../pages/admin/AdminTestimonialsPage'
import { AccueilPage } from '../pages/public/AccueilPage'
import { ContactPage } from '../pages/public/ContactPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'
import { QuiSommesNousPage } from '../pages/public/QuiSommesNousPage'
import { ServiceDetailsPage } from '../pages/public/ServiceDetailsPage'
import { ServicesPage } from '../pages/public/ServicesPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/a-propos" element={<QuiSommesNousPage />} />
        <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/connexion" element={<AdminConnexionPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/tableau-de-bord" replace />} />
        <Route path="tableau-de-bord" element={<AdminDashboardPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="messages/:id" element={<AdminMessageDetailsPage />} />
        <Route path="newsletter" element={<AdminNewsletterPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="contenu" element={<AdminContentPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
