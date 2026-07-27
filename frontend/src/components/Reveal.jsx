import { motion, useReducedMotion } from 'framer-motion'
import { EASE, DUR } from '../lib/motion'

/**
 * Reveal — a consistent scroll-in wrapper so every block animates in the same
 * way: fade + slide-up.
 *
 * v2: the blur-in is gone. `filter: blur()` on scroll was the most expensive
 * effect on the page and communicated nothing.
 *
 * Reduced motion → a plain fade, no movement.
 *
 * @param {string}  as       Element/tag to render ('div', 'section', ...).
 * @param {number}  delay    Delay in seconds.
 * @param {number}  y        Slide distance in px.
 * @param {boolean} once     Animate only the first time into view.
 * @param {number}  amount   Viewport amount threshold (0..1).
 */
export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.2,
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] || motion.div

  const variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2, delay } },
      }
    : {
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: DUR.reveal, delay, ease: EASE.out },
        },
      }

  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}
