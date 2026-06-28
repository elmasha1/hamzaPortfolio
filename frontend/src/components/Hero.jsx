import { useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Code2 } from 'lucide-react'
import Button from './ui/Button'
import StickerField, { COLORS, shapes } from './Stickers'
import { fadeUp } from '../lib/motion'
import { ArrowRight, Download, ArrowDown } from './ui/Icons'
import { scrollToSelector } from '../lib/smoothScroll'
import { useSettings } from '../context/SettingsContext'
import { useReducedEffects } from '../hooks/usePerf'
import useCvDownload from '../hooks/useCvDownload'

/* Small stickers that orbit the photo. */
const ORBIT = [
  { shape: 'star', color: COLORS.indigo, size: 30, top: '-6%', left: '15%' },
  { shape: 'sparkle', color: COLORS.mint, size: 26, top: '10%', left: '92%' },
  { shape: 'circle', color: COLORS.sky, size: 18, top: '85%', left: '0%' },
  { shape: 'plus', color: COLORS.indigo, size: 22, top: '92%', left: '78%' },
  { shape: 'triangle', color: COLORS.mint, size: 20, top: '45%', left: '102%' },
]

/* Per-word reveal variants. */
const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const word = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

/* Animated gradient blobs behind the hero. */
function Blobs() {
  const reduce = useReducedEffects()
  const blob = (className, anim) => (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={reduce ? {} : anim}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {blob('left-[5%] top-[15%] h-72 w-72 bg-primary/20', {
        x: [0, 40, 0],
        y: [0, -30, 0],
        scale: [1, 1.15, 1],
      })}
      {blob('right-[8%] top-[10%] h-80 w-80 bg-sky/[0.16]', {
        x: [0, -50, 0],
        y: [0, 40, 0],
        scale: [1, 1.2, 1],
      })}
      {blob('left-[40%] bottom-[5%] h-72 w-72 bg-teal/[0.14]', {
        x: [0, 30, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1],
      })}
    </div>
  )
}

/* Three small dots that evenly orbit the photo ring.
   Each dot lives in a full-size layer rotated by 120°, sitting at the
   top edge; the wrapper then spins the whole set continuously. */
function OrbitingDots({ reduce }) {
  const dots = ['bg-primary', 'bg-teal', 'bg-[#93C5FD]']
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      animate={reduce ? {} : { rotate: 360 }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
    >
      {dots.map((c, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${i * 120}deg)` }}
        >
          <span
            className={`absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${c} shadow-soft`}
          />
        </div>
      ))}
    </motion.div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const still = useReducedEffects()
  const [photoError, setPhotoError] = useState(false)
  const sectionRef = useRef(null)
  const { settings } = useSettings()
  const { download: downloadCv, loading: cvLoading } = useCvDownload()

  // Headline → words for the per-word stagger; accent the final word.
  const words = (settings.hero_title || 'I build refined, high-end web experiences.')
    .trim()
    .split(/\s+/)

  // Roles → TypeAnimation sequence (text, pause, text, pause, ...).
  const roles = Array.isArray(settings.hero_roles) && settings.hero_roles.length
    ? settings.hero_roles
    : ['Full Stack Developer', 'React Developer', 'Laravel Developer']
  const roleSequence = roles.flatMap((r) => [r, 2000])

  // Parallax: the photo drifts slightly slower than the page as you scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.05])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-36 pb-28"
    >
      <Blobs />
      <StickerField density={1} />

      <div className="container-px relative z-10 grid items-center gap-16 lg:grid-cols-2">
        {/* LEFT — text */}
        <div>
          {/* Availability pill with a pulsing green dot (toggle from dashboard) */}
          {settings.available !== false && (
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pill mb-8 border border-line bg-white/[0.06] text-body shadow-soft backdrop-blur"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 motion-safe:animate-pulse-ring" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Available for work
            </motion.span>
          )}

          {/* Per-word headline stagger (last word gets the gradient accent) */}
          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="max-w-[16ch] font-heading text-hero font-semibold text-heading"
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className="mr-[0.28em] inline-block"
                style={{ transformOrigin: 'bottom' }}
              >
                {i === words.length - 1 ? (
                  <span className="gradient-text">{w}</span>
                ) : (
                  w
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Typing / rotating role */}
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.7 }}
            className="mt-6 h-[3rem] font-heading text-2xl font-medium italic text-primary sm:text-3xl"
          >
            <TypeAnimation
              key={roles.join('|')}
              sequence={roleSequence}
              speed={45}
              repeat={Infinity}
              cursor
            />
          </motion.div>

          <motion.p
            variants={fadeUp()}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-6 max-w-md text-base text-body"
          >
            {settings.hero_subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            animate="show"
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Button
              as="a"
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                scrollToSelector('#projects')
              }}
              className="px-7 py-3.5"
            >
              View work
              <ArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Button>
            <Button
              variant="secondary"
              onClick={downloadCv}
              disabled={cvLoading}
              className="px-7 py-3.5 disabled:opacity-70"
            >
              {cvLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-heading/30 border-t-heading" />
              ) : (
                <Download className="transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
              )}
              {cvLoading ? 'Preparing…' : 'Download CV'}
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — circular photo slot (parallaxed) */}
        <motion.div
          style={{ y: photoY }}
          className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80 lg:h-96 lg:w-96"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.3 }}
        >
          {/* Rotating decorative dashed ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-dashed border-primary/40"
            style={{ willChange: still ? 'auto' : 'transform' }}
            animate={still ? {} : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          {/* Second counter-rotating ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-dotted border-teal/50"
            style={{ willChange: still ? 'auto' : 'transform' }}
            animate={still ? {} : { rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />

          {/* Orbiting dots */}
          <OrbitingDots reduce={still} />

          {/* Soft outer blue glow behind the photo */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-primary via-sky to-teal opacity-25 blur-2xl" />

          {/* PHOTO SLOT — thin gradient ring (#3B82F6 → transparent) + blue glow,
              gently floating. Source is dashboard-configurable
              (settings.profile_photo); falls back to the local placeholder. */}
          <motion.div
            style={{ scale: photoScale }}
            className="absolute inset-8"
            animate={still ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-full w-full rounded-full bg-gradient-to-br from-primary via-primary/30 to-transparent p-[3px] shadow-[0_0_45px_rgba(59,130,246,0.35)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-base-indigo">
                {photoError ? (
                  // Friendly placeholder (Lucide) if no photo provided yet.
                  <div className="flex h-full w-full items-center justify-center bg-base-indigo text-primary">
                    <Code2 size={72} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                ) : (
                  /* REPLACE WITH YOUR PHOTO: /assets/me.jpg (or set it from the
                     admin dashboard → Settings → Profile photo URL). */
                  <img
                    src={settings.profile_photo || '/photo.jpg'}
                    alt="Portrait of EL MASDOUKI Hamza"
                    width="384"
                    height="384"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={() => setPhotoError(true)}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Floating stickers around the photo */}
          {ORBIT.map((s, i) => {
            const Shape = shapes[s.shape]
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
                animate={
                  still
                    ? {}
                    : { y: [0, -14, 0], rotate: [0, 20, 0], scale: [1, 1.15, 1] }
                }
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%">
                  {Shape(s.color)}
                </svg>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted"
        animate={still ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ArrowDown size={22} aria-hidden="true" />
      </motion.div>
    </section>
  )
}
