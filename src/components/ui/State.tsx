import { ButtonLink } from './Button'

export function LoadingState({ label = 'Chargement en cours...', variant = 'default' }: { label?: string; variant?: 'default' | 'minimal' }) {
  if (variant === 'minimal') {
    return <p className="text-lg font-medium text-muted">{label}</p>
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
      <div className="grid gap-4" aria-hidden="true">
        <div className="skeleton-shimmer h-5 w-40 rounded-full" />
        <div className="skeleton-shimmer h-16 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="skeleton-shimmer h-10 rounded-xl" />
          <div className="skeleton-shimmer h-10 rounded-xl" />
          <div className="skeleton-shimmer h-10 rounded-xl" />
        </div>
      </div>
      <p className="mt-5 text-center font-medium text-muted">{label}</p>
    </div>
  )
}

export function ErrorState({ title = 'Une erreur est survenue', message }: { title?: string; message?: string }) {
  return (
    <div className="animate-alert-in rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
      <p className="text-lg font-bold text-danger">{title}</p>
      {message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null}
    </div>
  )
}

export function EmptyState({ title, message, actionTo, actionLabel }: { title: string; message: string; actionTo?: string; actionLabel?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-soft-gold text-2xl motion-icon" aria-hidden="true">
        ◌
      </div>
      <p className="text-lg font-bold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{message}</p>
      {actionTo && actionLabel ? (
        <ButtonLink to={actionTo} className="mt-5">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  )
}
