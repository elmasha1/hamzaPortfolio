import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import Meta from './ui/Meta'
import useScrollProgressBeam from '../hooks/useScrollProgressBeam'
import { fetchJourney } from '../lib/api'
import { useSettings } from '../context/SettingsContext'

/**
 * Group consecutive milestones under their date label, so the timeline reads
 * as "2021 · 2023 · 2024 · Present" at a glance instead of repeating the year
 * on every row. Entries with no date fall into the group above them.
 */
function groupByDate(milestones) {
  const groups = []
  for (const m of milestones) {
    const label = (m.date_label || '').trim()
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(m)
    else groups.push({ label, items: [m] })
  }
  return groups
}

/* One milestone row. */
function Entry({ milestone }) {
  const tags = Array.isArray(milestone.tags) ? milestone.tags : []
  return (
    <motion.div
      variants={fadeUp(20)}
      className="relative grid gap-x-8 gap-y-3 border-b border-rule-soft py-7 md:grid-cols-[1fr_auto] md:items-baseline"
    >
      {/* 6px tick on the rail — the rail sits one grid gap to the left. */}
      <span
        aria-hidden="true"
        className="absolute left-[-2.5rem] top-[2.4rem] hidden h-px w-1.5 -translate-x-[3px] bg-ink-100 md:block"
      />
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="text-[1.25rem] font-medium leading-[1.3] text-ink-100">
            {milestone.title}
          </h3>
          {milestone.kind && (
            <Meta caps className="border border-rule-soft px-2 py-0.5 tracking-[0.08em]">
              {milestone.kind}
            </Meta>
          )}
        </div>
        {milestone.description && (
          <p className="mt-2.5 max-w-[60ch] text-small text-ink-300">{milestone.description}</p>
        )}
      </div>

      {tags.length > 0 && (
        <Meta caps className="tracking-[0.05em] md:whitespace-nowrap md:text-right">
          {tags.join(' · ')}
        </Meta>
      )}
    </motion.div>
  )
}

/**
 * Journey — the timeline re-cut as a dated editorial index.
 *
 * The old version ran four effects to do one job (glowing beam, alternating
 * sides, blur-in cascade, haloed dots) and made the date — the actual
 * credibility signal — the smallest text in the row. Now: one column, years
 * loud and sticky beside their entries, a single hairline rail with a tick per
 * entry, and a mono kind chip so the mix of education, freelance and product
 * work is legible.
 *
 * Milestones come from GET /api/journey, falling back to seeded settings.
 */
export default function Journey({ scope = 'Home', index = '04' }) {
  const { settings } = useSettings()
  const reduce = useReducedMotion()
  const trackRef = useRef(null)
  const beam = useScrollProgressBeam(trackRef)

  const [milestones, setMilestones] = useState(
    Array.isArray(settings.journey) ? settings.journey : []
  )

  // Prefer the table; gracefully fall back to seeded settings defaults.
  useEffect(() => {
    let alive = true
    fetchJourney()
      .then((data) => {
        if (alive && Array.isArray(data) && data.length) setMilestones(data)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const groups = useMemo(() => groupByDate(milestones), [milestones])

  if (milestones.length === 0) return null

  return (
    <section id="journey" className="section-y relative">
      <div className="container-px">
        {/* Header */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          <SectionLabel scope={scope} index={index}>
            Journey
          </SectionLabel>
          <SplitTextReveal
            as="h2"
            text={settings.journey_heading || 'From zero to full-stack.'}
            amount={0.4}
            className="font-heading text-h2 font-semibold text-ink-100"
          />
          {settings.journey_intro && (
            <motion.p variants={fadeUp(20)} className="mt-6 max-w-[55ch] text-ink-300">
              {settings.journey_intro}
            </motion.p>
          )}
        </motion.div>

        {/* Timeline */}
        <div ref={trackRef} className="relative mt-14 lg:mt-16">
          {/* A single hairline rail, and the scroll-linked fill over it. No
              glow, no haloed dots — the rail is structure, not decoration.
              Dropped entirely below md, where it was 16px of decoration in a
              320px column. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[7rem] hidden w-px bg-rule md:block"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : beam }}
            className="pointer-events-none absolute inset-y-0 left-[7rem] hidden w-px origin-top bg-ink-100 md:block"
          />

          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
          >
            {groups.map((group, gi) => (
              <div
                key={`${group.label}-${gi}`}
                className="md:grid md:grid-cols-[7rem_1fr] md:gap-x-10"
              >
                {/* The year: a hairline-underlined header on mobile, a sticky
                    marker beside its entries from md up. */}
                <div className="relative">
                  {group.label && (
                    <motion.div
                      variants={fadeUp(16)}
                      className="border-b border-rule pb-2 pt-8 first:pt-0 md:sticky md:top-28 md:border-0 md:pb-0 md:pt-7"
                    >
                      <span className="tabular font-heading text-h3 font-medium text-ink-100">
                        {group.label}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div>
                  {group.items.map((m, i) => (
                    <Entry key={m.id ?? `${gi}-${i}`} milestone={m} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
