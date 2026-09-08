import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Label({ children, className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className={`mb-2 block text-sm font-semibold text-ink ${className}`} {...props}>
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`focus-ring w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted transition-all duration-200 focus:border-gold ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`focus-ring min-h-36 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted transition-all duration-200 focus:border-gold ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`focus-ring w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink transition-all duration-200 focus:border-gold ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-2 text-sm font-medium text-danger animate-alert-in">{message}</p>
}
