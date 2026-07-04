import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Cursor — a minimal editorial cursor: a precise dot + a trailing ring that
 * springs behind it. Over elements marked `data-cursor="view|drag|open"` it
 * morphs into a filled label pill ("View" / "Drag" / "Open"). Disabled on
 * touch / reduced motion. GPU-only (transform/opacity).
 */
const LABELS = { view: 'View', drag: 'Drag', open: 'Open', play: 'Play' }

export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState('default') // default | hover | label
  const [label, setLabel] = useState('')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || reduce) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-active')

    let frame = 0
    let last = null

    const flush = () => {
      frame = 0
      if (!last) return
      x.set(last.clientX)
      y.set(last.clientY)
      const t = last.target
      const tagged = t instanceof Element ? t.closest('[data-cursor]') : null
      const val = tagged?.getAttribute('data-cursor')
      if (val && LABELS[val]) {
        setLabel(LABELS[val])
        setMode('label')
      } else if (val === 'hover' || (t instanceof Element && t.closest('a, button, input, textarea'))) {
        setLabel('')
        setMode('hover')
      } else {
        setLabel('')
        setMode('default')
      }
    }

    const move = (e) => {
      last = e
      if (!frame) frame = requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      if (frame) cancelAnimationFrame(frame)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [reduce, x, y])

  if (!enabled) return null

  const isLabel = mode === 'label'

  return (
    <>
      {/* Precise dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ x, y }}
        animate={{ scale: mode === 'default' ? 1 : 0 }}
      />
      {/* Trailing ring → label pill */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[120] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{ x: ringX, y: ringY, willChange: 'transform', height: 96, width: 96 }}
        animate={{
          scale: isLabel ? 1 : mode === 'hover' ? 0.42 : 0.3,
          backgroundColor: isLabel ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <span
          style={{ borderWidth: isLabel ? 0 : 2 }}
          className="absolute inset-0 rounded-full border-white/60"
        />
        <motion.span
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
          animate={{ opacity: isLabel ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          {label || 'View'}
        </motion.span>
      </motion.div>
    </>
  )
}
