import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import Button from './ui/Button'
import Meta from './ui/Meta'
import MetricsRule from './MetricsRule'
import { ArrowRight } from './ui/Icons'
import useSectionNav from '../hooks/useSectionNav'
import { useSettings } from '../context/SettingsContext'

/* One reveal, 900ms, 60ms apart: rail → H1 words → paragraph/CTAs → portrait
   → proof strip. Nothing here is scroll-linked. */
const seq = (i) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] } },
})

const headline = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
}
const word = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* The straight-crop plate behind / instead of the portrait. */
const HATCH = {
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 1px, transparent 1px 9px)',
}

/**
 * StackChain — "what I own, end to end" as a request path: CLIENT → API →
 * QUEUE → DB → CI/CD → MONITORING. Nodes light up in sequence (CSS only).
 * This is the old decorative constellation given a job.
 */
function StackChain({ label, nodes }) {
  if (!nodes.length) return null
  return (
    <div className="mt-14 border-t border-rule-soft pt-6">
      <Meta caps>{label}</Meta>
      {/* Six labelled nodes don't fit a 320px column — the chain scrolls
          horizontally on small screens rather than wrapping, which would
          break the left-to-right reading the diagram exists to show. */}
      <div className="mt-6 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex min-w-max items-start sm:min-w-0">
          {nodes.map((n, i) => (
            <div key={n} className="contents">
              {i > 0 && (
                <span aria-hidden="true" className="mx-2.5 mt-[5px] h-px min-w-[24px] flex-1 bg-rule" />
              )}
              <div className="flex shrink-0 flex-col items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="hero-node block h-3 w-3 border border-white/35"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
                <Meta caps className="whitespace-nowrap tracking-[0.06em]">
                  {n}
                </Meta>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* The portrait itself — grayscale, bottom-anchored, straight crop. */
function Portrait({ src, error, onError }) {
  if (error || !src) {
    return (
      <div
        style={HATCH}
        className="flex h-full w-full flex-col items-center justify-end gap-3 bg-paper-2 pb-8 text-ink-500"
      >
        <Code2 size={56} strokeWidth={1} aria-hidden="true" />
        <Meta className="tracking-[0.06em]">PORTRAIT / 4:5</Meta>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt="Portrait of EL MASDOUKI Hamza, full-stack developer"
      loading="eager"
      decoding="async"
      width="800"
      height="1000"
      onError={onError}
      className="h-full w-full object-cover object-bottom grayscale"
    />
  )
}

const DEFAULT_RAIL = ['Rabat, MA', 'UTC+1', 'Available Sep 2026', 'Remote or on-site']
const DEFAULT_CHAIN = ['Client', 'API', 'Queue', 'DB', 'CI / CD', 'Monitoring']

export default function Hero() {
  const reduce = useReducedMotion()
  const goToSection = useSectionNav()
  const { settings } = useSettings()
  const [photoError, setPhotoError] = useState(false)

  const words = String(
    settings.hero_title || 'Full-stack engineer. I build, ship and maintain production software.'
  )
    .trim()
    .split(/\s+/)
  const photoSrc = settings.profile_photo || ''

  // The utility rail reuses the existing dashboard field: one line of short
  // facts separated by "·".
  const rail = String(settings.hero_location || '')
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
  const railItems = rail.length ? rail : DEFAULT_RAIL

  const chain = settings.hero_chain || {}
  const chainNodes = Array.isArray(chain.nodes) && chain.nodes.length ? chain.nodes : DEFAULT_CHAIN

  // If the fallback 404'd before settings arrived, give the REAL photo URL a
  // fresh chance once it lands.
  useEffect(() => {
    setPhotoError(false)
  }, [photoSrc])

  return (
    <section
      id="home"
      className="relative flex min-h-[88svh] flex-col justify-center pt-28 sm:pt-32 lg:min-h-0 lg:pt-40"
    >
      <div className="container-px">
        {/* BAND 1 — utility rail */}
        <motion.div
          variants={seq(0)}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-eyebrow font-medium uppercase text-ink-500"
        >
          {settings.available !== false && (
            <span aria-hidden="true" className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/50 motion-safe:animate-pulse-ring" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-ink-100" />
            </span>
          )}
          {railItems.map((item, i) => (
            <span key={item} className={i === 0 ? 'text-ink-300' : undefined}>
              {i > 0 && <span className="mr-3.5 text-ink-700">·</span>}
              {item}
            </span>
          ))}
        </motion.div>

        {/* BANDS 2–4 — headline + positioning + portrait + proof strip.
            Mobile order: text → proof strip → portrait (full-bleed band).
            Desktop order: text | portrait, then the proof strip beneath. */}
        <div className="mt-10 flex flex-col gap-y-14 lg:mt-11 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          {/* BAND 2 + positioning */}
          <div className="order-1 lg:col-span-8 lg:pr-6">
            <motion.h1
              variants={headline}
              initial="hidden"
              animate="show"
              className="font-heading text-h1 font-semibold text-ink-100"
            >
              {words.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                  <motion.span variants={word} className="inline-block">
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {settings.hero_subtitle && (
              <motion.p
                variants={seq(3)}
                initial="hidden"
                animate="show"
                className="mt-8 max-w-[52ch] text-lead text-ink-300"
              >
                {settings.hero_subtitle}
              </motion.p>
            )}

            <motion.div
              variants={seq(4)}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button as="a" href="#contact" onClick={(e) => goToSection('#contact', e)}>
                Start a project
                <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
              <Button
                variant="secondary"
                as="a"
                href="#projects"
                onClick={(e) => goToSection('#projects', e)}
              >
                See selected work
              </Button>
            </motion.div>

            <motion.div variants={seq(5)} initial="hidden" animate="show">
              <StackChain
                label={chain.label || 'What I own, end to end'}
                nodes={chainNodes}
              />
            </motion.div>
          </div>

          {/* BAND 3 — portrait. Full-bleed 3:2 band on mobile, 4:5 crop on the
              grid from lg up. No diagonal, no parallax. */}
          <motion.div
            initial={{ clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.9, delay: 0.36, ease: [0.76, 0, 0.24, 1] }}
            className="order-3 -mx-5 aspect-[3/2] border-y border-rule-soft sm:-mx-8 lg:order-2 lg:col-span-4 lg:mx-0 lg:aspect-[4/5] lg:border lg:border-rule-soft"
          >
            <Portrait src={photoSrc} error={photoError} onError={() => setPhotoError(true)} />
          </motion.div>

          {/* BAND 4 — proof strip, full-bleed on every breakpoint */}
          <div className="order-2 -mx-5 sm:-mx-8 lg:order-3 lg:col-span-12 lg:-mx-14">
            <MetricsRule metrics={settings.metrics} />
          </div>
        </div>
      </div>
    </section>
  )
}
