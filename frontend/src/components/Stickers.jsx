import { motion } from 'framer-motion'
import { useReducedEffects } from '../hooks/usePerf'

/* ============================================================
   STICKER SHAPES
   A small library of decorative SVG shapes used everywhere.
   Each accepts a color and inherits sizing from its wrapper.
   ============================================================ */
const shapes = {
  star: (c) => (
    <path
      d="M12 1.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.9l1.4-6.8L2.2 8.6l6.9-.8L12 1.5z"
      fill={c}
    />
  ),
  circle: (c) => <circle cx="12" cy="12" r="9" fill={c} />,
  sparkle: (c) => (
    <path
      d="M12 0c.6 5.4 2.6 7.4 8 8-5.4.6-7.4 2.6-8 8-.6-5.4-2.6-7.4-8-8 5.4-.6 7.4-2.6 8-8z"
      fill={c}
    />
  ),
  triangle: (c) => <path d="M12 2l10 18H2L12 2z" fill={c} />,
  plus: (c) => (
    <path
      d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z"
      fill={c}
    />
  ),
  blob: (c) => (
    <path
      d="M44 19c5 9-2 22-12 26S9 60 4 49 3 24 13 14 39 10 44 19z"
      transform="scale(.45)"
      fill={c}
    />
  ),
  squiggle: (c) => (
    <path
      d="M2 14c3-6 6 6 9 0s6 6 9 0"
      stroke={c}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  ),
  ring: (c) => (
    <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="3" fill="none" />
  ),
}

// Deep-space decorative tones — pale blues + soft white, like distant stars.
// Tasteful, rendered low-opacity so they read as faint cosmic glints.
const COLORS = {
  indigo: '#93C5FD', // light blue
  sky: '#BFDBFE', // pale blue
  mint: '#5B8DD6', // soft blue
  coral: '#A9C8EC', // pale blue
  amber: '#A9C8EC', // pale blue
  lavender: '#93C5FD', // light blue
  pink: '#BFDBFE', // pale blue
}

/**
 * A single floating sticker with a continuous, looping motion.
 * Only transform channels (y + rotate) are animated so the work stays on the
 * GPU compositor; `will-change: transform` hints the browser while it loops.
 *
 * @param {boolean} still  Render static (reduced motion / low-end / touch).
 */
function Sticker({ shape, color, size, top, left, opacity, delay, duration, rotate, still }) {
  const Shape = shapes[shape]

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute select-none"
      style={{
        top,
        left,
        width: size,
        height: size,
        opacity,
        willChange: still ? 'auto' : 'transform',
      }}
      initial={false}
      animate={
        still
          ? { y: 0, rotate: 0 }
          : { y: [0, -18, 0], rotate: [0, rotate, 0, -rotate, 0] }
      }
      transition={still ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        {Shape(color)}
      </svg>
    </motion.div>
  )
}

/**
 * A predefined scatter of stickers. Positions are hand-tuned in %
 * so they spread across the whole viewport without clustering.
 * `layer` lets callers vary density (e.g. denser hero field).
 */
// Tasteful blue/teal shapes at 40–60% opacity — present but never loud.
const FIELD = [
  { shape: 'star', color: COLORS.indigo, size: 30, top: '9%', left: '7%', opacity: 0.5, duration: 8, rotate: 18 },
  { shape: 'circle', color: COLORS.sky, size: 16, top: '20%', left: '88%', opacity: 0.5, duration: 10, rotate: 0 },
  { shape: 'sparkle', color: COLORS.mint, size: 24, top: '34%', left: '13%', opacity: 0.55, duration: 7, rotate: 30 },
  { shape: 'ring', color: COLORS.indigo, size: 38, top: '44%', left: '91%', opacity: 0.45, duration: 11, rotate: 15 },
  { shape: 'plus', color: COLORS.sky, size: 18, top: '58%', left: '5%', opacity: 0.5, duration: 9, rotate: 14 },
  { shape: 'blob', color: COLORS.mint, size: 48, top: '70%', left: '85%', opacity: 0.4, duration: 12, rotate: 12 },
  { shape: 'circle', color: COLORS.indigo, size: 13, top: '78%', left: '40%', opacity: 0.5, duration: 8, rotate: 0 },
  { shape: 'sparkle', color: COLORS.sky, size: 22, top: '14%', left: '47%', opacity: 0.5, duration: 7.5, rotate: 35 },
]

// Hard cap on simultaneously-animating stickers per field, so a section never
// spawns dozens of continuous loops (the main source of scroll jank).
const MAX_PER_FIELD = 5

/**
 * StickerField — drop into any `relative` container to scatter
 * floating decorative stickers behind the content.
 *
 * @param {number} density  0..1 — fraction of the field to render (capped).
 * @param {string} className extra positioning classes.
 */
export default function StickerField({ density = 1, className = '' }) {
  const still = useReducedEffects()
  const count = Math.min(
    MAX_PER_FIELD,
    Math.max(1, Math.round(FIELD.length * density))
  )
  const items = FIELD.slice(0, count)

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {items.map((s, i) => (
        <Sticker key={i} delay={(i % 5) * 0.4} still={still} {...s} />
      ))}
    </div>
  )
}

export { COLORS, shapes }
