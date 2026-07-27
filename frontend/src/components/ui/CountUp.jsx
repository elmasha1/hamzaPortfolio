import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * CountUp — a number that counts to its value once, when scrolled into view.
 *
 * Accepts either a number (`value={11}`) or a string that may carry units
 * ("24h", "99.98%", "06"): the leading number animates and everything around
 * it is preserved, including leading zeros. Under reduced motion it renders
 * the final value immediately.
 */
const PARTS = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/s

export default function CountUp({ value, suffix = '', className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  const raw = String(value ?? '')
  const match = raw.match(PARTS)
  const target = match ? Number(match[2]) : null
  const before = match ? match[1] : raw
  const after = match ? match[3] : ''
  // "06" must land on "06", not "6".
  const pad = match && /^0\d/.test(match[2]) ? match[2].length : 0
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0

  const [n, setN] = useState(target === null ? null : 0)

  useEffect(() => {
    if (target === null || !inView) return
    if (reduce) {
      setN(target)
      return
    }
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 1200)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setN(eased * target)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, reduce])

  if (target === null) {
    return (
      <span ref={ref} className={`tabular ${className}`}>
        {raw}
        {suffix}
      </span>
    )
  }

  const shown = n.toFixed(decimals)
  const padded = pad ? shown.padStart(pad, '0') : shown

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {before}
      {padded}
      {after}
      {suffix}
    </span>
  )
}
