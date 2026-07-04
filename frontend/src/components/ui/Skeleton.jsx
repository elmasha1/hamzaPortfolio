/**
 * Skeleton — minimal on-theme loading placeholder (hairline border, faint
 * pulsing fill). Sized by the caller via className. Keeps layout stable so
 * data arriving never causes a shift.
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-[6px] border border-line bg-white/[0.03] ${className}`}
    />
  )
}
