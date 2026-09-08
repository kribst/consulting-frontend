import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonLinkProps = BaseProps & LinkProps & {
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2e6061] text-white hover:bg-[#254f4e] border border-[#2e6061] shadow-sm',
  secondary:
    'bg-navy text-white hover:bg-deep-blue border border-navy shadow-sm',
  outline:
    'bg-white text-navy hover:bg-surface border border-border',
  ghost: 'bg-transparent text-navy hover:bg-surface border border-transparent',
  danger: 'bg-danger text-white hover:bg-red-700 border border-danger shadow-sm',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
