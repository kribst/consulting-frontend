import type { HTMLAttributes, ReactNode } from 'react'

export function Card({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`motion-card rounded-3xl border border-border bg-white shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
