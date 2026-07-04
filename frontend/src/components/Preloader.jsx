import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Hard safety net: the site is revealed after this long no matter what, so the
// preloader can NEVER permanently block the page (failed counter, missed
// animation callback, etc.).
const MAX_PRELOAD_MS = 5000

/**
 * Preloader — minimal editorial intro: #0D0D0D, an oversized 0→100 counter
 * with a thin progress line and the wordmark, then a clip-path curtain wipe
 * reveals the hero. Plays once per session (see PublicSite). GPU-only.
 *
 * The reveal (`onComplete`) is fired from the curtain wipe's completion AND a
 * hard fallback timer, guarded so it only runs once.
 */
export default function Preloader({ onComplete }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onComplete?.()
  }, [onComplete])

  // Fallback: reveal no matter what.
  useEffect(() => {
    const t = setTimeout(finish, MAX_PRELOAD_MS)
    return () => clearTimeout(t)
  }, [finish])

  // 0 → 100 counter.
  useEffect(() => {
    if (reduce) {
      setProgress(100)
      setDone(true)
      return
    }
    let raf
    let current = 0
    const tick = () => {
      // Fast counter (~1s to 100) — the preloader is a beat, not a wait.
      const step = current < 80 ? 2.6 : 1.2
      current = Math.min(100, current + step * Math.random() * 2)
      setProgress(Math.floor(current))
      if (current < 100) raf = requestAnimationFrame(tick)
      else setDone(true)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink px-5 py-6 sm:px-8 sm:py-8 lg:px-12"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Clip-path curtain wipe on completion → triggers the reveal */}
      {done && (
        <motion.div
          className="absolute inset-0 z-10 bg-white"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={finish}
        />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted">
        <span className="font-heading text-sm font-semibold tracking-[-0.02em] text-heading">
          EL MASDOUKI Hamza
        </span>
        <span>Full Stack Engineer</span>
      </div>

      {/* Bottom: progress line + oversized counter */}
      <div>
        <div className="h-px w-full bg-line">
          <motion.div
            className="h-px bg-white"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <span className="text-xs uppercase tracking-[0.14em] text-muted">Loading</span>
          <span
            aria-live="polite"
            className="font-heading text-[clamp(4rem,17vw,12rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-heading tabular"
          >
            {progress}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
