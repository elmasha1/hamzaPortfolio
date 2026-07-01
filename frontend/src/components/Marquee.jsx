import { useReducedMotion } from 'framer-motion'

/**
 * Marquee — a seamless looping strip of text (role / availability / skills).
 * The track is duplicated and translated -50%, so it loops with no seam.
 * Static (no animation) under prefers-reduced-motion.
 *
 * @param {string[]} items     phrases to repeat
 * @param {boolean}  reverse   scroll right-to-left vs left-to-right
 * @param {string}   className wrapper classes (font size/color/padding)
 */
export default function Marquee({ items = [], reverse = false, className = '' }) {
  const reduce = useReducedMotion()

  const Group = ({ ariaHidden = false }) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span>{it}</span>
          <span className="mx-8 inline-block h-1 w-1 rounded-full bg-current opacity-40" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`relative flex w-full overflow-hidden ${className}`}>
      <div
        className={`flex min-w-max ${reduce ? '' : 'animate-marquee'}`}
        style={reduce ? undefined : { animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  )
}
