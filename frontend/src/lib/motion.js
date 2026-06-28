// Shared Framer Motion variants used across the whole site.
// Keeping them in one place keeps animations consistent and DRY.

/** Container that staggers its children on reveal. */
export const staggerContainer = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Fade + slide up. The default reveal for almost every element. */
export const fadeUp = (y = 40, duration = 0.6) => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: [0.22, 1, 0.36, 1] },
  },
})

/** Fade + slide in from the side. */
export const fadeIn = (direction = 'left', distance = 60, duration = 0.6) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration, ease: [0.22, 1, 0.36, 1] },
  },
})

/** Strong card reveal: scale + rotate-in + fade (used by Projects). */
export const cardPop = {
  hidden: { opacity: 0, scale: 0.8, rotate: -6, y: 50 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 6,
    transition: { duration: 0.25 },
  },
}

/** Pop-in for badges / pills. */
export const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
}

// Sensible defaults for whileInView so every section reveals consistently.
export const viewportOnce = { once: true, amount: 0.25 }
