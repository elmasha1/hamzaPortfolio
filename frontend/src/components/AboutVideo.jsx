import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { Play, Pause, Code } from './ui/Icons'

/* Monochrome poster placeholder when none is provided. */
const posterPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'><rect width='100%' height='100%' fill='#101010'/></svg>`
  )

/**
 * AboutVideo — a large 16:9 intro-video block, on-theme (hairline border, b/w).
 * Reveals with a clip-path wipe, parallaxes gently on scroll, auto-plays muted
 * when in view, and has a custom magnetic Play button that unmutes on click.
 * Dashboard-configurable src/poster. Reduced-motion → fade only, no parallax.
 */
export default function AboutVideo({ src, poster }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [engaged, setEngaged] = useState(false) // user clicked play (unmuted + controls)

  const inView = useInView(videoRef, { amount: 0.5 })

  // Gentle parallax on the media.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -28, reduce ? 0 : 28])

  // Magnetic play button.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 180, damping: 15 })
  const sy = useSpring(my, { stiffness: 180, damping: 15 })
  const onBtnMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.4)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const onBtnLeave = () => {
    mx.set(0)
    my.set(0)
  }

  // Auto play/pause (muted) as it enters/leaves view — unless the user engaged.
  useEffect(() => {
    const v = videoRef.current
    if (!v || engaged || !src) return
    if (inView) v.play?.().catch(() => {})
    else v.pause?.()
  }, [inView, engaged, src])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v || !src) return
    if (v.paused) {
      v.muted = false
      v.play?.().catch(() => {})
      setEngaged(true)
    } else {
      v.pause?.()
    }
  }

  const showPlay = !playing

  return (
    <motion.div
      ref={wrapRef}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      data-cursor={playing ? undefined : 'play'}
      className="group relative aspect-video w-full overflow-hidden rounded-[6px] border border-line bg-base-indigo"
    >
      {src ? (
        <motion.video
          ref={videoRef}
          src={src}
          poster={poster || posterPlaceholder}
          muted
          loop
          playsInline
          preload="none"
          controls={engaged}
          style={{ y }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-[112%] w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
        />
      ) : (
        // No video set yet — on-theme placeholder frame.
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
          <Code size={44} strokeWidth={1.1} aria-hidden="true" />
          <span className="text-xs uppercase tracking-[0.16em]">Intro video</span>
        </div>
      )}

      {/* Custom control button */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {(showPlay || !engaged) && (
          <motion.button
            type="button"
            onClick={togglePlay}
            onMouseMove={onBtnMove}
            onMouseLeave={onBtnLeave}
            style={{ x: sx, y: sy }}
            aria-label={playing ? 'Pause intro video' : 'Play intro video'}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-ink/50 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink sm:h-20 sm:w-20"
          >
            {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </motion.button>
        )}
      </div>

      {/* subtle vignette for readability of the button */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
    </motion.div>
  )
}
