import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * MagneticButton — a button/link that is gently pulled toward the
 * cursor while hovered, then springs back on leave. Great premium feel.
 *
 * Pass `as="a"` to render an anchor. Any extra props pass through.
 */
export default function MagneticButton({
  as = 'button',
  children,
  className = '',
  strength = 0.35,
  ...rest
}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 15 })
  const y = useSpring(my, { stiffness: 200, damping: 15 })

  const handleMove = (e) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mx.set((e.clientX - cx) * strength)
    my.set((e.clientY - cy) * strength)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const Comp = motion[as] || motion.button

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}
