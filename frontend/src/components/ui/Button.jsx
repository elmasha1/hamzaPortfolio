import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import useMagnetic from '../../hooks/useMagnetic'

/**
 * Button — a luxury, tactile button/link.
 *
 * Features:
 *  - Magnetic hover (gently follows the cursor, springs back).
 *  - A diagonal shine sweep that crosses the surface once on hover.
 *  - Press feedback: scale(0.97) on tap.
 *  - Variants: primary (gradient sheen + depth), secondary (white),
 *    ghost (frosted + border-glow).
 *  - Icons placed inside with `group-hover` classes get their own micro-motion.
 *
 * Pass `as="a"` to render an anchor, or a component (e.g. `as={Link}`) for
 * router links. Extra props pass through.
 */
const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function Button({
  as = 'button',
  variant = 'primary',
  children,
  className = '',
  strength = 0.3,
  ...rest
}) {
  const reduce = useReducedMotion()
  const { ref, x, y, handlers } = useMagnetic(strength)
  // Strings map to motion.<tag>; components (Link, …) are wrapped via motion().
  const Comp = useMemo(
    () => (typeof as === 'string' ? motion[as] || motion.button : motion(as)),
    [as]
  )

  return (
    <Comp
      ref={ref}
      style={{ x, y }}
      {...handlers}
      whileTap={{ scale: 0.97 }}
      className={`group ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...rest}
    >
      {/* Shine sweep — runs once per hover, skipped for reduced motion */}
      {!reduce && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute top-0 h-full w-1/3 -translate-x-[160%] skew-x-[-20deg] bg-white/30 blur-md group-hover:animate-shine" />
        </span>
      )}

      {/* Label + icons sit above the sheen */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Comp>
  )
}
