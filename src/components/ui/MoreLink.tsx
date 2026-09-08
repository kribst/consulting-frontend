import { Link } from 'react-router-dom'

type MoreLinkProps = {
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MoreLink({ to, children, className = '', style }: MoreLinkProps) {
  return (
    <Link className={`my_more_btn ${className}`.trim()} to={to} style={{ marginTop: '16px', display: 'inline-block', ...(style ?? {}) }}>
      {children}
    </Link>
  )
}
