import { useEffect, useState } from 'react'

/**
 * LocalTime — a live local clock + location label, the high-end-portfolio
 * detail. Ticks every second; SSR/first-paint safe.
 */
export default function LocalTime({
  timeZone = 'Africa/Casablanca',
  label = 'Casablanca, MA',
  className = '',
  showSeconds = true,
}) {
  const [now, setNow] = useState('')

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds ? { second: '2-digit' } : {}),
        hour12: false,
      }).format(new Date())
    setNow(fmt())
    const id = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(id)
  }, [timeZone, showSeconds])

  // Time only — the caller supplies its own place label.
  if (!label) {
    return <span className={className}>{now}</span>
  }

  return (
    <span className={className}>
      {label} <span className="tabular">{now}</span>
    </span>
  )
}
