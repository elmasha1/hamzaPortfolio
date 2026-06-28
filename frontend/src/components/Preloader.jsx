import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { COLORS, shapes } from './Stickers'

/* Floating stickers shown behind the loader while it counts up. */
const LOADER_STICKERS = [
  { shape: 'star', color: COLORS.amber, size: 40, top: '15%', left: '12%' },
  { shape: 'sparkle', color: COLORS.pink, size: 30, top: '25%', left: '80%' },
  { shape: 'circle', color: COLORS.sky, size: 22, top: '70%', left: '20%' },
  { shape: 'triangle', color: COLORS.mint, size: 28, top: '65%', left: '78%' },
  { shape: 'plus', color: COLORS.lavender, size: 24, top: '40%', left: '88%' },
  { shape: 'ring', color: COLORS.coral, size: 36, top: '80%', left: '60%' },
  { shape: 'sparkle', color: COLORS.amber, size: 26, top: '10%', left: '55%' },
]

/**
 * Preloader — full-screen intro that plays once on first load.
 * - Logo "<Name/>" draws + scales in.
 * - 0% → 100% counter with an animated progress bar.
 * - Colourful floating stickers in the background.
 * - Curtain reveal out, then calls onComplete().
 */
export default function Preloader({ onComplete }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // Simulated loading counter (eases toward 100).
  useEffect(() => {
    if (reduce) {
      setProgress(100)
      const t = setTimeout(() => setDone(true), 250)
      return () => clearTimeout(t)
    }
    let raf
    let current = 0
    const tick = () => {
      // Decelerate as we approach 100 for a natural feel.
      const step = current < 80 ? 1.6 : 0.6
      current = Math.min(100, current + step * Math.random() * 2)
      setProgress(Math.floor(current))
      if (current < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-base-indigo"
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      // Curtain reveal: slide the whole loader up and out.
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => done && onComplete?.()}
      style={done ? { transform: 'translateY(0)' } : undefined}
    >
      {/* Curtain panels for the reveal */}
      {done && (
        <>
          <motion.div
            className="absolute inset-0 z-10 bg-primary"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}

      {/* Background floating stickers */}
      {LOADER_STICKERS.map((s, i) => {
        const Shape = shapes[s.shape]
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              reduce
                ? { opacity: 0.8, scale: 1 }
                : {
                    opacity: 0.85,
                    scale: 1,
                    y: [0, -18, 0],
                    rotate: [0, 20, 0],
                  }
            }
            transition={{
              opacity: { delay: 0.2 + i * 0.08 },
              scale: { delay: 0.2 + i * 0.08, type: 'spring' },
              y: { repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 4 + i * 0.4, ease: 'easeInOut' },
            }}
          >
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              {Shape(s.color)}
            </svg>
          </motion.div>
        )
      })}

      {/* Center content */}
      <div className="relative z-[5] flex flex-col items-center">
        {/* Animated logo that draws + scales in */}
        <motion.div
          className="mb-8 text-4xl sm:text-5xl font-semibold text-heading"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
        >
          <span className="text-primary">&lt;</span>
          <motion.span
            className="gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hamza
          </motion.span>
          <span className="text-primary">/&gt;</span>
        </motion.div>

        {/* Progress bar */}
        <div className="h-2 w-56 sm:w-72 overflow-hidden rounded-full bg-white/[0.06] shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary-600 to-teal"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Counter */}
        <motion.span
          className="mt-4 text-sm font-semibold tracking-widest text-muted"
          aria-live="polite"
        >
          {progress}%
        </motion.span>
      </div>
    </motion.div>
  )
}
