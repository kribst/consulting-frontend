import { BrowserRouter } from 'react-router-dom'
import { SiteContentProvider } from './features/content/SiteContentContext'
import { AuthProvider } from './features/auth/AuthContext'
import { AppRouter } from './router/AppRouter'
import { ScrollToTop } from './router/ScrollToTop'

export function App() {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppRouter />
        </AuthProvider>
      </SiteContentProvider>
    </BrowserRouter>
  )
}
