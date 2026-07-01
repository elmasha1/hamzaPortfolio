import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * ScrollProgress — a slim gradient bar pinned to the very top of the page
 * that fills as the user scrolls. Driven by Framer's useScroll (works with
 * Lenis, which updates the real scroll position), smoothed with a spring.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-white"
    />
  )
}
