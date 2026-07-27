import { useMemo } from 'react'
import { m } from 'framer-motion'
import useMagnetic from '../../hooks/useMagnetic'

/**
 * Button — the three v2 variants.
 *
 *  - `primary`   solid ink-100 pill with paper text. One per screen.
 *  - `secondary` hairline pill that inverts on hover.
 *  - `ghost`     mono text link with a growing underline.
 *
 * Keeps a light magnetic pull (0.15) and press feedback. The diagonal shine
 * sweep is gone — it was the one motion on the site that read as a template.
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
  strength = 0.15,
  ...rest
}) {
  const { ref, x, y, handlers } = useMagnetic(strength)
  // Strings map to m.<tag>; components (Link, …) are wrapped via m().
  const Comp = useMemo(
    () => (typeof as === 'string' ? m[as] || m.button : m(as)),
    [as]
  )

  return (
    <Comp
      ref={ref}
      style={{ x, y }}
      {...handlers}
      whileTap={{ scale: 0.98 }}
      className={`group ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}
