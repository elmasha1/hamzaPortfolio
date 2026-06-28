import { useEffect, useRef } from 'react'

/**
 * Starfield — a single <canvas> of small stars for the deep-space backdrop.
 *
 * Performance:
 *  - One canvas (not hundreds of DOM nodes); star count is capped and scaled
 *    to viewport area.
 *  - Twinkle = opacity only; drift + mouse parallax are simple per-frame math.
 *  - Parallax is disabled on touch / coarse-pointer devices.
 *  - `prefers-reduced-motion` → stars are drawn once, statically (no loop).
 */
const STAR_COLORS = ['rgba(255,255,255,', 'rgba(191,219,254,', 'rgba(147,197,253,']

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let w = 0
    let h = 0
    let stars = []
    let raf = 0
    let running = true
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    const starCount = () => {
      const area = window.innerWidth * window.innerHeight
      // ~1 star per 16k px², hard-capped — fewer stars for a calmer field.
      return Math.min(130, Math.round(area / 16000))
    }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Dim/thin out stars near the centre (behind the headline); keep the
      // brighter ones toward the edges so they never compete with the text.
      const cx = w / 2
      const cy = h * 0.4
      const maxD = Math.hypot(w / 2, h * 0.6) || 1
      stars = []
      const count = starCount()
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const distRatio = Math.min(1, Math.hypot(x - cx, y - cy) / maxD)
        // Fewer stars near the centre.
        if (distRatio < 0.22 && Math.random() < 0.55) continue
        const size = Math.random() * 2 + 1 // 1–3px
        // Dimmer overall, and scaled down hard toward the centre.
        const base = (Math.random() * 0.32 + 0.12) * (0.3 + 0.8 * distRatio)
        stars.push({
          x,
          y,
          r: size,
          depth: size / 3, // larger ⇒ closer ⇒ more parallax (fake distance)
          base,
          tw: Math.random() * 0.0016 + 0.0004, // twinkle speed
          ph: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.018 + 0.004, // slow downward drift
          color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0],
        })
      }
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      for (const s of stars) {
        if (!reduce) {
          s.y += s.drift
          if (s.y > h + 2) s.y = -2
        }
        const op = reduce
          ? s.base
          : s.base * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph))
        const px = s.x + mouse.x * s.depth * 24
        const py = s.y + mouse.y * s.depth * 24
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color + Math.max(0, Math.min(1, op)).toFixed(3) + ')'
        ctx.fill()
      }
    }

    const loop = (t) => {
      if (!running) return
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    build()
    if (reduce) {
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 150)
    }
    window.addEventListener('resize', onResize)

    let mraf = 0
    const onMove = (e) => {
      if (mraf) return
      mraf = requestAnimationFrame(() => {
        mraf = 0
        mouse.tx = e.clientX / w - 0.5
        mouse.ty = e.clientY / h - 0.5
      })
    }
    if (fine && !reduce) {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      if (mraf) cancelAnimationFrame(mraf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
