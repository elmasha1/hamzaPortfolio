import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Cursor — a custom animated cursor with a trailing ring.
 * - The dot follows the pointer instantly; the ring lags with a spring.
 * - Grows + changes colour when hovering interactive elements.
 * - Disabled on touch devices and when reduced-motion is requested.
 */
export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Springy ring trails behind the precise dot.
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 })

  useEffect(() => {
    // Only enable for fine pointers (mouse) and when motion is allowed.
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || reduce) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-active')

    // Throttle to one update per animation frame: store the latest event and
    // only touch motion values / query the DOM inside rAF. Avoids doing work
    // on every single mousemove (which can fire far more than 60Hz).
    let frame = 0
    let lastEvent = null

    const flush = () => {
      frame = 0
      if (!lastEvent) return
      x.set(lastEvent.clientX)
      y.set(lastEvent.clientY)
      const t = lastEvent.target
      // setHovering bails out when the value is unchanged, so no re-render
      // happens on a plain move — only when crossing into/out of a target.
      setHovering(
        !!(t instanceof Element &&
          t.closest('a, button, input, textarea, [data-cursor="hover"]'))
      )
    }

    const move = (e) => {
      lastEvent = e
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
      {/* Precise dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ x, y }}
        animate={{ scale: hovering ? 0 : 1 }}
      />
      {/* Trailing ring — fixed size; only transform (scale) + opacity animate
          so it stays on the GPU compositor (no width/height layout work). */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/10"
        style={{ x: ringX, y: ringY, willChange: 'transform' }}
        animate={{
          scale: hovering ? 1.7 : 1,
          opacity: hovering ? 1 : 0.7,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      />
    </>
  )
}
