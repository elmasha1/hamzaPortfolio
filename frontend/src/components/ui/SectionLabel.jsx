import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

/**
 * SectionLabel — a numbered, wide-tracked uppercase eyebrow, e.g.
 * "01 ── Selected work". Drops into any stagger container (it carries the
 * fadeUp variant) for a consistent, premium section header across the site.
 */
export default function SectionLabel({ num, children, className = '' }) {
  return (
    <motion.span
      variants={fadeUp(16)}
      className={`mb-5 inline-flex items-center gap-3 ${className}`}
    >
      {num && (
        <>
          <span className="tabular font-heading text-xs font-semibold text-primary/70">
            {num}
          </span>
          <span className="h-px w-7 bg-gradient-to-r from-primary/50 to-transparent" />
        </>
      )}
      <span className="eyebrow">{children}</span>
    </motion.span>
  )
}
