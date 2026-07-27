import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Cursor — a 6px dot, and nothing else until it is over media.
 *
 * The old version dragged a 96px ring behind the pointer at all times. It was
 * the single biggest source of "generic template" feel and it fought every
 * hover state in the design: the ring reacted to every link, so each link's
 * own hover had to compete with it. Now the dot is the whole cursor, and the
 * labelled disc appears only over things you can actually open —
 * `data-cursor="view"` and `data-cursor="open"`.
 *
 * Disabled on touch and under reduced motion. Text and form fields keep the
 * native caret (see index.css).
 */
const LABELS = { view: 'View', open: 'Open' }

export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // The disc lags a little behind the dot; the dot itself is exact.
  const discX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 })
  const discY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || reduce) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-active')

    let frame = 0
    let last = null

    const flush = () => {
      frame = 0
      if (!last) return
      x.set(last.clientX)
      y.set(last.clientY)
      const target = last.target
      const tagged = target instanceof Element ? target.closest('[data-cursor]') : null
      const value = tagged?.getAttribute('data-cursor')
      setLabel(LABELS[value] || '')
    }

    const move = (e) => {
      last = e
      if (!frame) frame = requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      if (frame) cancelAnimationFrame(frame)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [reduce, x, y])

  if (!enabled) return null

  return (
    <>
      {/* The dot — exact, always */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-100"
        style={{ x, y }}
        animate={{ scale: label ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* The labelled disc — only over media you can open */}
      <AnimatePresence>
        {label && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[120] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink-100"
            style={{ x: discX, y: discY }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="font-mono text-eyebrow font-medium uppercase tracking-[0.09em] text-paper">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
