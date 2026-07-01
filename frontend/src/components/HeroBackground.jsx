import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/* Deterministic PRNG so the node field is identical every load (looks
   intentional, not random noise). */
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(20260701)
const NODE_COUNT = 40

// Nodes scattered across a 100×100 field.
const NODES = Array.from({ length: NODE_COUNT }, () => ({
  x: +(rng() * 100).toFixed(2),
  y: +(rng() * 100).toFixed(2),
  r: +(0.22 + rng() * 0.4).toFixed(3),
  delay: +(rng() * 5).toFixed(2),
}))

// Connect nearby nodes into a light network (constellation edges).
const EDGES = []
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const d = Math.hypot(NODES[i].x - NODES[j].x, NODES[i].y - NODES[j].y)
    if (d < 19) EDGES.push([i, j])
  }
}

// A couple of subtle location markers (monochrome pin dots + tiny labels).
const MARKERS = [
  { x: 24, y: 46, label: 'RABAT' },
  { x: 72, y: 34, label: 'REMOTE' },
]

/**
 * HeroBackground — a very subtle animated constellation / network map on the
 * dark hero: hairline connecting lines, faint twinkling node dots, and a couple
 * of location markers. Gentle cursor parallax. Opacity/transform only (60fps),
 * fully disabled under prefers-reduced-motion / touch.
 */
export default function HeroBackground() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 60, damping: 20 })
  const y = useSpring(my, { stiffness: 60, damping: 20 })

  const onMove = (e) => {
    if (reduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(px * -18) // gentle, inverse for depth
    my.set(py * -12)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Load intro: the whole map starts zoomed-out + faded, then settles up to
          full size. Reduced motion → fade only, no scale. */}
      <motion.div
        initial={{ scale: reduce ? 1 : 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0.6 : 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full origin-center"
      >
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={reduce ? undefined : { x, y, scale: 1.08 }}
        className="h-full w-full"
      >
        {/* connecting lines */}
        <g stroke="#ffffff" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.07">
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
          ))}
        </g>

        {/* twinkling node dots */}
        <g fill="#ffffff">
          {NODES.map((n, i) => (
            <circle
              key={i}
              className="hero-node"
              cx={n.x}
              cy={n.y}
              r={n.r}
              style={{ animationDelay: `${n.delay}s` }}
            />
          ))}
        </g>

        {/* location markers — a ring + solid dot + tiny label */}
        <g>
          {MARKERS.map((m) => (
            <g key={m.label}>
              <circle cx={m.x} cy={m.y} r="1.4" fill="none" stroke="#ffffff" strokeWidth="0.4" vectorEffect="non-scaling-stroke" opacity="0.35" />
              <circle className="hero-node" cx={m.x} cy={m.y} r="0.55" fill="#ffffff" style={{ animationDelay: '0.4s' }} />
              <text
                x={m.x + 2.4}
                y={m.y + 0.9}
                fill="#ffffff"
                opacity="0.4"
                style={{ fontSize: '2px', letterSpacing: '0.3px', fontFamily: 'inherit' }}
              >
                {m.label}
              </text>
            </g>
          ))}
        </g>
      </motion.svg>
      </motion.div>
    </div>
  )
}
