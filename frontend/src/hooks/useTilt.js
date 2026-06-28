import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'

/**
 * useTilt — 3D mouse-tracked tilt for cards, plus a dynamic glare that
 * follows the cursor. Bind `rx`/`ry` to rotateX/rotateY and `glare` as the
 * background of an overlay layer.
 *
 * Disabled (flat, no glare) when the user prefers reduced motion.
 *
 * @param {number} max  Max tilt in degrees.
 */
export default function useTilt({ max = 10 } = {}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Normalised pointer position over the card (0..1), centred at 0.5.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 18,
  })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 18,
  })

  // Soft radial glare positioned under the cursor.
  const gx = useTransform(px, [0, 1], ['0%', '100%'])
  const gy = useTransform(py, [0, 1], ['0%', '100%'])
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)`

  // Throttle pointer math to one update per frame to avoid layout reads on
  // every mousemove. The latest coordinates are flushed inside rAF.
  const frame = useRef(0)
  const last = useRef(null)

  useEffect(() => () => frame.current && cancelAnimationFrame(frame.current), [])

  const flush = () => {
    frame.current = 0
    const e = last.current
    if (!e || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const onMouseMove = (e) => {
    if (reduce || !ref.current) return
    last.current = { clientX: e.clientX, clientY: e.clientY }
    if (!frame.current) frame.current = requestAnimationFrame(flush)
  }
  const reset = () => {
    if (frame.current) {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
    px.set(0.5)
    py.set(0.5)
  }

  return { ref, rx, ry, glare, onMouseMove, reset, reduce }
}
