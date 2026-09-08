import type { Testimonial } from '../../types'
import { Card } from '../ui/Card'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="p-6 hover:border-gold/40 hover:shadow-soft">
      <div className="mb-4 text-3xl text-gold" aria-hidden="true">“</div>
      <p className="leading-7 text-ink">{testimonial.quote}</p>
      <div className="mt-6 border-t border-border pt-4">
        <p className="font-bold text-navy">{testimonial.name}</p>
        <p className="text-sm text-muted">{testimonial.role}</p>
      </div>
    </Card>
  )
}
