import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-gold/30 bg-soft-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy ${className}`}>
      {children}
    </span>
  )
}
