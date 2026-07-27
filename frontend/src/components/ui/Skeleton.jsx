/**
 * Skeleton — minimal on-theme loading placeholder (hairline border, faint
 * pulsing fill). Sized by the caller via className. Keeps layout stable so
 * data arriving never causes a shift. Square, like every other structural
 * surface in v2.
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse border border-rule bg-white/[0.03] ${className}`}
    />
  )
}
