import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { AdminTopbar } from '../components/admin/AdminTopbar'
import { useAuth } from '../features/auth/AuthContext'
import { LoadingState } from '../components/ui/State'

export function AdminLayout() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-surface p-4"><LoadingState /></div>
  }

  if (!user) {
    return <Navigate to="/admin/connexion" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-surface text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminTopbar />
        <main key={location.pathname} className="animate-route-enter p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
