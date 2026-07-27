import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import SplitTextReveal from './ui/SplitTextReveal'

/**
 * TimelineItem — a single "My Journey" milestone. On desktop it alternates
 * sides of the centre line (`side` 0 = left, 1 = right); on mobile everything
 * stacks to the right of a left-aligned line. Hidden until scrolled to, then it
 * reveals: dot brightens + scales, and the inner elements cascade in
 * (date → title → text → tags) fading + sliding toward the line, blur clearing.
 * GPU-only; honours prefers-reduced-motion.
 */
export default function TimelineItem({ milestone, side = 0 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const active = useInView(ref, { once: true, amount: 0.6 })
  const tags = Array.isArray(milestone.tags) ? milestone.tags : []
  const left = side === 0

  // Cascade: each inner element slides in toward the line with a clearing blur.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  }
  const child = {
    hidden: { opacity: 0, x: reduce ? 0 : left ? -26 : 26, filter: reduce ? 'blur(0px)' : 'blur(6px)' },
    show: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <div ref={ref} className="group relative py-8 first:pt-0 last:pb-0">
      {/* Node on the line */}
      <span aria-hidden="true" className="absolute left-4 top-10 z-10 -translate-x-1/2 md:left-1/2 md:top-9">
        <motion.span
          initial={false}
          animate={{
            scale: active ? 1 : 0.55,
            backgroundColor: active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.25)',
            boxShadow: active ? '0 0 14px 3px rgba(255,255,255,0.55)' : '0 0 0 0 rgba(255,255,255,0)',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="block h-3.5 w-3.5 rounded-full ring-1 ring-white/20 group-hover:!scale-110"
        />
      </span>

      {/* Content — staggered internal reveal */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className={`pl-12 md:w-1/2 md:pl-0 ${left ? 'md:pr-14 md:text-right' : 'md:ml-auto md:pl-14'}`}
      >
        {milestone.date_label && (
          <motion.p variants={child} className="font-heading text-xs uppercase tracking-[0.16em] text-ink-500">
            {milestone.date_label}
          </motion.p>
        )}
        <motion.div variants={child}>
          <SplitTextReveal
            as="h3"
            text={milestone.title}
            amount={0.5}
            className="mt-2 font-heading text-2xl font-semibold tracking-[-0.02em] text-ink-100 transition-colors group-hover:text-white sm:text-3xl"
          />
        </motion.div>
        {milestone.description && (
          <motion.p variants={child} className={`mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-ink-300 ${left ? 'md:ml-auto' : ''}`}>
            {milestone.description}
          </motion.p>
        )}
        {tags.length > 0 && (
          <motion.div variants={child} className={`mt-4 flex flex-wrap gap-2 ${left ? 'md:justify-end' : ''}`}>
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-rule px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink-500 transition-colors group-hover:border-white/25 group-hover:text-ink-100"
              >
                {t}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
