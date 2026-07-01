import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import { fetchCv } from '../lib/api'

/**
 * Experience — a professional timeline driven by the same CV data edited in
 * the dashboard (Admin → CV / Resume), so there's a single source of truth.
 */
export default function Experience() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    fetchCv()
      .then((cv) => {
        if (alive && Array.isArray(cv?.experiences)) setItems(cv.experiences)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (items.length === 0) return null

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="container-px">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel num="04">Experience</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="Where I've made an impact."
            amount={0.4}
            className="max-w-[16ch] font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-heading"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 max-w-3xl"
        >
          <div className="relative border-l border-line pl-8 sm:pl-10">
            {items.map((e, i) => {
              const bullets = String(e.description || '')
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
              const dates = [e.start, e.end].filter(Boolean).join(' – ')
              return (
                <motion.div
                  key={i}
                  variants={fadeUp(24)}
                  className="relative pb-12 last:pb-0"
                >
                  {/* Timeline node */}
                  <span className="absolute -left-[2.35rem] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-line bg-ink sm:-left-[2.85rem]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>

                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] text-heading">
                      {e.title}
                    </h3>
                    {dates && (
                      <span className="text-xs uppercase tracking-[0.12em] text-muted">{dates}</span>
                    )}
                  </div>
                  {e.company && (
                    <p className="mt-1 text-sm font-medium text-body">{e.company}</p>
                  )}
                  {bullets.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-3 text-[15px] leading-[1.6] text-body">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
