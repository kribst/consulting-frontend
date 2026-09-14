import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

export function ContactInfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="group p-5 hover:border-gold/40 hover:shadow-soft">
      <div className="flex gap-4">
        <span className="motion-icon grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-soft-gold text-navy group-hover:bg-gold" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h3 className="font-bold text-navy">{title}</h3>
          <div className="mt-1 text-sm leading-6 text-muted">{children}</div>
        </div>
      </div>
    </Card>
  )
}
