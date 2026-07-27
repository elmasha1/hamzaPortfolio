// ============================================================
// MOTION SYSTEM — the single source of truth for site motion.
// One easing family, one duration scale, one stagger step.
// Every component should consume these tokens (directly or via
// the variants below) so the whole site moves as one hand.
// ============================================================

/** Easing curves. `out` for reveals/entrances, `inOut` for clip/mask wipes. */
export const EASE = {
  out: [0.22, 1, 0.36, 1], // soft decel — all fades/slides/reveals
  inOut: [0.76, 0, 0.24, 1], // clip-path wipes, curtains, page masks
}

/** Duration scale (s). micro = hovers/icons, reveal = section entrances, mask = clip wipes. */
export const DUR = {
  micro: 0.3,
  fast: 0.5,
  reveal: 0.6, // v2: reveals are shorter, so the page never feels held back
  mask: 0.9,
  slow: 1.2,
}

/** Stagger step between sibling reveals. */
export const STAGGER = 0.06

/** Soft spring for magnetic pulls / cursor followers. */
export const SPRING = { stiffness: 180, damping: 18, mass: 0.6 }

/* ------------------------------------------------------------ */
/* Shared Framer Motion variants built on the tokens above.      */
/* ------------------------------------------------------------ */

/** Container that staggers its children on reveal. */
export const staggerContainer = (stagger = STAGGER, delay = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Fade + slide up. The default reveal for almost every element. */
export const fadeUp = (y = 24, duration = DUR.reveal) => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE.out },
  },
})

/** Fade + slide in from the side. */
export const fadeIn = (direction = 'left', distance = 60, duration = DUR.reveal) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration, ease: EASE.out },
  },
})

/**
 * Crossfade for the work-index preview panel — the one interaction on the site
 * that carries information (which project you are pointing at, in colour).
 * Under reduced motion the caller swaps instantly instead.
 */
export const revealPreview = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.micro, ease: EASE.out } },
  exit: { opacity: 0, transition: { duration: DUR.micro, ease: EASE.out } },
}

// Sensible defaults for whileInView so every section reveals consistently.
export const viewportOnce = { once: true, amount: 0.25 }
