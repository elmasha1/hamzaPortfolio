import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import CountUp from './ui/CountUp'
import Meta from './ui/Meta'

/**
 * MetricsRule — the proof strip that closes the hero.
 *
 * A full-bleed band of four cells divided by interior hairlines (the 1px grid
 * gaps are the rules), numbers at the h2 token, labels in mono. This is the
 * first visual anchor and the "why should I care" answer above the fold — and
 * it costs one row of hairlines, no new colour.
 *
 * Dashboard-driven via `settings.metrics` — self-hides when empty.
 */
export default function MetricsRule({ metrics = [] }) {
  const items = Array.isArray(metrics) ? metrics.filter((m) => m && (m.value || m.label)) : []
  if (items.length === 0) return null

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mt-14 grid grid-cols-2 gap-px border-t border-rule bg-rule-soft sm:mt-20 lg:grid-cols-4"
    >
      {items.map((m, i) => (
        <motion.div key={m.label || i} variants={fadeUp(16)} className="cell px-5 py-7 sm:px-8 lg:px-10">
          <div className="font-heading text-h2 font-semibold text-ink-100">
            <CountUp value={m.value} suffix={m.suffix || ''} />
          </div>
          <Meta caps className="mt-3 block max-w-[22ch] tracking-[0.05em]">
            {m.label}
          </Meta>
        </motion.div>
      ))}
    </motion.div>
  )
}
