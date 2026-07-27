import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import TimelineItem from './TimelineItem'
import useScrollProgressBeam from '../hooks/useScrollProgressBeam'
import { fetchJourney } from '../lib/api'
import { useSettings } from '../context/SettingsContext'

/**
 * Journey — "My Journey": a vertical, scroll-driven timeline. A hairline centre
 * line carries a glowing progress beam whose fill (scaleY) is physically tied
 * to how far you've scrolled through the section. Milestones alternate sides on
 * desktop, stack on mobile, and their dots light up as they enter view.
 *
 * Milestones come from the dashboard-managed `journey_milestones` table
 * (GET /api/journey); falls back to settings.journey / defaults when offline.
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

  if (milestones.length === 0) return null

  return (
    <section id="journey" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-px">
        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
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
            className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink-100"
          />
          {settings.journey_intro && (
            <motion.p variants={fadeUp(20)} className="mt-6 max-w-[55ch] text-base leading-[1.7] text-ink-300">
              {settings.journey_intro}
            </motion.p>
          )}
        </motion.div>

        {/* Timeline */}
        <div ref={trackRef} className="relative mx-auto mt-16 max-w-4xl">
          {/* Static hairline rail (left on mobile, centre on desktop) */}
          <div className="pointer-events-none absolute inset-y-0 left-4 w-px -translate-x-1/2 bg-white/15 md:left-1/2" />
          {/* Glowing progress beam — scaleY tied to scroll (static full for reduced motion) */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : beam }}
            className="pointer-events-none absolute inset-y-0 left-4 w-px origin-top -translate-x-1/2 bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.5)] md:left-1/2"
          />

          <div className="relative">
            {milestones.map((m, i) => (
              <TimelineItem key={m.id ?? i} milestone={m} side={i % 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
