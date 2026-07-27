import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import Meta from './ui/Meta'

/**
 * Process — "How I work": four hairline rows (scope → build → ship →
 * maintain), each carrying one concrete artefact in mono at the right edge.
 * The artefacts are what make a process claim credible — without them this is
 * the section every portfolio already has.
 *
 * Placed after Selected work on purpose: method reads better as the
 * explanation of work you have just seen than as a promise before it.
 *
 * Dashboard-driven via `settings.process` — self-hides when empty.
 */
export default function Process({ steps = [], heading, scope = 'Home', index = '03' }) {
  const rows = Array.isArray(steps) ? steps.filter((s) => s && s.title) : []
  if (rows.length === 0) return null

  return (
    <section id="process" className="section-y relative">
      <div className="container-px">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel scope={scope} index={index}>
            How I work
          </SectionLabel>
          <SplitTextReveal
            as="h2"
            text={heading || 'How I work.'}
            amount={0.4}
            className="max-w-[20ch] font-heading text-h2 font-semibold text-ink-100"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 border-t border-rule lg:mt-16"
        >
          {rows.map((step, i) => (
            <motion.div
              key={step.title || i}
              variants={fadeUp(24)}
              className="row grid grid-cols-[2rem_1fr] items-baseline gap-x-5 gap-y-2 px-2 py-8 md:grid-cols-[3rem_0.9fr_1.4fr_auto] md:gap-x-8"
            >
              <Meta className="pt-1">{String(i + 1).padStart(2, '0')}</Meta>

              <h3 className="font-heading text-h3 font-medium text-ink-100">{step.title}</h3>

              {step.body && (
                <p className="col-span-2 max-w-[52ch] text-small text-ink-300 md:col-span-1">
                  {step.body}
                </p>
              )}

              {step.artifact && (
                <Meta
                  caps
                  tone="body"
                  className="col-span-2 tracking-[0.05em] md:col-span-1 md:whitespace-nowrap md:text-right"
                >
                  {step.artifact}
                </Meta>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
