import type { Statistic } from '../../types'
import { AnimatedCounter } from '../motion/AnimatedCounter'

export function StatCard({ stat }: { stat: Statistic }) {
  return (
    <div className="group flex h-full min-h-[202px] flex-col rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/15">
      <p className="text-4xl font-bold text-gold">
        <AnimatedCounter value={stat.value} />
      </p>
      <p className="mt-2 font-bold">{stat.label}</p>
      <p className="mt-2 text-sm leading-6 text-white/75">{stat.description}</p>
    </div>
  )
}
