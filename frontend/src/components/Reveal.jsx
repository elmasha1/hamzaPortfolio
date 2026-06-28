import { motion, useReducedMotion } from 'framer-motion'

/**
 * Reveal — a consistent scroll-in wrapper used across the site so every
 * block animates in the same way: fade + slide-up + a subtle blur-in.
 *
 * Reduced motion → a plain fade (no movement/blur).
 *
 * @param {string}  as       Element/tag to render ('div', 'section', ...).
 * @param {number}  delay    Delay in seconds.
 * @param {number}  y        Slide distance in px.
 * @param {boolean} blur     Whether to blur-in.
 * @param {boolean} once     Animate only the first time into view.
 * @param {number}  amount   Viewport amount threshold (0..1).
 */
export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  y = 28,
  blur = true,
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
        show: { opacity: 1, transition: { duration: 0.4, delay } },
      }
    : {
        hidden: { opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
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
