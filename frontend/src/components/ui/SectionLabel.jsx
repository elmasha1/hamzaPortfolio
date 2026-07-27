import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

/**
 * SectionLabel — the numbered section eyebrow, now scoped and in mono:
 *
 *     ▪  HOME / 02 — SELECTED WORK
 *
 * The scope is what fixes the "two numbering systems" problem: home runs 01–06
 * and About runs 01–05, and because each number is prefixed with the page it
 * belongs to, the restart reads as scope rather than as a bug.
 *
 * A 4px filled tick opens the rule. Drops into any stagger container (it
 * carries the fadeUp variant).
 *
 * @param {string} scope  page scope — 'Home', 'About', 'Work'
 * @param {string} index  zero-padded section number ('02'); `num` is accepted
 *                        as a legacy alias
 */
export default function SectionLabel({ scope, index, num, children, className = '' }) {
  const number = index ?? num

  return (
    <motion.span
      variants={fadeUp(16)}
      className={`mb-6 flex items-baseline gap-4 font-mono text-eyebrow font-medium uppercase text-ink-500 ${className}`}
    >
      <span aria-hidden="true" className="h-1 w-1 shrink-0 -translate-y-[2px] bg-ink-100" />
      <span>
        {scope && <>{scope} / </>}
        {number && <>{number} — </>}
        {children}
      </span>
    </motion.span>
  )
}
