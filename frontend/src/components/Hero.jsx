import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Code2 } from 'lucide-react'
import Button from './ui/Button'
import HeroBackground from './HeroBackground'
import { ArrowRight, ArrowDown, MapPin } from './ui/Icons'
import useSectionNav from '../hooks/useSectionNav'
import { useSettings } from '../context/SettingsContext'

/* Per-word mask reveal: each word sits in an overflow-hidden box and slides up. */
const lineParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const wordInner = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}
const fadeRise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// Diagonal-cut panel: left edge slants from 22% (top) to 0% (bottom).
const DIAG_SHOWN = 'polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)'
const DIAG_HIDDEN = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'

/* The portrait itself — grayscale, anchored to the bottom, with a graceful
   code-glyph placeholder if the image is missing. */
function HeroPhoto({ src, error, onError, className = '' }) {
  if (error) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-base-indigo text-heading ${className}`}>
        <Code2 size={72} strokeWidth={1.1} aria-hidden="true" />
      </div>
    )
  }
  return (
    /* REPLACE WITH YOUR PHOTO — right-side portrait, a transparent/cutout PNG
       works best. Set it in Admin → Settings (profile_photo) or drop a file at
       /public/assets/me.png */
    <img
      src={src}
      alt="Portrait of EL MASDOUKI Hamza, full-stack developer"
      loading="lazy"
      decoding="async"
      onError={onError}
      className={`h-full w-full object-cover object-bottom grayscale ${className}`}
    />
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const goToSection = useSectionNav()
  const { settings } = useSettings()
  const [photoError, setPhotoError] = useState(false)
  const sectionRef = useRef(null)

  const words = (settings.hero_title || 'I turn ideas into working software.').trim().split(/\s+/)
  const eyebrow = settings.hero_eyebrow || 'Full-Stack Developer'
  const photoSrc = settings.profile_photo || '/assets/me.png'

  // If the fallback 404'd before settings arrived, give the REAL photo URL a
  // fresh chance once it lands — otherwise the placeholder would stick even
  // after a photo is uploaded in the dashboard.
  useEffect(() => {
    setPhotoError(false)
  }, [photoSrc])

  // Subtle photo parallax on scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen overflow-hidden">
      {/* Animated constellation / network-map background */}
      <HeroBackground />

      {/* Readability gradient: solid dark under the text, clearing to the right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40 lg:via-ink/70 lg:to-transparent" />

      {/* Right diagonal-cut photo panel (desktop) — clip-path wipe reveal */}
      <motion.div
        initial={{ clipPath: reduce ? DIAG_SHOWN : DIAG_HIDDEN }}
        animate={{ clipPath: DIAG_SHOWN }}
        transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1], delay: 0.45 }}
        className="absolute inset-y-0 right-0 z-[1] hidden w-[56%] xl:w-[52%] lg:block"
      >
        <motion.div style={{ y: reduce ? 0 : photoY }} className="h-[112%] w-full">
          <HeroPhoto src={photoSrc} error={photoError} onError={() => setPhotoError(true)} />
        </motion.div>
        {/* Blend the panel's left edge into the dark background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
      </motion.div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center pt-28 pb-24 sm:pt-32">
        <div className="container-px w-full">
          <div className="flex gap-6 sm:gap-8">
            {/* Vertical rule */}
            <motion.span
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="mt-1 w-px shrink-0 origin-top self-stretch bg-white/20"
            />

            <div className="max-w-3xl">
              {/* Eyebrow */}
              <motion.div
                variants={fadeRise}
                initial="hidden"
                animate="show"
                className="mb-7 flex items-center gap-3"
              >
                {settings.available !== false && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white/60 motion-safe:animate-pulse-ring" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
                <span className="eyebrow">{eyebrow}</span>
              </motion.div>

              {/* Headline — per-word mask reveal */}
              <motion.h1
                variants={lineParent}
                initial="hidden"
                animate="show"
                className="font-heading font-semibold leading-[1.02] tracking-[-0.03em] text-heading text-[clamp(2.5rem,7vw,5.75rem)]"
              >
                {words.map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <motion.span variants={wordInner} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              {/* Supporting line — location / rhythm */}
              {settings.hero_location && (
                <motion.div
                  variants={fadeRise}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.9 }}
                  className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted sm:text-sm"
                >
                  <MapPin size={15} aria-hidden="true" className="shrink-0" />
                  <span>{settings.hero_location}</span>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div
                variants={fadeRise}
                initial="hidden"
                animate="show"
                transition={{ delay: 1.05 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Button
                  as="a"
                  href="#contact"
                  onClick={(e) => goToSection('#contact', e)}
                  className="px-7 py-3"
                >
                  Start a project
                  <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="secondary"
                  as="a"
                  href="#projects"
                  onClick={(e) => goToSection('#projects', e)}
                  className="px-7 py-3"
                >
                  See selected work
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Photo (mobile / tablet) — stacked below the text, subtle diagonal top */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="relative mx-auto mt-14 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[4px] border border-line lg:hidden"
            style={{ clipPath: 'polygon(0 7%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <HeroPhoto src={photoSrc} error={photoError} onError={() => setPhotoError(true)} />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 text-[11px] uppercase tracking-[0.14em] text-white/70">
              <span>Based remotely</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 text-muted sm:block"
      >
        <motion.div animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={20} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  )
}
