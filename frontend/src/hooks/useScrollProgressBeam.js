import { useScroll, useSpring } from 'framer-motion'

/**
 * useScrollProgressBeam — maps how far the user has scrolled *through* a section
 * to a 0→1 spring value, for driving a `scaleY` progress beam on a timeline.
 *
 * Physically tied to scroll (not time), spring-smoothed so it feels like the
 * gianlucagradogna.com / Lenis motion language. GPU-only (transform).
 *
 * @param {React.RefObject} ref     the section element to track
 * @param {[string,string]} offset  useScroll offset (start → end mapping)
 * @returns {import('framer-motion').MotionValue<number>} smoothed 0→1 progress
 */
export default function useScrollProgressBeam(ref, offset = ['start 85%', 'end 55%']) {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
}
