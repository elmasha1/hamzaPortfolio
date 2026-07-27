import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * useMagnetic — pulls an element gently toward the cursor while hovered,
 * then springs back on leave. Returns a ref, x/y motion values to bind to
 * `style`, and the mouse handlers to spread onto the element.
 *
 * Disabled automatically when the user prefers reduced motion.
 *
 * @param {number} strength  0..1 — how strongly it follows the cursor.
 */
export default function useMagnetic(strength = 0.15, spring = { stiffness: 220, damping: 16, mass: 0.5 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, spring)
  const y = useSpring(my, spring)

  // Throttle to one layout read + update per animation frame.
  const frame = useRef(0)
  const last = useRef(null)

  useEffect(() => () => frame.current && cancelAnimationFrame(frame.current), [])

  const flush = () => {
    frame.current = 0
    const e = last.current
    if (!e || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    mx.set((e.clientX - cx) * strength)
    my.set((e.clientY - cy) * strength)
  }

  const onMouseMove = (e) => {
    if (reduce || !ref.current) return
    last.current = { clientX: e.clientX, clientY: e.clientY }
    if (!frame.current) frame.current = requestAnimationFrame(flush)
  }
  const onMouseLeave = () => {
    if (frame.current) {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
    mx.set(0)
    my.set(0)
  }

  return { ref, x, y, handlers: { onMouseMove, onMouseLeave }, reduce }
}
