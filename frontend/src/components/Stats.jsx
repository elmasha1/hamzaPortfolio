import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import { useSettings } from '../context/SettingsContext'

// Accent colors cycle across however many stats the dashboard defines.
const COLORS = ['text-primary', 'text-teal', 'text-primary-700', 'text-teal']

/** Counts from 0 → target once in view, then "blooms" as it lands. */
function Counter({ value, suffix, duration = 1.6 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setCount(value)
      setLanded(true)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000))
      // easeOutExpo for a snappy finish
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setCount(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setLanded(true) // trigger the bloom glow
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} className={landed && !reduce ? 'animate-bloom' : undefined}>
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const { settings } = useSettings()
  const stats = Array.isArray(settings.stats) ? settings.stats : []

  return (
    <section className="relative z-10 py-12">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="container-px"
      >
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-line bg-white/[0.04] p-8 shadow-soft md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp(30)}
              whileHover={{ scale: 1.06, y: -4 }}
              className="text-center"
            >
              <div
                className={`tabular font-heading text-3xl font-semibold sm:text-4xl ${COLORS[i % COLORS.length]}`}
              >
                <Counter value={Number(s.value) || 0} suffix={s.suffix || ''} />
              </div>
              <p className="mt-2 text-sm font-medium text-body">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
