import type { ReactNode } from 'react'

type AlertType = 'success' | 'error' | 'info'

const classes: Record<AlertType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
}

export function Alert({ type = 'info', children }: { type?: AlertType; children: ReactNode }) {
  return <div className={`animate-alert-in rounded-2xl border p-4 text-sm font-medium ${classes[type]}`}>{children}</div>
}
